<template>
  <div class="" @click="handleClick(devices)">
    <slot v-bind="{ loading }" />

    <TaskDialog ref="taskDialogRef"></TaskDialog>
  </div>
</template>

<script setup>
import TaskDialog from '$/components/TaskDialog/index.vue'

const props = defineProps({
  devices: {
    type: Array,
    default: () => [],
  },
})

const loading = ref(false)

const taskDialogRef = ref(null)

function handleClick(devices) {
  taskDialogRef.value.open({ devices })
}
</script>

<style></style>
