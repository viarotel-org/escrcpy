<template>
  <el-switch class="!w-full" v-bind="{ ...(data.props || {}) }"></el-switch>
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
