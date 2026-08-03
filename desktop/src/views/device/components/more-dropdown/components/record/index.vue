<template>
  <slot :loading="recordAction.loading" :trigger="handleClick" />
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  recordType: {
    type: String,
    default: 'default',
  },
  row: {
    type: Object,
    default: () => ({}),
  },
  toggleRowExpansion: {
    type: Function,
    default: () => () => false,
  },
})

const recordAction = useRecordAction()

function handleClick() {
  props.toggleRowExpansion(props.row, true)

  recordAction.invoke(props.row, {
    recordType: props.recordType,
  })
}
</script>

<style></style>
