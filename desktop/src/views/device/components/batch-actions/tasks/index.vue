<template>
  <slot v-bind="{ loading, trigger: onTrigger }" />

  <TaskDialog v-if="taskLazy.visible" ref="taskDialogRef"></TaskDialog>
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
const taskLazy = useLazy()

async function onTrigger(devices) {
  const selectedDevices = deviceSelectionHelper.filter(devices, 'onlineAndUnique')

  await taskLazy.mount()

  taskDialogRef.value.open({
    devices: selectedDevices,
    onClosed() {
      taskLazy.unmount()
    },
  })
}
</script>

<style></style>
