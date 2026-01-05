<template>
  <slot v-bind="{ loading }" :trigger="() => handleClick(device)" />

  <TaskDialog ref="taskDialogRef" />
</template>

<script setup>
import TaskDialog from '$/components/task-dialog/index.vue'

defineOptions({ inheritAttrs: false })

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
