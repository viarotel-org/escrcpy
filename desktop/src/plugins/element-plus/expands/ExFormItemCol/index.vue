<template>
  <el-col v-bind="{ ...$props }">
    <el-form-item v-bind="{ ...$attrs }">
      <slot />
    </el-form-item>
  </el-col>
</template>

<script>
import { ElCol } from 'element-plus'

export default {
  name: 'ElFormItemCol',
  inheritAttrs: false,
  props: {
    ...ElCol.props,
  },
}
</script>

<style></style>
