<template>
  <div class="" @click="handleClick">
    <slot />
    <AppInstallProxy ref="appInstallProxyRef" />
  </div>
</template>

<script>
import AppInstallProxy from '$/components/Device/components/ControlBar/AppInstall/index.vue'
import { sleep } from '$/utils'

export default {
  components: {
    AppInstallProxy,
  },
  props: {
    devices: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    async handleClick() {
      for (let index = 0; index < this.devices.length; index++) {
        const item = this.devices[index]
        await this.$refs.appInstallProxyRef.handleInstall(item)
        await sleep(2 * 1000)
      }
    },
  },
}
</script>

<style></style>
