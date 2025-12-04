<template>
  <div class="" @click="handleUpload(devices)">
    <slot v-bind="{ loading }" />
  </div>
</template>

<script setup>
const props = defineProps({
  devices: {
    type: Object,
    default: () => null,
  },
})

const { loading, upload: handleUpload } = useAdbUploaderPlus()
</script>

<style></style>
