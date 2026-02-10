<template>
  <div class="flex items-center flex-none space-x-2">
    <div class="w-72 flex-none">
      <el-autocomplete
        :key="autocompleteKey"
        ref="elAutocompleteRef"
        v-model="address"
        placeholder="192.168.0.1:5555"
        clearable
        :fetch-suggestions="fetchSuggestions"
        class="!w-full el-autocomplete--wireless"
        value-key="host"
        @select="onSelect"
        @keydown.enter.prevent="handleConnect()"
        @keydown.escape="handleUnConnect()"
      >
        <template #prepend>
          <el-button icon="Switch" :title="$t('device.wireless.switch')" @click="onPairToggle()">
          </el-button>
        </template>

        <template #default="{ item }">
          <div
            v-if="item.batch"
            class="text-primary-500"
            @click.stop="handleBatch"
          >
            {{ item.batch }}
          </div>

          <div v-else class="flex items-center">
            <div class="flex-1 w-0">
              {{ item.id }}
            </div>
            <div
              class="flex-none leading-none"
              @click.prevent.stop="handleRemove(item)"
            >
              <el-icon class="hover:text-primary-500 !active:text-primary-700">
                <Close />
              </el-icon>
            </div>
          </div>
        </template>
      </el-autocomplete>
    </div>

    <div class="flex-none overflow-hidden transition-all duration-300" :class="pairVisible ? 'w-26' : 'w-0 !mx-0'">
      <el-input v-model="pairCode" class="!w-full" :placeholder="$t('device.wireless.pair.code')" :title="$t('device.wireless.pair.code')"></el-input>
    </div>

    <el-button-group class="flex-none">
      <el-button
        type="default"
        :icon="loading ? '' : 'Connection'"
        :loading="loading"
        class="flex-none"
        @click="handleConnect()"
      >
        {{ $t('device.wireless.connect.name') }}
      </el-button>

      <el-button
        v-if="loading"
        type="default"
        class="flex-none"
        @click="handleUnConnect()"
      >
        {{ $t('common.cancel') }}
      </el-button>
    </el-button-group>

    <div class="flex-none h-4 w-px bg-gray-300 dark:bg-gray-700"></div>

    <QrAction v-bind="{ handleRefresh }" />
  </div>
</template>

<script setup>
import { sleep } from '$/utils'
import { parseDeviceId } from '$/utils/device'
import QrAction from './qr-action/index.vue'

const props = defineProps({
  handleRefresh: {
    type: Function,
    default: () => () => false,
  },
})

const emit = defineEmits(['auto-connected'])

const handleRefresh = props.handleRefresh

const preferenceStore = usePreferenceStore()
const deviceStore = useDeviceStore()

const loading = ref(false)
const address = ref('')
const autocompleteKey = ref(0)
const pairCode = ref('')
const pairVisible = useStorage('device-wireless-pair-visible', false)

const elAutocompleteRef = ref()

const wirelessList = computed(() =>
  deviceStore.list.filter(item => item.wifi),
)

watch(
  () => wirelessList.value.length,
  (val) => {
    if (val)
      getAddress()
  },
  { immediate: true },
)

onMounted(() => {
  const unwatch = watch(
    wirelessList,
    async (val) => {
      unwatch()
      if (!val)
        return
      handleConnectAuto()
    },
  )
})

function onPairToggle(val) {
  pairVisible.value = val ?? !pairVisible.value

  if (!pairVisible.value) {
    pairCode.value = ''
  }
}

async function handleConnectAuto() {
  if (!preferenceStore.data.autoConnect)
    return

  await handleBatch()
  handleRefresh()
  emit('auto-connected')
}

function getAddress() {
  const last = wirelessList.value.at(-1)
  if (last)
    address.value = last.id
}

function fetchSuggestions(value, callback) {
  let results = []

  if (value) {
    results = wirelessList.value.filter(item =>
      item.id.toLowerCase().startsWith(value.toLowerCase()),
    )
  }
  else {
    results = [...wirelessList.value]
  }

  results.push({
    batch: window.t('device.wireless.connect.batch.name'),
  })

  callback(results)
}

function onSelect(device) {
  address.value = device.id
}

function handleRemove(info) {
  const index = wirelessList.value.findIndex(
    item => item.id === info.id,
  )

  if (index === -1)
    return

  wirelessList.value.splice(index, 1)
  autocompleteKey.value++
}

async function handleBatch() {
  if (loading.value)
    return

  const list = wirelessList.value
  if (!list.length)
    return

  loading.value = true

  const promises = list.map(({ id }) =>
    window.$preload.adb.connect(id).catch(() => {}),
  )

  await Promise.allSettled(promises)
  loading.value = false
}

function handleUnConnect() {
  loading.value = false
}

async function handleConnect(addr = address.value) {
  if (!addr) {
    ElMessage.warning(
      window.t('device.wireless.connect.error.no-address'),
    )
    return
  }

  if (pairCode.value) {
    try {
      const { host, port } = parseDeviceId(address.value)
      await window.$preload.adb.pair(host, port, pairCode.value)
      pairCode.value = ''

      await sleep()
      ElMessage.success(window.t('device.wireless.pair.success'))
    }
    catch (error) {
      console.warn(error.message)
      ElMessage.warning(window.t('device.wireless.pair.error'))
    }

    return
  }

  loading.value = true

  try {
    await window.$preload.adb.connect(addr)
    await sleep()
    ElMessage.success(window.t('device.wireless.connect.success'))
  }
  catch (error) {
    ElMessage.warning(error?.message || error?.cause?.message || error)
  }
  finally {
    loading.value = false
  }

  handleRefresh()
  loading.value = false
}

defineExpose({
  connect: handleConnect,
})
</script>

<style lang="postcss" scoped>
</style>
