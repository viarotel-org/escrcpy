<template>
  <el-select
    v-bind="{
      clearable: true,
      filterable: true,
      allowCreate: true,
      ...(data.props || {}),
    }"
    class="!w-full"
  >
    <template v-if="data.options[0]?.options">
      <el-option-group
        v-for="(group, groupIndex) in data.options"
        :key="groupIndex"
        :label="$t(group.label)"
      >
        <el-option
          v-for="(item, index) in group.options"
          :key="index"
          :label="$t(item.label)"
          :value="item.value"
        />
      </el-option-group>
    </template>

    <template v-else>
      <el-option
        v-for="(item, index) in data.options"
        :key="index"
        :label="$t(item.label)"
        :value="item.value"
        :title="$t(item.message || item.placeholder || item.label)"
      />
    </template>
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
