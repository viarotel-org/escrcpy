<template>
  <el-dropdown>
    <div class="" :title="device.$gnirehtetLoadingText" @click="handleStart">
      <slot :loading="device.$gnirehtetLoading" />
    </div>

    <template v-if="device.$gnirehtetLoading" #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleStop">
          {{ $t("device.control.gnirehtet.stop") }}
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
    return {}
  },
  created() {
    if (!Object.hasOwnProperty.call(this.device, '$gnirehtetLoading')) {
      Object.assign(this.device, {
        $gnirehtetLoading: false,
        $gnirehtetLoadingText: '',
      })
    }
  },
  methods: {
    preferenceData(...args) {
      return this.$store.preference.getData(...args)
    },
    async handleStart() {
      this.device.$gnirehtetLoadingText = this.$t(
        'device.control.gnirehtet.running',
      )
      this.device.$gnirehtetLoading = true

      try {
        await this.$gnirehtet.run(this.device.id)
        await sleep()
        this.$message.success(
          this.$t('device.control.gnirehtet.start.success'),
        )
      }
      catch (error) {
        this.$message.warning(error.message || 'Start service failure')
        this.device.$gnirehtetLoading = false
        this.device.$gnirehtetLoadingText = ''
      }
    },
    async handleStop() {
      this.device.$gnirehtetLoadingText = this.$t(
        'device.control.gnirehtet.stopping',
      )

      try {
        await this.$gnirehtet.stop(this.device.id)
        await sleep()
        this.$message.success(this.$t('common.success'))
      }
      catch (error) {
        this.$message.warning(error.message || 'Stop service failure')
      }

      this.device.$gnirehtetLoading = false
      this.device.$gnirehtetLoadingText = ''
    },
  },
}
</script>

<style></style>
