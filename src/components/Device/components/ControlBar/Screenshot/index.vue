<template>
  <div class="" @click="handleClick(device)">
    <slot v-bind="{ loading }" />
  </div>
</template>

<script setup>
import { useScreenshotAction } from '$/composables/useScreenshotAction/index.js'

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

const { loading, invoke: handleClick } = useScreenshotAction({
  floating: props.floating,
})
</script>

<style></style>
