<template>
  <EleTooltipButton
    v-if="!row.wifi"
    type="primary"
    text
    :disabled="['unauthorized', 'offline'].includes(row.status)"
    placement="top"
    :content="$t('device.wireless.mode')"
    @click="handleWifi(row)"
  >
    <template #icon>
      <svg-icon name="wifi" class=""></svg-icon>
    </template>
  </EleTooltipButton>

  <EleTooltipButton
    v-if="row.wifi"
    type="danger"
    text
    :loading="stopLoading"
    :disabled="['unauthorized', 'offline'].includes(row.status)"
    :icon="stopLoading ? '' : 'Close'"
    placement="top"
    :content="stopLoading
      ? $t('device.wireless.disconnect.progress')
      : $t('device.wireless.disconnect.start')"
    @click="handleStop(row)"
  >
  </EleTooltipButton>
</template>

<script>
import { sleep } from '$/utils'

export default {
  inheritAttrs: false,
  props: {
    row: {
      type: Object,
      default: () => ({}),
    },
    handleConnect: {
      type: Function,
      default: () => () => false,
    },
    handleRefresh: {
      type: Function,
      default: () => () => false,
    },
  },
  data() {
    return {
      stopLoading: false,
    }
  },
  methods: {
    async handleWifi(row) {
      try {
        const host = await this.$adb.getDeviceIP(row.id)

        if (!host) {
          throw new Error(this.$t('device.wireless.mode.error'))
        }

        const port = await this.$adb.tcpip(row.id, 5555)

        await sleep()

        this.handleConnect(`${host}:${port}`)
      }
      catch (error) {
        console.warn(error.message)
        if (error?.message || error?.cause?.message) {
          this.$message.warning(error?.message || error?.cause?.message)
        }
      }
    },

    async handleStop(row) {
      this.stopLoading = true

      try {
        await this.$adb.disconnect(row.id)
        await sleep()
        this.$message.success(this.$t('device.wireless.disconnect.success'))
      }
      catch (error) {
        if (error.message)
          this.$message.warning(error.message)
      }

      this.handleRefresh()

      this.stopLoading = false
    },
  },
}
</script>

<style></style>
