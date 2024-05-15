<template>
  <div class="flex items-center flex-none space-x-2">
    <div class="w-86 flex-none">
      <el-autocomplete
        v-if="!showAutocomplete"
        ref="elAutocompleteRef"
        v-model="formData.host"
        placeholder="192.168.0.1"
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
              {{ item.host }}
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

    <div class="text-gray-500 text-sm flex-none">
      :
    </div>

    <el-input
      v-model.number="formData.port"
      type="number"
      placeholder="5555"
      :min="0"
      clearable
      class="!w-32 flex-none"
    >
    </el-input>

    <el-button
      type="primary"
      :icon="loading ? '' : 'Connection'"
      :loading="loading"
      class="flex-none"
      @click="handleConnect()"
    >
      {{ $t('device.wireless.connect.name') }}
    </el-button>

    <PairDialog ref="pairDialog" @success="onPairSuccess" />
  </div>
</template>

<script>
import PairDialog from './PairDialog/index.vue'

export default {
  components: {
    PairDialog,
  },
  props: {
    reload: {
      type: Function,
      default: () => () => false,
    },
  },
  data() {
    const wirelessList = this.$appStore.get('history.wireless') || []

    const lastIndex = wirelessList.length - 1
    const lastWireless = wirelessList[lastIndex] || {}

    return {
      loading: false,
      wirelessList,

      formData: {
        host: lastWireless.host,
        port: lastWireless.port,
      },

      showAutocomplete: false,
    }
  },
  async created() {
    const autoConnect = this.$store.preference.data.autoConnect
    if (autoConnect) {
      await this.handleBatch()
      this.reload()
    }
  },
  methods: {
    connect(...args) {
      return this.handleConnect(...args)
    },
    onSelect({ host, port }) {
      Object.assign(this.formData, {
        host,
        port,
      })
    },
    fetchSuggestions(value, callback) {
      let results = []

      if (value) {
        results = this.wirelessList.filter(
          item => item.host.toLowerCase().indexOf(value.toLowerCase()) === 0,
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
    onPairSuccess() {
      this.handleConnect()
    },
    handleRemove(info) {
      const index = this.wirelessList.findIndex(
        item => info.host === item.host && item.port === info.port,
      )

      if (index === -1) {
        return false
      }

      this.wirelessList.splice(index, 1)

      this.$appStore.set('history.wireless', this.$toRaw(this.wirelessList))

      this.reRenderAutocomplete()
    },

    async reRenderAutocomplete() {
      this.showAutocomplete = true

      await this.$nextTick()

      this.showAutocomplete = false
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
        const { host, port } = this.wirelessList[index]

        promises.push(
          this.$adb.connect(host, port || 5555).catch(() => {
            ++failCount
          }),
        )
      }

      this.loading = true
      await Promise.allSettled(promises)
      this.loading = false

      const successCount = totalCount - failCount

      if (successCount) {
        this.$message({
          message: this.$t('device.wireless.connect.batch.success', {
            totalCount,
            successCount,
            failCount,
          }),
          type: totalCount === successCount ? 'success' : 'warning',
        })
        return
      }

      this.$message.warning(this.$t('device.wireless.connect.batch.error'))
    },

    async handleConnect(params = this.formData) {
      if (!params.host) {
        this.$message.warning(
          this.$t('device.wireless.connect.error.no-address'),
        )
        return false
      }

      this.loading = true

      try {
        await this.$adb.connect(params.host, params.port || 5555)

        this.$message.success(this.$t('device.wireless.connect.success'))

        this.handleSave(params)
      }
      catch (error) {
        this.handleError(error?.message || error?.cause?.message || error)
      }

      this.loading = false
    },
    handleSave(params) {
      const someValue = this.wirelessList.some(
        item => item.host === params.host,
      )

      if (someValue) {
        return false
      }

      this.wirelessList.push({
        host: params.host,
        port: params.port,
      })

      this.$appStore.set('history.wireless', this.$toRaw(this.wirelessList))
    },
    async handleError(message) {
      try {
        await this.$confirm(
          `
        <div class="pb-4 text-sm text-red-500">${this.$t(
          'device.wireless.connect.error.detail',
        )}：${message}</div>
        <div>${this.$t('device.wireless.connect.error.reasons[0]')}：</div>
        <div>1. ${this.$t('device.wireless.connect.error.reasons[1]')} </div>
        <div>2. ${this.$t('device.wireless.connect.error.reasons[2]')} </div>
        <div>3. ${this.$t('device.wireless.connect.error.reasons[3]')} </div>
        <div>4. ${this.$t('device.wireless.connect.error.reasons[4]')} </div>
        <div>5. ${this.$t('device.wireless.connect.error.reasons[5]')} </div>
        `,
          this.$t('device.wireless.connect.error.title'),
          {
            dangerouslyUseHTMLString: true,
            closeOnClickModal: false,
            confirmButtonText: this.$t('device.wireless.pair'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning',
          },
        )
        this.$refs.pairDialog.show({ params: { ...this.formData } })
      }
      catch (error) {
        console.warn(error.message)
      }
    },
  },
}
</script>

<style></style>
