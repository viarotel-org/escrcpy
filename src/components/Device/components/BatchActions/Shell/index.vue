<template>
  <div class="" @click="handleClick(devices)">
    <slot v-bind="{ loading }" />
  </div>
</template>

<script setup>
import { useShellAction } from '$/composables/useShellAction/index.js'
import { useTaskStore } from '$/store/index.js'

const props = defineProps({
  devices: {
    type: Object,
    default: () => null,
  },
})

const { loading, invoke: handleClick } = useShellAction()

const taskStore = useTaskStore()

taskStore.on('shell', (task) => {
  taskStore.start({
    task,
    handler: handleClick,
  })
})
</script>

<style></style>
