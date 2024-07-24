<template>
  <el-tooltip>
    <ElButton v-bind="{ ...$props }" @click="emit('click', $event)">
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
})

const emit = defineEmits(['click'])
</script>

<style></style>
