<template>
  <slot :loading="loading" :trigger="handleClick" />

  <DeployDialog ref="deployDialogRef" />
</template>

<script>
import DeployDialog from './components/DeployDialog/index.vue'
import { sleep } from '$/utils'

export default {
  components: {
    DeployDialog,
  },
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

      let args = ''

      try {
        args = await this.$refs.deployDialogRef.open(row)
      }
      catch (error) {
        this.loading = false
        this.$message.warning(error.message)
        return false
      }

      /** TODO */
      const isCamera = ['--camera-facing'].some(key => args.includes(key))
      if (isCamera) {
        args += ' --video-source=camera'
      }

      this.toggleRowExpansion(row, true)

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
