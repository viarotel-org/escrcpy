<template>
  <div class="" @click="handleClick(devices)">
    <slot v-bind="{ loading }" />
  </div>
</template>

<script setup>
const props = defineProps({
  devices: {
    type: Array,
    default: () => [],
  },
})

const loading = ref(false)
</script>

<style></style>
