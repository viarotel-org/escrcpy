<template>
  <slot :trigger="handleOpen" />
</template>

<script setup>
const props = defineProps({
  device: {
    type: Object,
    default: () => ({}),
  },
  floating: {
    type: Boolean,
    default: false,
  },
})

const handleOpen = () => {
  window.electron.ipcRenderer.invoke('open-copilot-window', {
    device: toRaw(props.device),
    mode: 'single',
  })
}
</script>
