<template>
  <el-dropdown :disabled="loading" @command="handleMirror">
    <div class="">
      <slot :loading="loading" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item of 4" :key="item" :command="item">
          {{ $t("device.control.mirror-group.open", { num: item }) }}
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
    async handleMirror(open) {
      console.log('handleMirror.open', open)

      this.loading = true

      try {
        const res = await this.$scrcpy.mirrorGroup(this.device.id, {
          open,
          title: ({ displayId }) =>
            `${this.device.$remark ? `${this.device.$remark}-` : ''}${
              this.device.$name
            }-${this.device.id}-display-${displayId}`,
          args: this.scrcpyArgs(this.device.id),
        })

        console.log('handleMirror.res', res)

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
