<template>
  <slot :loading="loading" :trigger="handleClick" />
</template>

<script>
import { sleep } from '$/utils'
import { openFloatControl } from '$/utils/device/index.js'

const recordModel = {
  default: {
    excludes: [],
    commands: [],
    extname: config => config['--record-format'] || 'mp4',
    label: 'Recording',
  },
  audio: {
    excludes: ['--video-source', '--no-audio', '--mouse'],
    commands: ['--no-video', '--mouse=disabled'],
    extname: config => config['--audio-record-format'] || 'opus',
    label: 'RecordingAudio',
  },
  camera: {
    excludes: ['--video-source', '--turn-screen-off', '--show-touches', '--no-power-on', '--stay-awake', '--power-off-on-close'],
    commands: ['--video-source=camera'],
    extname: config => config['--record-format'] || 'mp4',
    label: 'RecordingCamera',
  },
}

export default {
  inheritAttrs: false,
  props: {
    recordType: {
      type: String,
      default: 'default',
    },
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
  computed: {
    activeModel() {
      return recordModel[this.recordType]
    },
  },
  methods: {
    async handleClick() {
      const row = this.row

      this.loading = true

      this.toggleRowExpansion(row, true)

      const savePath = this.getRecordPath(row)

      let args = this.preferenceStore.scrcpyParameter(row.id, {
        isRecord: true,
        isCamera: ['camera'].includes(this.recordType),
        excludes: [
          ...new Set([
            '--otg',
            '--mouse=aoa',
            '--keyboard=aoa',
            ...this.activeModel.excludes,
          ]),
        ],
      })

      const commands = this.activeModel.commands || []

      if (commands.length) {
        args += ` ${commands.join(' ')}`
      }

      try {
        const recording = this.$scrcpy.record(row.id, {
          title: this.deviceStore.getLabel(row, ({ appName, deviceName }) => `${appName}${this.activeModel.label}-${deviceName}`),
          savePath,
          args,
          exec: true,
        })

        await sleep(1 * 1000)

        this.loading = false

        if (['default'].includes(this.$props.type)) {
          openFloatControl(toRaw(this.row))
        }

        await recording

        window.electron.ipcRenderer.invoke('copy-file-to-clipboard', savePath)

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
    getRecordPath(row) {
      const deviceConfig = this.preferenceStore.getData(this.row.id)

      const savePath = deviceConfig.savePath

      const extension = this.activeModel.extname(deviceConfig)

      const fileName = this.deviceStore.getLabel(row, ({ currentTime, deviceName }) => `${this.activeModel.label}-${deviceName}-${currentTime}.${extension}`)

      const filePath = this.$path.join(savePath, fileName)

      const value = this.$path.normalize(filePath)

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
