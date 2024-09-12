<template>
  <slot :loading="loading" :trigger="handleClick" />
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
    async handleClick() {
      const row = this.row

      this.loading = true

      this.toggleRowExpansion(row, true)

      const savePath = this.getRecordPath(row)

      const args = this.$store.preference.getScrcpyArgs(row.id, {
        isRecord: true,
        excludes: ['--otg', '--mouse=aoa', '--keyboard=aoa'],
      })

      try {
        const recording = this.$scrcpy.record(row.id, {
          title: this.$store.device.getLabel(row, 'recording'),
          savePath,
          args,
          stdout: this.onStdout,
          stderr: this.onStderr,
        })

        await sleep(1 * 1000)

        this.loading = false

        openFloatControl(toRaw(this.row))

        await recording

        await this.handleSuccess(savePath)
      }
      catch (error) {
        console.error('record.args', args)
        console.error('record.error', error)

        if (error.message) {
          this.$message.warning(error.message)
        }
      }
    },
    onStdout() {},
    onStderr() {},
    getRecordPath(row) {
      const config = this.$store.preference.getData(row.id)
      const basePath = config.savePath
      const extension = config['--record-format'] || 'mp4'

      const fileName = this.$store.device.getLabel(
        row,
        ({ time }) => `record-${time}.${extension}`,
      )

      const joinValue = this.$path.join(basePath, fileName)
      const value = this.$path.normalize(joinValue)

      return value
    },
    async handleSuccess(savePath) {
      return this.$message.success(
        `${this.$t('device.record.success.title')}: ${savePath}`,
      )
    },
  },
}
</script>

<style></style>
