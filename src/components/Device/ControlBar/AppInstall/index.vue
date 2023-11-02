<template>
  <div class="" @click="handleInstall(device)">
    <slot />
  </div>
</template>

<script>
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
          this.$message.warning(error.message)
        }
      }

      if (!files) {
        return false
      }

      const messageEl = this.$message({
        message: this.$t('device.control.install.progress', {
          deviceName: device.$name,
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
              deviceName: device.$name,
              totalCount,
              successCount,
              failCount,
            }),
          )
        }
        else {
          this.$message.success(
            this.$t('device.control.install.success.single', {
              deviceName: device.$name,
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
