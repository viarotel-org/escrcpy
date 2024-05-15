<template>
  <div class="" @click="handleInstall(device)">
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
    async handleInstall(device) {
      let files = null

      try {
        files = await this.$electron.ipcRenderer.invoke('show-open-dialog', {
          properties: ['openFile', 'multiSelections'],
          filters: [
            {
              name: this.$t('device.control.install.placeholder'),
              extensions: ['apk'],
            },
          ],
        })
      }
      catch (error) {
        if (error.message) {
          const message = error.message?.match(/Error: (.*)/)?.[1]
          this.$message.warning(message || error.message)
        }
      }

      if (!files) {
        return false
      }

      const messageEl = this.$message({
        message: this.$t('device.control.install.progress', {
          deviceName: this.$store.device.getLabel(device),
        }),
        icon: LoadingIcon,
        duration: 0,
      })

      let failCount = 0

      for (let index = 0; index < files.length; index++) {
        const item = files[index]
        await this.$adb.install(device.id, item).catch((e) => {
          console.warn(e)
          ++failCount
        })
      }

      messageEl.close()

      const totalCount = files.length
      const successCount = totalCount - failCount

      if (successCount) {
        if (totalCount > 1) {
          this.$message.success(
            this.$t('device.control.install.success', {
              deviceName: this.$store.device.getLabel(device),
              totalCount,
              successCount,
              failCount,
            }),
          )
        }
        else {
          this.$message.success(
            this.$t('device.control.install.success.single', {
              deviceName: this.$store.device.getLabel(device),
            }),
          )
        }
        return
      }

      this.$message.warning(this.$t('device.control.install.error'))
    },
  },
}
</script>

<style></style>
