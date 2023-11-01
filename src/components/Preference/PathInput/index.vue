<template>
  <el-input
    v-bind="data.props || {}"
    :model-value="modelValue"
    clearable
    class="!w-full"
    :title="$t(data.placeholder)"
    :placeholder="$t(data.placeholder)"
  >
    <template #append>
      <el-button
        icon="Search"
        @click="
          handleSelect({
            properties: data.properties,
            filters: data.filters,
          })
        "
      />
    </template>
  </el-input>
</template>

<script>
import { cloneDeep } from 'lodash-es'

export default {
  props: {
    modelValue: {
      type: [String, Array],
      default: '',
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:model-value'],
  methods: {
    async handleSelect(options = {}) {
      const { properties, filters } = cloneDeep(options)
      try {
        const defaultPath = this.modelValue
        const files = await this.$electron.ipcRenderer.invoke(
          'show-open-dialog',
          {
            properties: properties || [],
            filters: filters || [],
            ...(defaultPath
              ? {
                  defaultPath,
                }
              : {}),
          },
        )

        const value = files[0]

        this.$emit('update:model-value', value)
      }
      catch (error) {
        if (error.message) {
          const message = error.message?.match(/Error: (.*)/)?.[1]
          this.$message.warning(message || error.message)
        }
      }
    },
  },
}
</script>

<style></style>
