<template>
  <el-form ref="formRef" v-bind="{ ...$props }">
    <el-row v-bind="{ ...$attrs, size: $props.size }">
      <slot />
    </el-row>
  </el-form>
</template>

<script>
import { ElForm } from 'element-plus'
import { inheritComponentMethods } from '$/utils/index.js'

export default {
  name: 'ElFormRow',
  inheritAttrs: false,
  props: {
    ...ElForm.props,
  },
  methods: {
    ...inheritComponentMethods('formRef', [
      'validate',
      'validateField',
      'resetFields',
      'scrollToField',
      'clearValidate',
      'fields',
    ]),
  },
}
</script>

<style></style>
