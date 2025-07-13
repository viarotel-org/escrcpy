<template>
  <el-dropdown :disabled="floating">
    <div
      class=""
      :title="device.$gnirehtetLoadingText"
      @click="handleStart"
      @mouseenter="onMouseenter"
    >
      <slot :loading="device.$gnirehtetLoading" />
    </div>

    <template v-if="device.$gnirehtetLoading" #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleStop">
          {{ $t('device.control.gnirehtet.stop') }}
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
  created() {
    if (!Object.hasOwnProperty.call(this.device, '$gnirehtetLoading')) {
      Object.assign(this.device, {
        $gnirehtetLoading: false,
        $gnirehtetLoadingText: '',
      })
    }
  },
  methods: {
    onMouseenter() {
      if (!this.floating) {
        return false
      }

      if (!this.device.$gnirehtetLoading) {
        return false
      }

      const channel = 'stop-device-gnirehtet'

      window.electron.ipcRenderer.once(
        channel,
        (event, data) => {
          this.handleStop()
        },
      )

      const options = [
        {
          label: window.t('device.control.gnirehtet.stop'),
        },
      ]

      window.electron.ipcRenderer.send('open-system-menu', {
        channel,
        options,
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
        adaptiveMessage(this.$t('common.success'), {
          system: this.floating,
          type: 'success',
        })
      }
      catch (error) {
        adaptiveMessage(error.message || 'Stop service failure', {
          system: this.floating,
          type: 'warning',
        })
      }

      this.device.$gnirehtetLoading = false
      this.device.$gnirehtetLoadingText = ''
    },
  },
}
</script>

<style></style>
