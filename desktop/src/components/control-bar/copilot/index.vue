<template>
  <slot :trigger="handleOpen" />
</template>

<script setup>
defineOptions({ inheritAttrs: false })

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
  })
}
</script>
