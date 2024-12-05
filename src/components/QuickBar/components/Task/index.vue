<template>
  <div class="" @click="handleClick">
    <slot />

    <TaskListDialog ref="taskListDialogRef" />
  </div>
</template>

<script setup>
import TaskListDialog from '$/components/TaskListDialog/index.vue'

const taskListDialogRef = ref(null)

function handleClick() {
  taskListDialogRef.value.open()
}
</script>

<style lang="postcss"></style>
