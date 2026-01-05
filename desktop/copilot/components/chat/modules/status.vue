<template>
  <el-text :type="textType" size="default">
    <el-icon
      :class="{
        'is-loading': ['Loading'].includes(statusIcon),
      }"
    >
      <component :is="statusIcon" />
    </el-icon>
    {{ statusText }}
  </el-text>
</template>

<script setup>
import { t } from '$/locales/index.js'

const props = defineProps({
  status: {
    type: String,
    default: 'pending',
    validator: value => ['pending', 'running', 'completed', 'failed', 'stopped'].includes(value),
  },
})

// 状态图标
const statusIcon = computed(() => {
  switch (props.status) {
    case 'running':
      return 'Loading'
    case 'completed':
      return 'CircleCheckFilled'
    case 'failed':
      return 'CircleCloseFilled'
    case 'stopped':
      return 'WarningFilled'
    default:
      return 'Loading'
  }
})

const textType = computed(() => {
  switch (props.status) {
    case 'running':
      return 'primary'
    case 'completed':
      return 'success'
    case 'failed':
      return 'danger'
    case 'stopped':
      return 'warning'
    default:
      return 'info'
  }
})

// 状态图标样式
const statusIconClass = computed(() => {
  switch (props.status) {
    case 'running':
      return 'animate-spin text-primary-500'
    case 'completed':
      return 'text-green-500'
    case 'failed':
      return 'text-red-500'
    case 'stopped':
      return 'text-amber-500'
    default:
      return 'text-gray-400'
  }
})

// 状态文本
const statusText = computed(() => {
  switch (props.status) {
    case 'running':
      return t('copilot.taskStatus.running')
    case 'completed':
      return t('copilot.taskStatus.completed')
    case 'failed':
      return t('copilot.taskStatus.failed')
    case 'stopped':
      return t('copilot.taskStatus.stopped')
    default:
      return t('copilot.taskStatus.pending')
  }
})
</script>

<style lang="postcss" scoped>
</style>
