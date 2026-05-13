<template>
  <slot v-bind="{ loading, trigger: onTrigger }" />
</template>

<script setup>
import { deviceSelectionHelper } from '$/utils/device/selection/index.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  devices: {
    type: Array,
    default: () => [],
  },
})

const { loading, invoke: handleClick } = useScreenshotAction()

const scheduleStore = useScheduleStore()

scheduleStore.on('screenshot', (schedule) => {
  scheduleStore.start({
    schedule,
    handler: handleClick,
  })
})

function onTrigger(devices) {
  const selectedDevices = deviceSelectionHelper.filter(devices, 'onlineAndUnique')
  handleClick(selectedDevices)
}
</script>

<style></style>
