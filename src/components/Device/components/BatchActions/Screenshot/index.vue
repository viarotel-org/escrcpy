<template>
  <div class="" @click="handleClick(devices)">
    <slot v-bind="{ loading }" />
  </div>
</template>

<script setup>
import { useScreenshotAction } from '$/composables/useScreenshotAction/index.js'

import { useTaskStore } from '$/store/index.js'

const props = defineProps({
  devices: {
    type: Array,
    default: () => [],
  },
})

const { loading, invoke: handleClick } = useScreenshotAction()

const taskStore = useTaskStore()

taskStore.on('screenshot', (task) => {
  taskStore.start({
    task,
    handler: handleClick,
  })
})
</script>

<style></style>
