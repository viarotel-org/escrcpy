<template>
  <el-select
    v-bind="{
      clearable: true,
      ...(data.props || {}),
    }"
    class="!w-full"
  >
    <el-option
      v-for="(item, index) in data.options"
      :key="index"
      :label="$t(item.label)"
      :value="item.value"
      :title="$t(item.placeholder || item.label)"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>

<style></style>
