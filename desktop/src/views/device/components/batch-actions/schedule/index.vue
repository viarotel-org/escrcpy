<template>
  <slot v-bind="{ loading, trigger: onTrigger }" />

  <ScheduleDialog v-if="scheduleLazy.visible" ref="scheduleDialogRef"></ScheduleDialog>
</template>

<script setup>
import ScheduleDialog from '$/components/schedule-dialog/index.vue'
import { deviceSelectionHelper } from '$/utils/device/selection/index.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  devices: {
    type: Array,
    default: () => [],
  },
})

const loading = ref(false)

const scheduleDialogRef = ref(null)
const scheduleLazy = useLazy()

async function onTrigger(devices) {
  const selectedDevices = deviceSelectionHelper.filter(devices, 'onlineAndUnique')

  await scheduleLazy.mount()

  scheduleDialogRef.value.open({
    devices: selectedDevices,
    onClosed() {
      scheduleLazy.unmount()
    },
  })
}
</script>

<style></style>
