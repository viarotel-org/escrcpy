<template>
  <div class="task-status">
    <!-- 状态指示器 -->
    <div class="flex items-center space-x-2 mb-2">
      <el-icon
        :size="16"
        :class="statusIconClass"
      >
        <component :is="statusIcon" />
      </el-icon>
      <span :class="statusTextClass">{{ statusText }}</span>
    </div>

    <!-- 步骤进度 -->
    <div v-if="steps && steps.length > 0" class="mt-3">
      <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
        {{ $t('copilot.taskStatus.steps') }} ({{ currentStep || 0 }}/{{ steps.length }})
      </div>
      <el-steps
        :active="currentStep || 0"
        direction="vertical"
        :space="40"
        class="compact-steps"
      >
        <el-step
          v-for="(step, index) in steps"
          :key="index"
          :title="step.title"
          :description="step.description"
          :status="getStepStatus(index)"
        />
      </el-steps>
    </div>

    <!-- 进度条 -->
    <el-progress
      v-if="status === 'running' && steps && steps.length > 0"
      :percentage="progressPercentage"
      :stroke-width="4"
      :show-text="false"
      class="mt-2"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  CircleCheckFilled,
  CircleCloseFilled,
  Clock,
  Loading,
  WarningFilled,
} from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  status: {
    type: String,
    default: 'pending',
    validator: value => ['pending', 'running', 'completed', 'failed', 'stopped'].includes(value),
  },
  steps: {
    type: Array,
    default: () => [],
  },
  currentStep: {
    type: Number,
    default: 0,
  },
})

const { t } = useI18n()

// 状态图标
const statusIcon = computed(() => {
  switch (props.status) {
    case 'running':
      return Loading
    case 'completed':
      return CircleCheckFilled
    case 'failed':
      return CircleCloseFilled
    case 'stopped':
      return WarningFilled
    default:
      return Clock
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
      return 'text-yellow-500'
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

// 状态文本样式
const statusTextClass = computed(() => {
  switch (props.status) {
    case 'running':
      return 'text-primary-500 font-medium'
    case 'completed':
      return 'text-green-500 font-medium'
    case 'failed':
      return 'text-red-500 font-medium'
    case 'stopped':
      return 'text-yellow-500 font-medium'
    default:
      return 'text-gray-400'
  }
})

// 获取步骤状态
const getStepStatus = (index) => {
  if (props.status === 'failed' && index === props.currentStep) {
    return 'error'
  }
  if (index < props.currentStep) {
    return 'success'
  }
  if (index === props.currentStep && props.status === 'running') {
    return 'process'
  }
  return 'wait'
}

// 进度百分比
const progressPercentage = computed(() => {
  if (!props.steps || props.steps.length === 0)
    return 0
  return Math.round(((props.currentStep || 0) / props.steps.length) * 100)
})
</script>

<style scoped>
.compact-steps :deep(.el-step__title) {
  font-size: 12px;
  line-height: 1.4;
}

.compact-steps :deep(.el-step__description) {
  font-size: 11px;
}

.compact-steps :deep(.el-step__icon) {
  width: 20px;
  height: 20px;
}
</style>
