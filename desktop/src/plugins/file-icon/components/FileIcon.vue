<template>
  <div
    class="inline-block"
    :class="[iconClass, colorClass]"
    :style="sizeStyle"
    :title="title"
  />
</template>

<script setup>
import { getFileIconInfo } from '../utils/iconMap.js'

/**
 * FileIcon component
 * Renders an icon based on file type or filename
 */

const props = defineProps({
  /**
   * File object or file type string
   * Can be:
   * - String: file type (e.g., 'directory') or filename (e.g., 'test.jpg')
   * - Object: file object with type/name/isDirectory properties
   */
  file: {
    type: [String, Object],
    default: null,
  },

  /**
   * Icon size
   * Can be preset values or custom dimensions
   */
  size: {
    type: [String, Number],
    default: '1em',
    validator: (value) => {
      const presets = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
      return presets.includes(value) || !Number.isNaN(Number(value))
    },
  },

  /**
   * 自定义颜色类名（覆盖默认颜色）
   */
  color: {
    type: String,
    default: '',
  },

  /**
   * 自定义图标类名（覆盖默认图标）
   */
  icon: {
    type: String,
    default: '',
  },

  /**
   * 鼠标悬停提示文本
   */
  title: {
    type: String,
    default: '',
  },
})

// Size mapping
const sizeMap = {
  'xs': '0.75em',
  'sm': '0.875em',
  'md': '1em',
  'lg': '1.25em',
  'xl': '1.5em',
  '2xl': '2em',
}

// 计算图标类名
const iconClass = computed(() => {
  if (props.icon)
    return props.icon

  const iconInfo = getFileIconInfo(props.file)
  return iconInfo.icon
})

// 计算颜色类名
const colorClass = computed(() => {
  if (props.color)
    return props.color

  const iconInfo = getFileIconInfo(props.file)
  return iconInfo.color
})

// 计算尺寸样式
const sizeStyle = computed(() => {
  const size = sizeMap[props.size] || (Number.isNaN(Number(props.size)) ? props.size : `${props.size}px`)
  return {
    width: size,
    height: size,
    fontSize: size,
  }
})
</script>

<style scoped>
/* Ensure icon displays correctly */
div {
  flex-shrink: 0;
}
</style>
