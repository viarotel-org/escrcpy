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
  window.$preload.win.open('pages/terminal', {
    query: {
      ...toRaw(device),
    },
    instanceId: device.id,
  })
}
</script>

<style></style>
