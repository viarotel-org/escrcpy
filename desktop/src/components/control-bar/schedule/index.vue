<template>
  <slot v-bind="{ loading }" :trigger="() => handleClick(device)" />

  <ScheduleDialog v-if="scheduleLazy.visible" ref="scheduleDialogRef" />
</template>

<script setup>
import ScheduleDialog from '$/components/schedule-dialog/index.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  device: {
    type: Object,
    default: null,
  },
})

const loading = ref(false)

const scheduleDialogRef = ref(null)
const scheduleLazy = useLazy()

async function handleClick(device) {
  await scheduleLazy.mount()

  scheduleDialogRef.value.open({
    devices: [device],
    onClosed() {
      scheduleLazy.unmount()
    },
  })
}
</script>

<style></style>
