<template>
  <el-dropdown-item class="" :disabled="loading" @click="handleClick">
    <template v-if="loading">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
      录制中
    </template>
    <template v-else>
      录制模式
    </template>
  </el-dropdown-item>
</template>

<script>
export default {
  props: {
    deviceInfo: {
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
      const row = this.deviceInfo

      this.loading = true

      this.toggleRowExpansion(row, true)

      const savePath = this.getRecordPath(row)

      const args = this.$store.preference.getScrcpyArgs(row.id, {
        isRecord: true,
        excludes: ['--otg', '--mouse=aoa', '--keyboard=aoa'],
      })

      try {
        await this.$scrcpy.record(row.id, {
          title: this.$store.device.getLabel(row, 'recording'),
          savePath,
          args,
          stdout: this.onStdout,
          stderr: this.onStderr,
        })
        this.onRecordSuccess(savePath)
      }
      catch (error) {
        console.warn(error)

        if (error.message) {
          this.$message.warning(error.message)
        }
      }

      this.loading = false
    },
    onStdout() {},
    onStderr() {
      this.loading = false
    },
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
    async onRecordSuccess(savePath) {
      try {
        await this.$confirm(
          this.$t('device.record.success.message'),
          this.$t('device.record.success.title'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            closeOnClickModal: false,
            type: 'success',
          },
        )

        await this.$electron.ipcRenderer.invoke('show-item-in-folder', savePath)
      }
      catch (error) {
        console.warn(error)
      }
    },
  },
}
</script>

<style></style>
