<template>
  <slot :trigger="handleClick" />

  <ScheduleListDialog v-if="scheduleLazy.visible" ref="scheduleListDialogRef" />
</template>

<script setup>
import ScheduleListDialog from '$/components/schedule-dialog/list/index.vue'

defineOptions({
  inheritAttrs: false,
})

const scheduleListDialogRef = ref(null)
const scheduleLazy = useLazy()

async function handleClick() {
  await scheduleLazy.mount()

  scheduleListDialogRef.value.open({
    onClosed() {
      scheduleLazy.unmount()
    },
  })
}
</script>

<style lang="postcss"></style>
