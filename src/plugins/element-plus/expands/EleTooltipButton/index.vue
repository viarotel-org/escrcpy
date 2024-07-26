<template>
  <el-tooltip>
    <ElButton
      v-bind="{ ...$props }"
      :class="[{ '!border-none': borderless }, buttonClass]"
      @click="emit('click', $event)"
    >
      <slot name="icon"></slot>
      <slot></slot>
    </ElButton>
    <slot name="content"></slot>
  </el-tooltip>
</template>

<script setup>
import { ElButton } from 'element-plus'

const props = defineProps({
  ...ElButton.props,

  borderless: {
    type: Boolean,
    default: false,
  },
  buttonClass: {
    type: [String, Array, Object],
    default: '',
  },
})

const emit = defineEmits(['click'])
</script>

<style></style>
