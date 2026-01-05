<template>
  <slot :trigger="handleClick" />

  <TaskListDialog ref="taskListDialogRef" />
</template>

<script setup>
import TaskListDialog from '$/components/task-list-dialog/index.vue'

defineOptions({
  inheritAttrs: false,
})

const taskListDialogRef = ref(null)

function handleClick() {
  taskListDialogRef.value.open()
}
</script>

<style lang="postcss"></style>
