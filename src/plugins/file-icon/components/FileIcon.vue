<template>
  <div
    class="inline-block"
    :class="[iconClass, colorClass]"
    :style="sizeStyle"
    :title="title"
  />
</template>

<script setup>
import { computed } from 'vue'
import { getFileIconInfo } from '../utils/iconMap.js'

/**
 * FileIcon 组件
 * 根据文件类型或文件名显示对应的图标
 */

const props = defineProps({
  /**
   * 文件对象或文件类型字符串
   * 可以是：
   * - 字符串：文件类型（如 'directory'）或文件名（如 'test.jpg'）
   * - 对象：包含 type/name/isDirectory 等属性的文件对象
   */
  file: {
    type: [String, Object],
    default: null,
  },

  /**
   * 图标大小
   * 可以是预设值或自定义尺寸
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

// 尺寸映射
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
/* 确保图标正确显示 */
div {
  flex-shrink: 0;
}
</style>
