<template>
  <el-button
    v-if="!row.$wifi"
    type="primary"
    text
    :disabled="row.$unauthorized"
    @click="handleWifi(row)"
  >
    <template #icon>
      <svg-icon name="wifi"></svg-icon>
    </template>
    {{ $t('device.wireless.mode') }}
  </el-button>

  <el-button
    v-if="row.$wifi"
    type="danger"
    text
    :loading="stopLoading"
    :disabled="row.$unauthorized"
    :icon="stopLoading ? '' : 'CircleClose'"
    @click="handleStop(row)"
  >
    {{
      stopLoading
        ? $t('device.wireless.disconnect.progress')
        : $t('device.wireless.disconnect.start')
    }}
  </el-button>
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

        this.handleConnect({
          host,
          port,
        })
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

      const [host, port] = row.id.split(':')

      try {
        await this.$adb.disconnect(host, port)
        await sleep()
        this.$message.success(this.$t('device.wireless.disconnect.success'))
      }
      catch (error) {
        if (error.message)
          this.$message.warning(error.message)
      }

      this.stopLoading = false
    },
  },
}
</script>

<style></style>
