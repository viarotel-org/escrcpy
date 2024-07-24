<template>
  <div class="flex items-center space-x-2">
    <ElTag
      v-for="(item, index) of visibleTags"
      :key="index"
      v-bind="$props"
      :class="{
        '!border-none': borderless,
      }"
    >
      {{ showLabel(item) }}
    </ElTag>

    <el-dropdown v-if="collapseTags.length">
      <ElTag v-bind="$props">
        + {{ collapseTags.length }}
      </ElTag>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(item, index) of collapseTags"
            :key="index"
            :class="{
              '!border-none': borderless,
            }"
          >
            {{ showLabel(item) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ElTag } from 'element-plus'
import { computed } from 'vue'

const props = defineProps({
  ...ElTag.props,

  value: {
    type: Array,
    default: () => [],
  },

  visibleNumber: {
    type: Number,
    default: 1,
  },

  label: {
    type: [String, Function, Number],
    default: '',
  },

  borderless: {
    type: Boolean,
    default: false,
  },
})

const visibleTags = computed(() => {
  const value = props.value.slice(0, props.visibleNumber)
  return value
})

const collapseTags = computed(() => {
  const value = props.value.slice(props.visibleNumber)
  return value
})

function showLabel(item) {
  if (!props.label) {
    return item?.label || ''
  }

  let value = ''

  if (['number', 'string'].includes(typeof props.label)) {
    value = item[props.label]
  }
  else if (typeof props.label === 'function') {
    value = props.label(item)
  }

  return value
}
</script>

<style></style>
