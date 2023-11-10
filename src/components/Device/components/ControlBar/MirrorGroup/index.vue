<template>
  <el-dropdown :disabled="loading" @command="handleCommand">
    <div class="">
      <slot :loading="loading" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item of 4" :key="item" :command="item">
          {{ $t("device.control.mirror-group.open", { num: item }) }}
        </el-dropdown-item>

        <el-dropdown-item command="close">
          <span class="" :title="$t('device.control.mirror-group.close.tips')">
            {{ $t("device.control.mirror-group.close") }}
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    device: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    scrcpyArgs(...args) {
      return this.$store.preference.getScrcpyArgs(...args)
    },
    preferenceData(...args) {
      return this.$store.preference.getData(...args)
    },
    async handleCommand(command) {
      console.log('handleCommand.command', command)

      if (command === 'close') {
        this.$adb.clearOverlayDisplayDevices(this.device.id)
        return false
      }

      this.loading = true

      try {
        const res = await this.$scrcpy.mirrorGroup(this.device.id, {
          open: command,
          title: ({ displayId }) =>
            `${this.$store.device.getLabel(
              this.device,
            )}-displayId-${displayId}`,
          args: this.scrcpyArgs(this.device.id),
        })

        console.log('handleCommand.res', res)

        res.forEach((item) => {
          if (item.status === 'rejected') {
            throw item.reason || item
          }
        })
      }
      catch (error) {
        console.warn('error.message', error.message)
        if (error?.message || error?.cause?.message) {
          this.$message.warning(error?.message || error?.cause?.message)
        }
      }

      this.$adb.clearOverlayDisplayDevices(this.device.id)

      this.loading = false
    },
  },
}
</script>

<style></style>
