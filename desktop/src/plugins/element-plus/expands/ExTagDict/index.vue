<template>
  <el-tag
    :class="{
      '!border-none': borderless,
    }"
  >
    {{ label }}
  </el-tag>
</template>

<script setup>
import { getDictLabel } from '$/dicts/helper'

const props = defineProps({
  value: {
    type: [Number, String],
    default: '',
  },
  dict: {
    type: [String, Array, Function],
  },
  i18n: {
    type: Boolean,
    default: true,
  },
  borderless: {
    type: Boolean,
    default: false,
  },
})

const label = computed(() => {
  const value = getDictLabel(props.dict, props.value)

  if (props.i18n) {
    return window.t(value)
  }

  return value
})
</script>

<style></style>
