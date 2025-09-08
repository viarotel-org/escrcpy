<template>
  <div class="flex items-center flex-none space-x-2">
    <div class="w-96 flex-none">
      <el-autocomplete
        :key="autocompleteKey"
        ref="elAutocompleteRef"
        v-model="address"
        placeholder="192.168.0.1:5555"
        clearable
        :fetch-suggestions="fetchSuggestions"
        class="!w-full"
        value-key="host"
        @select="onSelect"
      >
        <template #prepend>
          {{ $t('device.wireless.name') }}
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

    <el-button-group>
      <el-button
        type="primary"
        :icon="loading ? '' : 'Connection'"
        :loading="loading"
        class="flex-none !border-none"
        @click="handleConnect()"
      >
        {{ $t('device.wireless.connect.name') }}
      </el-button>

      <el-button
        v-if="loading"
        type="default"
        plain
        class="flex-none"
        @click="handleUnConnect()"
      >
        {{ $t('common.cancel') }}
      </el-button>
    </el-button-group>

    <QrAction v-bind="{ handleRefresh }" />

    <PairDialog ref="pairDialog" @success="onPairSuccess" />
  </div>
</template>

<script>
import { parseDeviceId, sleep } from '$/utils'
import PairDialog from './PairDialog/index.vue'
import QrAction from './QrAction/index.vue'

export default {
  components: {
    PairDialog,
    QrAction,
  },
  props: {
    handleRefresh: {
      type: Function,
      default: () => () => false,
    },
  },
  emits: ['auto-connected'],
  setup() {
    const preferenceStore = usePreferenceStore()
    const deviceStore = useDeviceStore()
    return {
      preferenceStore,
      deviceStore,
    }
  },
  data() {
    return {
      loading: false,

      address: '',

      autocompleteKey: 0,
    }
  },
  computed: {
    wirelessList() {
      const value = this.deviceStore.list.filter(item => item.wifi)
      return value
    },
  },
  watch: {
    'wirelessList.length': {
      handler(val) {
        if (val) {
          this.getAddress()
        }
      },
      immediate: true,
    },
  },
  async created() {
    const unwatch = this.$watch('wirelessList', async (val) => {
      unwatch()

      if (!val) {
        return false
      }

      this.handleConnectAuto()
    })
  },
  methods: {
    async handleConnectAuto() {
      const autoConnect = this.preferenceStore.data.autoConnect

      if (autoConnect) {
        await this.handleBatch()
        this.handleRefresh()
        this.$emit('auto-connected')
      }
    },
    getAddress() {
      const lastIndex = this.wirelessList.length - 1
      const lastWireless = this.wirelessList[lastIndex]

      if (lastWireless) {
        this.address = lastWireless.id
      }
    },
    connect(...args) {
      return this.handleConnect(...args)
    },
    fetchSuggestions(value, callback) {
      let results = []

      if (value) {
        results = this.wirelessList.filter(
          item => item.id.toLowerCase().indexOf(value.toLowerCase()) === 0,
        )
      }
      else {
        results = [...this.wirelessList]
      }

      results.push({
        batch: this.$t('device.wireless.connect.batch.name'),
      })

      callback(results)
    },
    onSelect(device) {
      this.address = device.id
    },
    onPairSuccess() {
      this.handleConnect()
    },
    handleRemove(info) {
      const index = this.wirelessList.findIndex(
        item => info.id === item.id,
      )

      if (index === -1) {
        return false
      }

      this.wirelessList.splice(index, 1)

      ++this.autocompleteKey
    },

    async handleBatch() {
      if (this.loading) {
        return false
      }

      const totalCount = this.wirelessList.length

      if (!totalCount) {
        return false
      }

      let failCount = 0

      const promises = []

      for (let index = 0; index < totalCount; index++) {
        const { id } = this.wirelessList[index]

        promises.push(
          this.$adb.connect(id).catch(() => {
            ++failCount
          }),
        )
      }

      this.loading = true
      await Promise.allSettled(promises)
      this.loading = false
    },

    handleUnConnect() {
      this.loading = false
    },

    async handleConnect(address = this.address) {
      if (!address) {
        this.$message.warning(
          this.$t('device.wireless.connect.error.no-address'),
        )
        return false
      }

      this.loading = true

      try {
        await this.$adb.connect(address)
        await sleep()

        this.$message.success(this.$t('device.wireless.connect.success'))
      }
      catch (error) {
        if (this.loading) {
          this.handleError(error?.message || error?.cause?.message || error)
        }
      }

      this.handleRefresh()

      this.loading = false
    },
    async handleError(message) {
      try {
        await this.$confirm(
          `<div class="pt-4 pl-4">
            <div class="text-sm text-red-500 pb-4">${this.$t(
              'device.wireless.connect.error.detail',
            )}：${message}</div>
            <div>${this.$t('device.wireless.connect.error.reasons[0]')}：</div>
            <div>1. ${this.$t(
              'device.wireless.connect.error.reasons[1]',
            )} </div>
            <div>2. ${this.$t(
              'device.wireless.connect.error.reasons[2]',
            )} </div>
            <div>3. ${this.$t(
              'device.wireless.connect.error.reasons[3]',
            )} </div>
            <div>4. ${this.$t(
              'device.wireless.connect.error.reasons[4]',
            )} </div>
          </div>`,
          this.$t('device.wireless.connect.error.title'),
          {
            dangerouslyUseHTMLString: true,
            closeOnClickModal: false,
            confirmButtonText: this.$t('device.wireless.pair'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning',
          },
        )
        this.$refs.pairDialog.show({ params: { ...parseDeviceId(this.address) } })
      }
      catch (error) {
        console.warn(error.message)
      }
    },
  },
}
</script>

<style></style>
