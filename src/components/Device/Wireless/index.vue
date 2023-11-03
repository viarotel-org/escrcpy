<template>
  <div class="flex items-center flex-none space-x-2">
    <el-autocomplete
      v-model="formData.host"
      placeholder="192.168.0.1"
      clearable
      :fetch-suggestions="fetchSuggestions"
      class="!w-86 flex-none"
      value-key="host"
      @select="onSelect"
    >
      <template #prepend>
        {{ $t("device.wireless.name") }}
      </template>
    </el-autocomplete>
    <div class="text-gray-500 text-sm">
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
      @click="handleConnect()"
    >
      {{ $t("device.wireless.connect.name") }}
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
    }
  },
  methods: {
    connect(...args) {
      return this.handleConnect(...args)
    },
    onSelect({ host, port }) {
      // console.log('onSelect.value', value)
      Object.assign(this.formData, {
        host,
        port,
      })
    },
    fetchSuggestions(value, callback) {
      // console.log('fetchSuggestions.value', value)

      let results = []

      if (value) {
        results = this.wirelessList.filter(
          item => item.host.toLowerCase().indexOf(value.toLowerCase()) === 0,
        )
      }
      else {
        results = this.wirelessList
      }

      callback(results)
    },
    onPairSuccess() {
      this.handleConnect()
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
