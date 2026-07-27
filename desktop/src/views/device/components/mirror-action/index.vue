<template>
  <el-button
    type="primary"
    text
    :disabled="['unauthorized', 'offline'].includes(row.status)"
    :loading="loading"
    :icon="loading ? '' : 'Monitor'"
    :title="loading ? $t('common.starting') : $t('device.mirror.start')"
    @click="handleClick(row)"
  >
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
      embeddedContainerId: '',
      scrcpyOutputBuffer: '',
    }
  },
  methods: {
    async handleClick(row = this.row) {
      this.loading = true

      this.toggleRowExpansion(row, true)

      const args = this.preferenceStore.scrcpyParameter(row.id)
      const title = this.deviceStore.getLabel(row, 'mirror')
      let launchArgs = args
      let containerId = ''

      try {
        const container = await window.$preload.ipcRenderer.invoke(
          'control:open-embedded',
          {
            device: toRaw(row),
            targetWindowTitle: title,
            scrcpyArgs: args,
          },
        )
        containerId = container?.containerId || ''
        this.embeddedContainerId = containerId
        const parentWindowHandle = container?.parentWindowHandle

        if (parentWindowHandle) {
          launchArgs = `${args} --parent-window-handle=${parentWindowHandle}`.trim()
        }

        const mirror = parentWindowHandle
          ? this.$scrcpy.mirrorEmbedded
          : this.$scrcpy.mirror
        const mirroring = mirror(row.id, {
          title,
          args: launchArgs,
          stdout: this.onStdout,
          stderr: this.onStderr,
        })

        // The patched Windows scrcpy creates its SDL child directly in the
        // container. Other platforms keep the existing floating toolbar.
        if (!parentWindowHandle) {
          openFloatControl(toRaw(row), { force: true })
        }

        await sleep(500)

        this.loading = false

        await mirroring
      }
      catch (error) {
        console.error('mirror.args', launchArgs)
        console.error('mirror.error', error)

        if (error.message) {
          this.$message.warning(error.message)
        }
      }
      finally {
        this.loading = false
        this.embeddedContainerId = ''
        this.scrcpyOutputBuffer = ''

        if (containerId) {
          window.$preload.ipcRenderer.invoke('control:close-embedded', {
            containerId,
          })
        }
        else {
          window.$preload.win.close('pages/control')
        }
      }
    },

    onStdout(data) {
      this.handleScrcpyOutput(data)
    },
    onStderr(data) {
      this.handleScrcpyOutput(data)
    },
    handleScrcpyOutput(data) {
      if (!this.embeddedContainerId)
        return

      this.scrcpyOutputBuffer = `${this.scrcpyOutputBuffer}${String(data)}`.slice(-4096)
      const matches = [...this.scrcpyOutputBuffer.matchAll(
        /(?:Texture|Video|Display):\s*(\d+)x(\d+)/gi,
      )]
      const match = matches.at(-1)

      if (!match)
        return

      window.$preload.ipcRenderer.invoke('control:set-video-size', {
        containerId: this.embeddedContainerId,
        width: Number(match[1]),
        height: Number(match[2]),
      })
      this.scrcpyOutputBuffer = ''
    },
  },
}
</script>

<style></style>
