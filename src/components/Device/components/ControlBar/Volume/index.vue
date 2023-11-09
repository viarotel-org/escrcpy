<template>
  <el-dropdown :hide-on-click="false" @command="handleCommand">
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
        'volume-down': 'input keyevent KEYCODE_VOLUME_DOWN',
        'volume-up': 'input keyevent KEYCODE_VOLUME_UP',
        'volume-mute': 'input keyevent KEYCODE_VOLUME_MUTE',
      },
      options: [
        {
          label: 'device.control.volume-up.name',
          value: 'volume-up',
        },
        {
          label: 'device.control.volume-down.name',
          value: 'volume-down',
        },
        {
          label: 'device.control.volume-mute.name',
          value: 'volume-mute',
        },
      ],
    }
  },
  methods: {
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
