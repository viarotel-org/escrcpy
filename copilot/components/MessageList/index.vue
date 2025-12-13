<template>
  <div
    ref="messageListRef"
    class="message-list flex-1 overflow-y-auto"
  >
    <div class="px-4 py-3 space-y-4">
      <TransitionGroup name="message">
        <div
          v-for="(message, index) in messages"
          :key="message.id || index"
          class="message-item"
          :class="[
            message.role === 'user' ? 'message-user' : '',
            message.role === 'assistant' ? 'message-assistant' : '',
            message.role === 'system' ? 'message-system' : '',
          ]"
        >
          <!-- 用户消息 -->
          <div v-if="message.role === 'user'" class="flex justify-end">
            <div class="message-bubble user-bubble max-w-[80%]">
              <p class="text-white whitespace-pre-wrap text-sm">
                {{ message.content }}
              </p>
              <span class="message-time text-white/70">
                {{ formatTime(message.timestamp) }}
              </span>
            </div>
          </div>

          <!-- 助手消息 -->
          <div v-else-if="message.role === 'assistant'" class="flex justify-start">
            <div class="message-bubble assistant-bubble max-w-[85%]">
              <!-- 任务状态卡片 -->
              <TaskStatus
                v-if="message.status"
                :status="message.status"
                :steps="message.steps"
                :current-step="message.currentStep"
                class="mb-3"
              />

              <!-- 输出内容 -->
              <div
                v-if="message.content"
                class="message-content text-gray-800 dark:text-gray-200"
              >
                <pre class="whitespace-pre-wrap font-sans text-sm leading-relaxed">{{ message.content }}</pre>
              </div>

              <span class="message-time text-gray-400 dark:text-gray-500">
                {{ formatTime(message.timestamp) }}
              </span>
            </div>
          </div>

          <!-- 系统消息 -->
          <div v-else-if="message.role === 'system'" class="flex justify-center px-4">
            <div class="system-message inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm">
              <el-icon :size="14" class="text-amber-500">
                <WarningFilled />
              </el-icon>
              <span class="text-gray-600 dark:text-gray-400">{{ message.content }}</span>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- 正在执行指示器 -->
      <div v-if="isExecuting" class="flex justify-start">
        <div class="message-bubble assistant-bubble executing-bubble">
          <div class="flex items-center gap-3">
            <div class="executing-indicator">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
            <span class="text-gray-600 dark:text-gray-300 text-sm">
              {{ $t('copilot.executing') }}
            </span>
          </div>

          <!-- 实时输出 -->
          <div
            v-if="currentOutput"
            class="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50"
          >
            <pre class="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap max-h-40 overflow-y-auto font-mono">{{ currentOutput }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { WarningFilled } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

import TaskStatus from '../TaskStatus/index.vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
  isExecuting: {
    type: Boolean,
    default: false,
  },
  currentOutput: {
    type: String,
    default: '',
  },
})

const messageListRef = ref(null)

// 格式化时间
function formatTime(timestamp) {
  return dayjs(timestamp).format('HH:mm')
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

// 监听消息变化，自动滚动
watch(() => props.messages, scrollToBottom, { deep: true })
watch(() => props.currentOutput, scrollToBottom)

// 暴露滚动方法
defineExpose({
  scrollToBottom,
})
</script>

<style scoped>
.message-list {
  scroll-behavior: smooth;
}

.message-list::-webkit-scrollbar {
  width: 6px;
}

.message-list::-webkit-scrollbar-track {
  background: transparent;
}

.message-list::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

.message-list::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}

.message-bubble {
  position: relative;
  padding: 12px 16px;
  border-radius: 16px;
}

.user-bubble {
  background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
  border-bottom-right-radius: 4px;
}

.assistant-bubble {
  background: #f5f5f5;
  border-bottom-left-radius: 4px;
}

.dark .assistant-bubble {
  background: rgba(55, 65, 81, 0.5);
}

.system-message {
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
}

.message-time {
  display: block;
  font-size: 10px;
  margin-top: 6px;
  text-align: right;
}

.executing-bubble {
  min-width: 200px;
}

.executing-indicator {
  display: flex;
  gap: 4px;
}

.executing-indicator .dot {
  width: 6px;
  height: 6px;
  background: var(--el-color-primary);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.executing-indicator .dot:nth-child(1) {
  animation-delay: -0.32s;
}

.executing-indicator .dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* 消息进入动画 */
.message-enter-active {
  animation: messageIn 0.3s ease-out;
}

.message-leave-active {
  animation: messageOut 0.2s ease-in;
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes messageOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>
