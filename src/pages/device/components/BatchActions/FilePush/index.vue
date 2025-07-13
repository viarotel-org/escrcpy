<template>
  <div class="" @click="handlePush(devices)">
    <slot v-bind="{ loading }" />
  </div>
</template>

<script setup>
import { useFileActions } from '$/hooks/useFileActions/index.js'

const props = defineProps({
  devices: {
    type: Object,
    default: () => null,
  },
})

const { loading, send: handlePush } = useFileActions()
</script>

<style></style>
