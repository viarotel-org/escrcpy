<template>
  <div class="" @click="handleClick">
    <slot v-bind="{ loading }" />
    <ApplicationProxy ref="applicationProxyRef" />
  </div>
</template>

<script>
import ApplicationProxy from '$/components/Device/components/ControlBar/Application/index.vue'
import { allSettled } from '$/utils'

export default {
  components: {
    ApplicationProxy,
  },
  props: {
    devices: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    async handleClick() {
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
          const message
            = error.message?.match(/Error: (.*)/)?.[1] || error.message
          this.$message.warning(message)
        }
        return false
      }

      this.loading = true

      await allSettled(this.devices, (item) => {
        return this.$refs.applicationProxyRef.invoke(item, { files })
      })

      this.loading = false
    },
  },
}
</script>

<style></style>
