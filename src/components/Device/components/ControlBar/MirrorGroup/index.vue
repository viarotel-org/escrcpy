<template>
  <el-dropdown @command="handleCommand">
    <div class="">
      <slot :loading="loading" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <template v-if="!loading">
          <el-dropdown-item v-for="item of 4" :key="item" :command="item">
            {{ $t("device.control.mirror-group.open", { num: item }) }}
          </el-dropdown-item>
        </template>
        <el-dropdown-item v-else command="close">
          <span class="" :title="$t('device.control.mirror-group.close.tips')">
            {{ $t("device.control.mirror-group.close") }}
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { sleep } from '$/utils'

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
      await sleep(300)

      if (command === 'close') {
        this.handleStop()
        this.loading = false
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

      this.handleStop()
      this.loading = false
    },
    handleStop() {
      this.$adb.clearOverlayDisplayDevices(this.device.id)
    },
  },
}
</script>

<style></style>
