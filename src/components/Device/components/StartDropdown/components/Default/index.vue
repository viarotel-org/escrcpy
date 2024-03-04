<template>
  <el-dropdown-item class="" :disabled="loading" @click="handleClick">
    <template v-if="loading">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
      运行中
    </template>
    <template v-else>
      默认模式
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

      const args = this.$store.preference.getScrcpyArgs(row.id, {
        excludes: ['--otg', '--mouse=aoa', '--keyboard=aoa'],
      })

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
