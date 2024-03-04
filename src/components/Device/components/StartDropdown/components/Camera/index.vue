<template>
  <el-dropdown-item class="" :disabled="loading" @click="handleClick">
    <template v-if="loading">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
      摄像中
    </template>
    <template v-else>
      摄像模式
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

      const args = `--video-source=camera ${this.$store.preference.getScrcpyArgs(
        row.id,
        {
          excludes: ['--video-source', '--mouse', '--keyboard'],
          isCamera: true,
        },
      )}`

      try {
        await this.$scrcpy.mirror(row.id, {
          title: this.$store.device.getLabel(row),
          args,
          stdout: this.onStdout,
          stderr: this.onStderr,
        })
      }
      catch (error) {
        console.warn(error)

        if (error.message) {
          this.$message.warning(error.message)
        }

        this.handleReset()
      }

      this.loading = false
    },
    onStdout() {},
    onStderr() {
      this.loading = false
    },
  },
}
</script>

<style></style>
