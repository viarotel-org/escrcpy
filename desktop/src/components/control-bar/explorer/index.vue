<template>
  <slot :trigger="() => handleFile(device)" />
</template>

<script setup>
defineOptions({ inheritAttrs: false })
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
