<template>
  <slot v-bind="{ loading }" :trigger="() => handleClick(device)" />

  <TaskDialog v-if="taskLazy.visible" ref="taskDialogRef" />
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
const taskLazy = useLazy()

async function handleClick(device) {
  await taskLazy.mount()

  taskDialogRef.value.open({
    devices: [device],
    onClosed() {
      taskLazy.unmount()
    },
  })
}
</script>

<style></style>
