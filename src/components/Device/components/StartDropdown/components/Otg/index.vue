<template>
  <el-dropdown-item class="" :disabled="loading" @click="handleClick">
    <template v-if="loading">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
      控制中
    </template>
    <template v-else>
      OTG模式
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

      const args = `--otg ${this.$store.preference.getScrcpyArgs(row.id, {
        excludes: ['--mouse=uhid', '--keyboard=uhid'],
        isOtg: true,
      })}`

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
