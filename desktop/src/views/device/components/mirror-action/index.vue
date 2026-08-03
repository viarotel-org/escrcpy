<template>
  <el-button
    type="primary"
    text
    circle
    :disabled="['unauthorized', 'offline'].includes(row.status)"
    :loading="loading"
    :icon="loading ? '' : 'Monitor'"
    :title="loading ? $t('common.starting') : $t('device.mirror.start')"
    @click="handleClick(row)"
  >
  </el-button>
</template>

<script>
import { openFloatControl } from '$/utils/device/index.js'

export default {
  props: {
    row: {
      type: Object,
      default: () => ({}),
    },
    toggleRowExpansion: {
      type: Function,
      default: () => () => false,
    },
  },
  setup() {
    const preferenceStore = usePreferenceStore()
    const deviceStore = useDeviceStore()
    return {
      preferenceStore,
      deviceStore,
    }
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    async handleClick(row = this.row) {
      this.toggleRowExpansion(row, true)

      const args = this.preferenceStore.scrcpyParameter(row.id)

      const mirroring = this.$scrcpy.mirror(row.id, {
        title: this.deviceStore.getLabel(row, 'mirror'),
        args,
        resolveOnReady: true,
        stdout: this.onStdout,
        stderr: this.onStderr,
      })

      this.loading = true

      try {
        await mirroring
        openFloatControl(toRaw(row))
      }
      catch (error) {
        console.error('mirror.args', args)
        console.error('mirror.error', error)

        if (error.message) {
          this.$message.warning(error.message)
        }
      }

      this.loading = false
    },
    onStdout() {},
    onStderr() {},
  },
}
</script>

<style></style>
