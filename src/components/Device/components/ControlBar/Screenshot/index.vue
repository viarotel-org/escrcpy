<template>
  <div class="" @click="handleCapture(device)">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    device: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {}
  },
  methods: {
    invoke(...args) {
      return this.handleCapture(...args)
    },
    preferenceData(...args) {
      return this.$store.preference.getData(...args)
    },
    async handleCapture(device) {
      const messageEl = this.$message.loading(
        this.$t('device.control.capture.progress', {
          deviceName: this.$store.device.getLabel(device),
        }),
      )

      const fileName = this.$store.device.getLabel(
        device,
        ({ time }) => `screenshot-${time}.jpg`,
      )

      const deviceConfig = this.preferenceData(device.id)
      const savePath = this.$path.resolve(deviceConfig.savePath, fileName)

      try {
        await this.$adb.screencap(device.id, { savePath })
        await this.handleSuccess(savePath)
      }
      catch (error) {
        if (error.message) {
          this.$message.warning(error.message)
        }
      }

      messageEl.close()
    },
    async handleSuccess(savePath) {
      return this.$message.success(
        `${this.$t(
          'device.control.capture.success.message.title',
        )}: ${savePath}`,
      )
    },
  },
}
</script>

<style></style>
