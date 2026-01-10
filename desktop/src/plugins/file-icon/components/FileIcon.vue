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
   * Custom color class name (overrides default color)
   */
  color: {
    type: String,
    default: '',
  },

  /**
   * Custom icon class name (overrides default icon)
   */
  icon: {
    type: String,
    default: '',
  },

  /**
   * Tooltip text on hover
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

// Compute icon class name
const iconClass = computed(() => {
  if (props.icon)
    return props.icon

  const iconInfo = getFileIconInfo(props.file)
  return iconInfo.icon
})

// Compute color class name
const colorClass = computed(() => {
  if (props.color)
    return props.color

  const iconInfo = getFileIconInfo(props.file)
  return iconInfo.color
})

// Compute size style
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
