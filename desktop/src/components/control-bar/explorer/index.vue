<template>
  <slot :trigger="() => handleFile()" />
</template>

<script setup>
defineOptions({ inheritAttrs: false })
const props = defineProps({
  device: {
    type: Object,
    default: () => ({}),
  },
})

function handleFile() {
  const device = toRaw(props.device ?? {})

  window.$preload.win.open('pages/explorer', {
    device,
    instanceId: device.id,
  })
}
</script>

<style></style>
