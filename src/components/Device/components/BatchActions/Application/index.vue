<template>
  <div class="" @click="handleClick">
    <slot />
    <ApplicationProxy ref="applicationProxyRef" />
  </div>
</template>

<script>
import ApplicationProxy from '$/components/Device/components/ControlBar/Application/index.vue'
import { sleep } from '$/utils'

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
  methods: {
    async handleClick() {
      for (let index = 0; index < this.devices.length; index++) {
        const item = this.devices[index]
        await this.$refs.applicationProxyRef.invoke(item)
        await sleep(2 * 1000)
      }
    },
  },
}
</script>

<style></style>
