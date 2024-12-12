<template>
  <el-dropdown
    :hide-on-click="false"
    :disabled="loading || floating || ['unauthorized', 'offline'].includes(device.status)"
    @command="handleCommand"
  >
    <slot :loading :trigger="handleTrigger" />

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item of options"
          :key="item.value"
          :command="item.value"
        >
          {{ $t(item.label) }}
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
    floating: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      commandMap: {
        'volume-down': 'input keyevent KEYCODE_VOLUME_DOWN',
        'volume-up': 'input keyevent KEYCODE_VOLUME_UP',
        'volume-mute': 'input keyevent KEYCODE_VOLUME_MUTE',
      },
    }
  },
  computed: {
    options() {
      const value = [
        {
          label: this.$t('device.control.volume-up.name'),
          value: 'volume-up',
        },
        {
          label: this.$t('device.control.volume-down.name'),
          value: 'volume-down',
        },
        {
          label: this.$t('device.control.volume-mute.name'),
          value: 'volume-mute',
        },
      ]
      return value
    },
  },
  methods: {
    handleTrigger() {
      if (!this.floating) {
        return false
      }

      const channel = 'changeVolume'

      window.electron.ipcRenderer.once(
        channel,
        (event, data) => {
          this.handleCommand(data)
        },
      )

      const options = toRaw(this.options)

      window.electron.ipcRenderer.send('open-system-menu', {
        channel,
        options,
      })
    },
    async handleCommand(value) {
      this.loading = true

      const command = this.commandMap[value]

      this.$adb.deviceShell(this.device.id, command)

      this.loading = false
    },
  },
}
</script>

<style></style>
