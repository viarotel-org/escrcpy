<template>
  <div class="" @click="handleClick">
    <slot />
    <ScreenshotProxy ref="screenshotProxyRef" />
  </div>
</template>

<script>
import ScreenshotProxy from '$/components/Device/components/ControlBar/Screenshot/index.vue'
import { sleep } from '$/utils'

export default {
  components: {
    ScreenshotProxy,
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
        await this.$refs.screenshotProxyRef.invoke(item)
        await sleep(1 * 1000)
      }
    },
  },
}
</script>

<style></style>
