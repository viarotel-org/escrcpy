<template>
  <el-input
    v-bind="{
      clearable: true,
      ...(data.props || {}),
    }"
    v-model="pathValue"
    class="!w-full"
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
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:model-value'],
  data() {
    return {}
  },
  computed: {
    pathValue: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:model-value', value)
      },
    },
  },
  methods: {
    async handleSelect(options = {}) {
      const { properties, filters } = cloneDeep(options)
      try {
        const defaultPath = this.modelValue
        const files = await this.$electron.ipcRenderer.invoke(
          'show-open-dialog',
          {
            properties: properties || [],
            filters: (filters || []).map(item => ({
              ...item,
              name: window.t(item.name),
            })),
            ...(defaultPath
              ? {
                  defaultPath,
                }
              : {}),
          },
        )

        const value = files.join(',')

        this.pathValue = value
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
