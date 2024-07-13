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
    async handleCapture(device, { silent = false } = {}) {
      let closeLoading
      if (!silent) {
        closeLoading = this.$message.loading(
          this.$t('device.control.capture.progress', {
            deviceName: this.$store.device.getLabel(device),
          }),
        ).close
      }

      const fileName = this.$store.device.getLabel(
        device,
        ({ time }) => `screenshot-${time}.jpg`,
      )

      const deviceConfig = this.preferenceData(device.id)
      const savePath = this.$path.resolve(deviceConfig.savePath, fileName)

      try {
        await this.$adb.screencap(device.id, { savePath })
      }
      catch (error) {
        if (error.message) {
          this.$message.warning(error.message)
        }
        return false
      }

      if (silent) {
        return false
      }

      closeLoading()

      this.$message.success(
        `${this.$t(
          'device.control.capture.success.message.title',
        )}: ${savePath}`,
      )
    },
  },
}
</script>

<style></style>
