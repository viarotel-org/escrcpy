<template>
  <div class="" @click="handleGnirehtet(device)">
    <slot />
  </div>
</template>

<script>
import LoadingIcon from '@/components/Device/components/LoadingIcon/index.vue'

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
  methods: {
    preferenceData(...args) {
      return this.$store.preference.getData(...args)
    },
    async handleGnirehtet(device) {
      const messageEl = this.$message({
        message: this.$t('device.control.gnirehtet.progress', {
          deviceName: device.$name,
        }),
        icon: LoadingIcon,
        duration: 0,
      })

      try {
        await this.$gnirehtet.run(device.id)
        this.$message.success(this.$t('device.control.gnirehtet.success'))
      }
      catch (error) {
        if (error.message) {
          this.$message.warning(error.message)
        }
      }

      messageEl.close()
    },
  },
}
</script>

<style></style>
