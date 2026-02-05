<template>
  <slot v-bind="{ loading, trigger: onTrigger }" />

  <TaskDialog ref="taskDialogRef"></TaskDialog>
</template>

<script setup>
import TaskDialog from '$/components/task-dialog/index.vue'
import { deviceSelectionHelper } from '$/utils/device/selection/index.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  devices: {
    type: Array,
    default: () => [],
  },
})

const loading = ref(false)

const taskDialogRef = ref(null)

function onTrigger(devices) {
  const selectedDevices = deviceSelectionHelper.filter(devices, 'onlineAndUnique')
  taskDialogRef.value.open({ devices: selectedDevices })
}
</script>

<style></style>
