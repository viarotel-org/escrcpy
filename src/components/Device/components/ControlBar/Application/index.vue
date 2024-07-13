<template>
  <div class="" @click="handleInstall(device)">
    <slot />
  </div>
</template>

<script>
import { allSettledWrapper } from '$/utils'

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
      return this.handleInstall(...args)
    },
    preferenceData(...args) {
      return this.$store.preference.getData(...args)
    },
    async handleInstall(device, { files } = {}) {
      if (!files) {
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
            const message
              = error.message?.match(/Error: (.*)/)?.[1] || error.message
            this.$message.warning(message)
          }
          return false
        }
      }

      const messageEl = this.$message.loading(
        this.$t('device.control.install.progress', {
          deviceName: this.$store.device.getLabel(device),
        }),
      )

      let failCount = 0

      await allSettledWrapper(files, (item) => {
        return this.$adb.install(device.id, item).catch((e) => {
          console.warn(e)
          ++failCount
        })
      })

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
        return false
      }

      this.$message.warning(this.$t('device.control.install.error'))
    },
  },
}
</script>

<style></style>
