<template>
  <slot :loading="loading" :trigger="handleClick" />
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
    async handleClick() {
      const row = this.row

      this.loading = true

      this.toggleRowExpansion(row, true)

      const args = `--otg ${this.preferenceStore.scrcpyParameter(row.id, {
        excludes: [
          '--mouse=uhid',
          '--keyboard=uhid',
          '--turn-screen-off',
          '--power-off-on-close',
          '--stay-awake',
          '--show-touches',
        ],
        isOtg: true,
      })}`

      try {
        const mirroring = this.$scrcpy.mirror(row.id, {
          title: this.deviceStore.getLabel(row),
          args,
          stdout: this.onStdout,
          stderr: this.onStderr,
        })

        await sleep(1 * 1000)

        this.loading = false

        await mirroring
      }
      catch (error) {
        console.error('otg.args', args)
        console.error('otg.error', error)

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
