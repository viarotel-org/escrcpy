<template>
  <el-select
    v-bind="{ clearable: true, ...(data.props || {}) }"
    v-model="selectValue"
    class="!w-full"
  >
    <el-option
      v-for="(item, index) in options"
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
    modelValue: {
      type: String,
      value: '',
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    preferenceData: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:model-value'],
  data() {
    return {}
  },
  computed: {
    options() {
      return this.data.options || []
    },
    selectValue: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:model-value', value)

        this.options.forEach((item) => {
          if (item.value) {
            this.preferenceData[item.value] = item.value === value
          }
        })
      },
    },
  },
  methods: {},
}
</script>

<style></style>
