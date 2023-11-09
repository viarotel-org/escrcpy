<template>
  <el-dropdown :disabled="loading">
    <div class="">
      <slot :loading="loading" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleStart(device)">
          {{ $t("device.control.gnirehtet.start") }}
        </el-dropdown-item>
        <el-dropdown-item @click="handleStop(device)">
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
      loading: false,
    }
  },
  methods: {
    preferenceData(...args) {
      return this.$store.preference.getData(...args)
    },
    async handleStart(device) {
      this.loading = true

      try {
        await this.$gnirehtet.run(device.id)
        await sleep()
        this.$message.success(
          this.$t('device.control.gnirehtet.start.success'),
        )
      }
      catch (error) {
        this.$message.warning(error.message || 'Start service failure')
      }

      this.loading = false
    },
    async handleStop() {
      this.loading = true
      try {
        await this.$gnirehtet.stop(this.device.id)
        await sleep()
        this.$message.success(this.$t('common.success'))
      }
      catch (error) {
        this.$message.warning(error.message || 'Stop service failure')
      }
      this.loading = false
    },
  },
}
</script>

<style></style>
