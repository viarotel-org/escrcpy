<template>
  <slot :loading="otgAction.loading" :trigger="handleClick" />
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

const otgAction = useOtgAction()

function handleClick() {
  props.toggleRowExpansion(props.row, true)

  otgAction.invoke(props.row)
}
</script>

<style></style>
