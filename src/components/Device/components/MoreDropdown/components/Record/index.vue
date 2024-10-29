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
  },
  audio: {
    excludes: ['--video-source', '--no-audio', '--mouse'],
    commands: ['--no-video', '--mouse=disabled'],
    extname: config => config['--audio-record-format'] || 'opus',
  },
  camera: {
    excludes: ['--video-source'],
    commands: ['--video-source=camera'],
    extname: config => config['--record-format'] || 'mp4',
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

      let args = this.$store.preference.scrcpyParameter(row.id, {
        isRecord: ['default', 'audio'].includes(this.recordType),
        isCamera: ['camera'].includes(this.recordType),
        excludes: [
          ...new Set([
            '--otg',
            '--mouse=aoa',
            '--keyboard=aoa',
            '--show-touches',
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
          title: this.$store.device.getLabel(row, 'recording'),
          savePath,
          args,
        })

        await sleep(1 * 1000)

        this.loading = false

        if (['default'].includes(this.$props.type)) {
          openFloatControl(toRaw(this.row))
        }

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
    getRecordPath(row) {
      const deviceConfig = this.$store.preference.getData(this.row.id)

      const savePath = deviceConfig.savePath

      const extension = this.activeModel.extname(deviceConfig)

      const fileName = this.$store.device.getLabel(
        row,
        ({ time }) => `record-${time}.${extension}`,
      )

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
