<template>
  <slot :trigger="onTriggerClick" />
</template>

<script setup>
defineOptions({ inheritAttrs: false })

const props = defineProps({
  device: {
    type: Object,
    default: () => ({}),
  },
  floating: {
    type: Boolean,
    default: false,
  },
})

function onTriggerClick() {
  const device = props.device

  window.electron.window.open('copilot', {
    query: {
      id: device.id,
      name: device.name,
      remark: device.remark,
    },
    instanceId: device.id,
  })
}
</script>
