<template>
  <el-input
    class="!w-full"
    v-bind="{
      clearable: true,
      ...(data.props || {}),
    }"
  >
    <template v-if="data.append" #append>
      {{ data.append }}
    </template>
  </el-input>
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
