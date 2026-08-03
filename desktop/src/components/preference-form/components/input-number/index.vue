<template>
  <el-input
    class="!w-full"
    v-bind="{
      type: 'number',
      clearable: true,
      ...(data.props || {}),
    }"
    @update:model-value="(val) => $emit('update:model-value', val ? Number(val) : undefined)"
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
  emits: ['update:model-value'],
}
</script>

<style></style>
