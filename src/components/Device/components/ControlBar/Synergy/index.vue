<template>
  <el-dropdown :disabled="loading" @command="handleCommand">
    <slot :loading />

    <template #dropdown>
      <el-dropdown-menu>
        <template v-if="!loading">
          <el-dropdown-item
            v-for="item of options"
            :key="item"
            :command="item.value"
            :title="item.title"
          >
            {{ item.label }}
          </el-dropdown-item>
        </template>
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
  computed: {
    options() {
      const value = []

      if (this.loading) {
        value.push({
          label: window.t('device.control.mirror-group.close'),
          value: 'close',
          title: window.t('device.control.mirror-group.close.tips'),
        })
      }
      else {
        value.push(
          ...[1, 2, 3, 4].map(item => ({
            label: this.$t('device.control.mirror-group.open', { num: item }),
            value: item,
          })),
        )
      }

      return value
    },
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
          openNum: command,
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
