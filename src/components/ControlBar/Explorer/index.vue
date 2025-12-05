<template>
  <div class="" @click="handleFile(device)">
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  device: {
    type: Object,
    default: () => null,
  },
})

function handleFile(device) {
  if (!device) {
    return
  }

  // 通过 IPC 打开文件管理器窗口
  window.electron.ipcRenderer.invoke('open-explorer-window', toRaw(device))
}
</script>

<style></style>
