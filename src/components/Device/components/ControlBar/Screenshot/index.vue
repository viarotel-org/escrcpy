<template>
  <div class="" @click="handleScreenCap(device)">
    <slot />
  </div>
</template>

<script>
import LoadingIcon from '$/components/Device/components/LoadingIcon/index.vue'

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
    preferenceData(...args) {
      return this.$store.preference.getData(...args)
    },
    async handleScreenCap(device) {
      const messageEl = this.$message({
        message: this.$t('device.control.capture.progress', {
          deviceName: this.$store.device.getLabel(device),
        }),
        icon: LoadingIcon,
        duration: 0,
      })

      const fileName = this.$store.device.getLabel(
        device,
        ({ time }) => `screenshot-${time}.png`,
      )

      const deviceConfig = this.preferenceData(device.id)
      const savePath = this.$path.resolve(deviceConfig.savePath, fileName)

      try {
        await this.$adb.screencap(device.id, { savePath })
        this.handleScreencapSuccess(savePath)
      }
      catch (error) {
        if (error.message) {
          this.$message.warning(error.message)
        }
      }

      messageEl.close()
    },
    async handleScreencapSuccess(savePath) {
      try {
        await this.$confirm(
          this.$t('device.control.capture.success.message'),
          this.$t('device.control.capture.success.message.title'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            closeOnClickModal: false,
            type: 'success',
          },
        )

        await this.$electron.ipcRenderer.invoke(
          'show-item-in-folder',
          savePath,
        )
      }
      catch (error) {
        if (error.message) {
          this.$message.warning(error.message)
        }
      }
    },
  },
}
</script>

<style></style>
