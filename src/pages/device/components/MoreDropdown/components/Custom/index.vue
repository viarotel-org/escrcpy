<template>
  <slot :loading="loading" :trigger="handleClick" />

  <DeployDialog ref="deployDialogRef" @success="handleScrcpy" />
</template>

<script>
import { sleep } from '$/utils'
import { openFloatControl } from '$/utils/device/index.js'

import DeployDialog from './components/DeployDialog/index.vue'

export default {
  components: {
    DeployDialog,
  },
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
    const deviceStore = useDeviceStore()
    return {
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

      this.$refs.deployDialogRef.open({ row })
    },
    async handleScrcpy(args) {
      const row = this.row

      this.loading = true

      /** TODO */
      const isCamera = ['--camera-facing'].some(key => args.includes(key))
      if (isCamera) {
        args += ' --video-source=camera'
      }

      this.toggleRowExpansion(row, true)

      try {
        const mirroring = this.$scrcpy.mirror(row.id, {
          title: this.deviceStore.getLabel(row, 'custom'),
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
