<template>
  <el-dropdown :disabled="loading" @command="handleCommand">
    <div class="">
      <slot :loading="loading" />
    </div>
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
      options: [
        {
          label: 'device.control.rotation.vertically',
          value: 'vertically',
        },
        {
          label: 'device.control.rotation.horizontally',
          value: 'horizontally',
        },
        {
          label: 'device.control.rotation.auto',
          value: 'auto',
        },
        {
          label: 'device.control.rotation.disable',
          value: 'disable',
        },
      ],
    }
  },
  methods: {
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
