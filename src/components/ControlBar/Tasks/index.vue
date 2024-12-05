<template>
  <div class="" @click="handleClick(device)">
    <slot v-bind="{ loading }" />

    <TaskDialog ref="taskDialogRef" />
  </div>
</template>

<script setup>
import TaskDialog from '$/components/TaskDialog/index.vue'

const props = defineProps({
  device: {
    type: Object,
    default: null,
  },
})

const loading = ref(false)

const taskDialogRef = ref(null)

function handleClick(device) {
  taskDialogRef.value.open({ devices: [device] })
}
</script>

<style></style>
