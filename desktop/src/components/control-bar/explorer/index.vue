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

  // Open file explorer window via IPC
  window.electron.ipcRenderer.invoke('open-explorer-window', toRaw(device))
}
</script>

<style></style>
