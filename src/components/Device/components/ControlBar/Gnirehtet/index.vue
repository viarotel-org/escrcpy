<template>
  <el-dropdown>
    <div class="" :title="loadingText" @click="handleStart">
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
import { sleep } from '@/utils'

export default {
  props: {
    device: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loadingText: '',
    }
  },
  methods: {
    preferenceData(...args) {
      return this.$store.preference.getData(...args)
    },
    async handleStart() {
      this.loadingText = this.$t('device.control.gnirehtet.running')
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
        this.loadingText = ''
      }
    },
    async handleStop() {
      this.loadingText = this.$t('device.control.gnirehtet.stopping')

      try {
        await this.$gnirehtet.stop(this.device.id)
        await sleep()
        this.$message.success(this.$t('common.success'))
      }
      catch (error) {
        this.$message.warning(error.message || 'Stop service failure')
      }

      this.device.$gnirehtetLoading = false
      this.loadingText = ''
    },
  },
}
</script>

<style></style>
