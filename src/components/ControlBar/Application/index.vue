<template>
  <div class="" @click="handleInstall(device)">
    <slot />
  </div>
</template>

<script>
import { allSettledWrapper } from '$/utils'
import { adaptiveMessage } from '$/utils/modal/index.js'

export default {
  props: {
    device: {
      type: Object,
      default: () => ({}),
    },
    floating: {
      type: Boolean,
      default: () => false,
    },
  },
  setup() {
    const deviceStore = useDeviceStore()
    return {
      deviceStore,
    }
  },
  data() {
    return {}
  },
  methods: {
    invoke(...args) {
      return this.handleInstall(...args)
    },
    async handleInstall(device, { files, silent = false } = {}) {
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

            adaptiveMessage(message, { type: 'warning', system: this.floating })
          }

          return false
        }
      }

      let closeLoading = null
      if (!silent) {
        closeLoading = adaptiveMessage(
          this.$t('device.control.install.progress', {
            deviceName: this.deviceStore.getLabel(device),
          }),
          {
            type: 'loading',
            system: this.floating,
          },
        ).close
      }

      let failCount = 0

      await allSettledWrapper(files, (item) => {
        return this.$adb.install(device.id, item).catch((e) => {
          console.warn(e)
          ++failCount
        })
      })

      if (silent) {
        return false
      }

      closeLoading?.()

      const totalCount = files.length
      const successCount = totalCount - failCount

      if (successCount) {
        if (totalCount > 1) {
          adaptiveMessage(
            this.$t('device.control.install.success', {
              deviceName: this.deviceStore.getLabel(device),
              totalCount,
              successCount,
              failCount,
            }),
            {
              type: 'success',
              system: this.floating,
            },
          )
        }
        else {
          adaptiveMessage(
            this.$t('device.control.install.success.single', {
              deviceName: this.deviceStore.getLabel(device),
            }),
            {
              type: 'success',
              system: this.floating,
            },
          )
        }
        return false
      }

      adaptiveMessage(this.$t('device.control.install.error'), {
        type: 'warning',
        system: this.floating,
      })
    },
  },
}
</script>

<style></style>
