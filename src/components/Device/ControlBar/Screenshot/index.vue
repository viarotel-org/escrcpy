<template>
  <div class="" @click="handleScreenCap(device)">
    <slot />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import LoadingIcon from '@/components/Device/ControlBar/LoadingIcon/index.vue'

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
          deviceName: device.$name,
        }),
        icon: LoadingIcon,
        duration: 0,
      })

      const fileName = `${device.$remark ? `${device.$remark}-` : ''}${
        device.$name
      }-${this.$replaceIP(device.id)}-screencap-${dayjs().format(
        'YYYY-MM-DD-HH-mm-ss',
      )}.png`

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
