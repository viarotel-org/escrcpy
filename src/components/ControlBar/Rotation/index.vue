<template>
  <el-dropdown :disabled="loading || floating || ['unauthorized', 'offline'].includes(device.status)" @command="handleCommand">
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
import { sleep } from '$/utils'

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
        vertically:
          'content insert --uri content://settings/system --bind name:s:user_rotation --bind value:i:0',
        horizontally:
          'content insert --uri content://settings/system --bind name:s:user_rotation --bind value:i:1',
        auto: 'content insert --uri content://settings/system --bind name:s:accelerometer_rotation --bind value:i:1',
        disable:
          'content insert --uri content://settings/system --bind name:s:accelerometer_rotation --bind value:i:0',
      },
    }
  },
  computed: {
    options() {
      const value = [
        {
          label: this.$t('device.control.rotation.vertically'),
          value: 'vertically',
        },
        {
          label: this.$t('device.control.rotation.horizontally'),
          value: 'horizontally',
        },
        {
          label: this.$t('device.control.rotation.auto'),
          value: 'auto',
        },
        {
          label: this.$t('device.control.rotation.disable'),
          value: 'disable',
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

      const channel = 'rotationScreen'

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

      if (value === 'vertically' || value === 'horizontally') {
        await this.$adb.deviceShell(this.device.id, this.commandMap.disable)
        await sleep(500)
      }

      this.$adb.deviceShell(this.device.id, command)

      this.loading = false
    },
  },
}
</script>

<style></style>
