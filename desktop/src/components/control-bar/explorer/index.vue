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

  window.$preload.win.open('pages/explorer', {
    query: {
      ...toRaw(device),
    },
    instanceId: device.id,
  })
}
</script>

<style></style>
