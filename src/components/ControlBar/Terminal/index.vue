<template>
  <el-dropdown :disabled="['unauthorized', 'offline'].includes(device.status)">
    <slot :loading />

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleCommand(device)">
          {{ $t('device.control.terminal.command.name') }}
        </el-dropdown-item>
        <el-dropdown-item @click="handleScript(device)">
          {{ $t('device.control.terminal.script.name') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
const props = defineProps({
  device: {
    type: Object,
    default: () => null,
  },
})

const { loading, invoke: handleScript } = useShellAction()

function handleCommand(device) {
  const taskStore = useTaskStore()

  const command = `adb -s ${device.id} `

  taskStore.emit('terminal', { command })
}
</script>

<style></style>
