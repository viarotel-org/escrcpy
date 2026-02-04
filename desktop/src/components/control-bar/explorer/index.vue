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

  window.$preload.win.open('entries/explorer', {
    query: {
      ...toRaw(device),
    },
    instanceId: device.id,
  })
}
</script>

<style></style>
