<template>
  <el-button
    type="primary"
    text
    :disabled="row.$unauthorized"
    :loading="loading"
    :icon="loading ? '' : 'Monitor'"
    @click="handleClick(row)"
  >
    {{ loading ? $t('common.starting') : $t('device.mirror.start') }}
  </el-button>
</template>

<script>
import { sleep } from '$/utils'
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
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    async handleClick(row = this.row) {
      this.loading = true

      this.toggleRowExpansion(row, true)

      const args = this.$store.preference.scrcpyParameter(row.id, {
        excludes: ['--otg', '--mouse=aoa', '--keyboard=aoa'],
      })

      try {
        const mirroring = this.$scrcpy.mirror(row.id, {
          title: this.$store.device.getLabel(row, 'mirror'),
          args,
          stdout: this.onStdout,
          stderr: this.onStderr,
        })

        await sleep(1 * 1000)

        this.loading = false

        openFloatControl(toRaw(this.row))

        await mirroring
      }
      catch (error) {
        console.error('mirror.args', args)
        console.error('mirror.error', error)

        if (error.message) {
          this.$message.warning(error.message)
        }
      }
    },

    onStdout() {},
    onStderr() {},
  },
}
</script>

<style></style>
