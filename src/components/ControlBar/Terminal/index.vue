<template>
  <el-dropdown :disabled="['unauthorized', 'offline'].includes(device.status)">
    <slot :loading />

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleCommand(device)">
          {{ $t('terminal.command.name') }}
        </el-dropdown-item>
        <el-dropdown-item @click="handleScript(device)">
          {{ $t('terminal.script.name') }}
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

async function handleCommand(device) {
  const enableSystemTerminal = window.appStore.get('common.enableSystemTerminal')

  if (enableSystemTerminal) {
    try {
      await window.terminal.openWithAdbCommand(`-s ${device.id}`)
    }
    catch (error) {
      console.error('Failed to open system terminal:', error)
      ElMessage.error(error.message || 'Failed to open system terminal')
    }
  }
  else {
    const taskStore = useTaskStore()
    const command = `adb -s ${device.id} `
    taskStore.emit('terminal', { command })
  }
}
</script>

<style></style>
