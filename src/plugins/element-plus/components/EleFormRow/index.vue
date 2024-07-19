<template>
  <el-form v-bind="{ ...$props }">
    <el-row v-bind="{ ...$attrs, size: $props.size }">
      <slot />
    </el-row>
  </el-form>
</template>

<script>
import { ElForm } from 'element-plus'

export default {
  name: 'ElFormRow',
  inheritAttrs: false,
  props: {
    ...ElForm.props,
  },
}
</script>

<style></style>
