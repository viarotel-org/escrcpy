<template>
  <slot :loading="loading" :trigger="handleClick" />
</template>

<script>
import { sleep } from '@/utils'

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

      const args = `--video-source=camera ${this.$store.preference.getScrcpyArgs(
        row.id,
        {
          excludes: ['--video-source', '--mouse', '--keyboard'],
          isCamera: true,
        },
      )}`

      try {
        const mirroring = this.$scrcpy.mirror(row.id, {
          title: this.$store.device.getLabel(row),
          args,
          stdout: this.onStdout,
          stderr: this.onStderr,
        })

        await sleep(1 * 1000)

        this.loading = false

        await mirroring
      }
      catch (error) {
        console.warn(error)

        if (error.message) {
          this.$message.warning(error.message)
        }

        this.handleReset()
      }
    },
    onStdout() {},
    onStderr() {
      this.loading = false
    },
  },
}
</script>

<style></style>
