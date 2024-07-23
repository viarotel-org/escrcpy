<template>
  <div class="" @click="handleClick(devices)">
    <slot v-bind="{ loading }" />
  </div>
</template>

<script setup>
import { useInstallAction } from '$/composables/useInstallAction/index.js'

import { useTaskStore } from '$/store/index.js'

const props = defineProps({
  devices: {
    type: Array,
    default: () => [],
  },
})

const { loading, invoke: handleClick } = useInstallAction()

const taskStore = useTaskStore()

taskStore.on('install', (task) => {
  taskStore.start({
    task,
    handler: handleClick,
  })
})
</script>

<style></style>
