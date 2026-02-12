<template>
  <slot :trigger="handleClick" />

  <TaskListDialog v-if="taskLazy.visible" ref="taskListDialogRef" />
</template>

<script setup>
import TaskListDialog from '$/components/task-list-dialog/index.vue'

defineOptions({
  inheritAttrs: false,
})

const taskListDialogRef = ref(null)
const taskLazy = useLazy()

async function handleClick() {
  await taskLazy.mount()

  taskListDialogRef.value.open({
    onClosed() {
      taskLazy.unmount()
    },
  })
}
</script>

<style lang="postcss"></style>
