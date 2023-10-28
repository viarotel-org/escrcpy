<template>
  <el-select
    v-bind="data.props || {}"
    v-model="locale"
    class="!w-full"
    :title="$t(data.placeholder)"
    :placeholder="$t(data.placeholder)"
    @change="onChange"
  >
    <el-option
      v-for="(item, index) in data.options"
      :key="index"
      :label="$t(item.label)"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
import { i18n } from '@/locales/index.js'

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
  },
  emits: ['update:model-value'],
  data() {
    const { locale, availableLocales } = i18n.global
    return {
      locale,
      options: availableLocales.map(item => ({
        label: item,
        value: item,
      })),
    }
  },
  methods: {
    onChange(value) {
      this.$emit('update:model-value', value)
    },
  },
}
</script>

<style></style>
