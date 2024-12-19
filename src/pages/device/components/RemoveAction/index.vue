<template>
  <EleTooltipButton
    type="danger"
    text
    :loading
    :icon="loading ? '' : 'Delete'"
    placement="top"
    :content="$t('common.remove')"
    @click="handleClick(device)"
  >
  </EleTooltipButton>
</template>

<script>
import { sleep } from '$/utils'

export default {
  props: {
    device: {
      type: Object,
      default: () => ({}),
    },
    handleRefresh: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    async handleClick(device = this.device) {
      this.loading = true

      const devices = { ...window.appStore.get('device') }

      delete devices[device.id]

      window.appStore.set('device', devices)

      this.handleRefresh()

      await sleep()

      this.loading = false
    },
  },
}
</script>

<style></style>
