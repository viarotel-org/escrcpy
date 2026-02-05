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
  const device = toRaw(props.device ?? {})

  window.$preload.win.open('pages/copilot', {
    device,
    instanceId: device.id,
  })
}
</script>
