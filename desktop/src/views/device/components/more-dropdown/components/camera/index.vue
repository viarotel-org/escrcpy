<template>
  <slot :loading="cameraAction.loading" :trigger="handleClick" />
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  row: {
    type: Object,
    default: () => ({}),
  },
  toggleRowExpansion: {
    type: Function,
    default: () => () => false,
  },
})

const cameraAction = useCameraAction()

function handleClick() {
  props.toggleRowExpansion(props.row, true)

  cameraAction.invoke(props.row)
}
</script>

<style></style>
