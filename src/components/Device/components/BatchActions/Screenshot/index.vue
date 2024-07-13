<template>
  <div class="" @click="handleClick">
    <slot v-bind="{ loading }" />
    <ScreenshotProxy ref="screenshotProxyRef" />
  </div>
</template>

<script>
import ScreenshotProxy from '$/components/Device/components/ControlBar/Screenshot/index.vue'
import { allSettledWrapper, sleep } from '$/utils'

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
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    async handleClick() {
      this.loading = true

      await allSettledWrapper(this.devices, (item) => {
        return this.$refs.screenshotProxyRef.invoke(item)
      })

      this.loading = false
    },
  },
}
</script>

<style></style>
