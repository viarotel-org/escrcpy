<template>
  <el-dropdown :disabled="floating" @command="handleCommand">
    <div
      :title="device.$gnirehtetLoadingText"
      @click="onTrigger"
    >
      <slot :loading="device.$gnirehtetLoading" />
    </div>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item of options"
          :key="item.value"
          :disabled="item.disabled"
          :command="item.value"
        >
          {{ $t(item.label) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { sleep } from '$/utils'
import { adaptiveMessage } from '$/utils/modal/index.js'

export default {
  props: {
    device: {
      type: Object,
      default: () => ({}),
    },
    floating: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const preferenceStore = usePreferenceStore()
    return {
      preferenceStore,
    }
  },
  data() {
    return {}
  },
  computed: {
    options() {
      const value = [
        {
          label: this.$t('device.control.gnirehtet.start'),
          value: 'handleStart',
          disabled: this.device.$gnirehtetLoading,
        },
        {
          label: this.$t('device.control.gnirehtet.stop'),
          value: 'handleStop',
        },
      ]
      return value
    },
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
    handleCommand(method) {
      this[method]?.()
    },
    onTrigger() {
      if (!this.floating) {
        return false
      }

      const channel = 'stop-device-gnirehtet'

      window.$preload.ipcRenderer.once(
        channel,
        (event, method) => {
          this.handleCommand(method)
        },
      )

      window.$preload.ipcRenderer.invoke('open-system-menu', {
        channel,
        options: this.options,
      })
    },
    preferenceData(...args) {
      return this.preferenceStore.getData(...args)
    },
    async handleStart() {
      if (this.device.$gnirehtetLoading) {
        return false
      }

      this.device.$gnirehtetLoadingText = this.$t(
        'device.control.gnirehtet.running',
      )
      this.device.$gnirehtetLoading = true

      try {
        await this.$gnirehtet.run(this.device.id)
        await sleep()
        adaptiveMessage(this.$t('device.control.gnirehtet.start.success'), {
          system: this.floating,
          type: 'success',
        })
      }
      catch (error) {
        adaptiveMessage(error.message || 'Start service failure', {
          system: this.floating,
          type: 'warning',
        })
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
        adaptiveMessage(this.$t('common.success'), {
          system: this.floating,
          type: 'success',
        })
      }
      catch (error) {
        console.warn(error.message || 'Stop service failure')
      }

      this.device.$gnirehtetLoading = false
      this.device.$gnirehtetLoadingText = ''
    },
  },
}
</script>

<style></style>
