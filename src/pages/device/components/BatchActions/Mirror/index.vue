<template>
  <div class="" @click="handleClick(devices)">
    <slot v-bind="{ loading }" />
  </div>
</template>

<script setup>
import { useTaskStore } from '$/store/index.js'
import { useMirrorAction } from '$/hooks/index.js'

const props = defineProps({
  devices: {
    type: Array,
    default: () => [],
  },
})

const { loading, invoke: handleClick } = useMirrorAction()

const taskStore = useTaskStore()

taskStore.on('mirror', (task) => {
  taskStore.start({
    task,
    handler: handleClick,
  })
})
</script>

<style></style>
