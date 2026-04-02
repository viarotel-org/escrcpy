<template>
  <el-dropdown
    :trigger="trigger"
    :max-height="maxHeight"
    v-bind="$attrs"
    @visible-change="onVisibleChange"
    @mouseenter="loadAppList"
    @keydown.stop
  >
    <slot :current="current" :loading="loading" />

    <template #dropdown>
      <el-dropdown-menu>
        <div class="sticky top-0 z-10 px-2 pt-2 pb-2 bg-[var(--el-bg-color-overlay)] border-b dark:border-gray-700">
          <el-input
            v-model="keyword"
            class="!w-full"
            :placeholder="$t('common.search')"
            prefix-icon="Search"
          />
        </div>

        <el-dropdown-item
          v-for="item of options"
          :key="item.value"
          :command="item.value"
          :divided="item.divided"
          :icon="item.icon"
          :title="item.packageName"
          @click="onSelect(item)"
        >
          <div :class="showActions ? 'pr-12' : ''">
            {{ item.label }}
          </div>

          <div v-if="showActions" class="absolute inset-y-center right-1 z-5 flex items-center">
            <slot name="actions" :item="item" />
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { pinyin } from 'pinyin-pro'
import { sleep } from '$/utils'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  deviceId: {
    type: String,
    default: '',
  },
  trigger: {
    type: String,
    default: 'click',
  },
  withHome: {
    type: Boolean,
    default: false,
  },
  showActions: {
    type: Boolean,
    default: false,
  },
  maxHeight: {
    type: String,
    default: '300px',
  },
  labelFormatter: {
    type: Function,
    default: item => `${item.name || item.label}[${item.packageName}]`,
  },
})

const emit = defineEmits(['change'])

const modelValue = defineModel({
  type: String,
  default: null,
})

const appList = ref([])
const loading = ref(false)
const loaded = ref(false)
const keyword = ref('')

const options = computed(() => {
  const value = appList.value.map(item => ({
    ...item,
    label: props.labelFormatter(item),
    value: item.packageName,
  }))

  if (props.withHome) {
    value.unshift({
      label: window.t('device.control.home'),
      value: '',
      icon: 'HomeFilled',
    })
  }

  if (keyword.value) {
    return value.filter((item) => {
      const pinyinLabel = pinyin(item.label, { toneType: 'none' }).replaceAll(' ', '')
      const matchText = [item.label, item.value, pinyinLabel, pinyinLabel.toLowerCase()].join('')
      return matchText.includes(keyword.value)
    })
  }

  return value
})

const current = computed(() => {
  const found = options.value.find(item => item.value === modelValue.value)
  return found || null
})

async function loadAppList() {
  if (loaded.value || loading.value || !props.deviceId)
    return

  loading.value = true
  try {
    const data = await window.$preload.scrcpy.getAppList(props.deviceId)
    appList.value = data || []
    loaded.value = true
  }
  catch {
    appList.value = []
  }
  finally {
    loading.value = false
  }
}

async function onVisibleChange(val) {
  if (!val) {
    await sleep()
    keyword.value = ''
  }
}

function onSelect(item) {
  modelValue.value = item.value
  emit('change', item.value, item)
}

watch(() => props.deviceId, () => {
  loaded.value = false
  appList.value = []
})

defineExpose({ loadAppList, appList, loading })
</script>
