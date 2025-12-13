<template>
  <div class="task-status-card" :class="statusCardClass">
    <!-- 卡片头部 - 状态指示 -->
    <div class="status-header flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="status-icon-wrapper" :class="statusIconWrapperClass">
          <el-icon :size="14" :class="statusIconClass">
            <component :is="statusIcon" />
          </el-icon>
        </div>
        <span class="status-label text-sm font-medium" :class="statusTextClass">
          {{ statusText }}
        </span>
      </div>

      <!-- 进度指示 -->
      <div v-if="steps && steps.length > 0" class="progress-badge px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
        {{ currentStep || 0 }}/{{ steps.length }}
      </div>
    </div>

    <!-- 步骤时间线 -->
    <div v-if="steps && steps.length > 0" class="steps-timeline mt-3">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step-item flex items-start gap-3"
        :class="{ 'opacity-50': index > currentStep }"
      >
        <!-- 步骤指示器 -->
        <div class="step-indicator flex flex-col items-center">
          <div
            class="step-dot w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium transition-all"
            :class="getStepDotClass(index)"
          >
            <el-icon v-if="getStepStatus(index) === 'success'" :size="10">
              <Check />
            </el-icon>
            <el-icon v-else-if="getStepStatus(index) === 'error'" :size="10">
              <Close />
            </el-icon>
            <span v-else-if="getStepStatus(index) === 'process'" class="step-pulse"></span>
            <span v-else class="text-[10px]">{{ index + 1 }}</span>
          </div>
          <div
            v-if="index < steps.length - 1"
            class="step-line w-0.5 h-6 mt-1 transition-colors"
            :class="index < currentStep ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'"
          ></div>
        </div>

        <!-- 步骤内容 -->
        <div class="step-content flex-1 pb-3">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ step.title }}
          </p>
          <p v-if="step.description" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- 底部进度条 -->
    <div v-if="status === 'running' && steps && steps.length > 0" class="progress-bar mt-2">
      <div class="progress-track h-1 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          class="progress-fill h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-500 transition-all duration-300"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Check,
  CircleCheckFilled,
  CircleCloseFilled,
  Clock,
  Close,
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

// 状态卡片样式
const statusCardClass = computed(() => {
  switch (props.status) {
    case 'running':
      return 'status-running'
    case 'completed':
      return 'status-completed'
    case 'failed':
      return 'status-failed'
    case 'stopped':
      return 'status-stopped'
    default:
      return 'status-pending'
  }
})

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

// 状态图标包装器样式
const statusIconWrapperClass = computed(() => {
  switch (props.status) {
    case 'running':
      return 'bg-primary-100 dark:bg-primary-900/30'
    case 'completed':
      return 'bg-green-100 dark:bg-green-900/30'
    case 'failed':
      return 'bg-red-100 dark:bg-red-900/30'
    case 'stopped':
      return 'bg-amber-100 dark:bg-amber-900/30'
    default:
      return 'bg-gray-100 dark:bg-gray-800'
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

// 状态文本样式
const statusTextClass = computed(() => {
  switch (props.status) {
    case 'running':
      return 'text-primary-600 dark:text-primary-400'
    case 'completed':
      return 'text-green-600 dark:text-green-400'
    case 'failed':
      return 'text-red-600 dark:text-red-400'
    case 'stopped':
      return 'text-amber-600 dark:text-amber-400'
    default:
      return 'text-gray-500 dark:text-gray-400'
  }
})

// 获取步骤状态
function getStepStatus(index) {
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

// 获取步骤圆点样式
function getStepDotClass(index) {
  const status = getStepStatus(index)
  switch (status) {
    case 'success':
      return 'bg-green-500 text-white'
    case 'error':
      return 'bg-red-500 text-white'
    case 'process':
      return 'bg-primary-500 text-white'
    default:
      return 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
  }
}

// 进度百分比
const progressPercentage = computed(() => {
  if (!props.steps || props.steps.length === 0)
    return 0
  return Math.round(((props.currentStep || 0) / props.steps.length) * 100)
})
</script>

<style scoped>
.task-status-card {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid;
}

.status-pending {
  background: rgba(156, 163, 175, 0.05);
  border-color: rgba(156, 163, 175, 0.2);
}

.status-running {
  background: rgba(var(--el-color-primary-rgb), 0.05);
  border-color: rgba(var(--el-color-primary-rgb), 0.2);
}

.status-completed {
  background: rgba(34, 197, 94, 0.05);
  border-color: rgba(34, 197, 94, 0.2);
}

.status-failed {
  background: rgba(239, 68, 68, 0.05);
  border-color: rgba(239, 68, 68, 0.2);
}

.status-stopped {
  background: rgba(245, 158, 11, 0.05);
  border-color: rgba(245, 158, 11, 0.2);
}

.status-icon-wrapper {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: white;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}
</style>
