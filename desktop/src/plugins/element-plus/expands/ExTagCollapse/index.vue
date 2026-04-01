<template>
  <div class="flex items-center space-x-2">
    <ElTag
      v-for="(item, index) of visibleTags"
      :key="index"
      v-bind="$props"
      :class="{
        tagClass,
        '!border-none': borderless,
      }"
      :title="showLabel(item)"
    >
      {{ showLabel(item) }}
    </ElTag>

    <el-dropdown v-if="collapseTags.length">
      <ElTag v-bind="$props" type="info" class="app-region-no-drag" :class="[tagClass]">
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
            :title="showLabel(item)"
            @click="emit('item-click', item, props.visibleNumber + index)"
          >
            <slot name="item" :item="item" :label="showLabel(item)">
              {{ showLabel(item) }}
            </slot>
          </el-dropdown-item>
          <slot name="dropdown-extra" />
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ElTag } from 'element-plus'

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

  tagClass: {
    type: [String, Object, Array],
    default: '',
  },
})

const emit = defineEmits(['item-click'])

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
    return item?.label || item
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
