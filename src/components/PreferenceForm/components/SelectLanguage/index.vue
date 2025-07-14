<template>
  <el-select
    v-bind="{ ...(data.props || {}) }"
    v-model="inputValue"
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
import { i18n } from '$/locales/index.js'

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
  setup() {
    return {
      locale: i18n.global.locale,
    }
  },
  data() {
    return {}
  },
  computed: {
    inputValue: {
      get() {
        return this.modelValue || this.locale
      },
      set(value) {
        this.locale = value
        this.$emit('update:model-value', value)
      },
    },
  },
  watch: {
    inputValue(value) {
      this.locale = value
    },
  },
  methods: {},
}
</script>

<style></style>
