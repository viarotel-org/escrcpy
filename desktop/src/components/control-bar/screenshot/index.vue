<template>
  <slot v-bind="{ loading }" :trigger="() => handleClick(device)" />
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

const { loading, invoke: handleClick } = useScreenshotAction({
  floating: props.floating,
})
</script>

<style></style>
