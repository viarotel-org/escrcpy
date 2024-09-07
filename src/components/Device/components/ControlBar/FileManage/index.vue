<template>
  <div class="" @click="handleFile(device)">
    <slot />
    <FileDialog ref="fileDialogRef" />
  </div>
</template>

<script setup>
import FileDialog from './FileDialog/index.vue'

const props = defineProps({
  device: {
    type: Object,
    default: () => null,
  },
})

const fileDialogRef = ref()

function handleFile(device) {
  fileDialogRef.value.open(device)
}
</script>

<style></style>
