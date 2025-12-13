<template>
  <div class="flex flex-col h-full">
    <!-- 消息列表区域 -->
    <div
      ref="messageListRef"
      class="flex-1 overflow-y-auto p-4 space-y-4"
    >
      <!-- 欢迎消息 -->
      <div
        v-if="messages.length === 0"
        class="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400"
      >
        <el-icon :size="64" class="mb-4 text-primary-300">
          <ChatDotRound />
        </el-icon>
        <h2 class="text-lg font-medium mb-2">
          {{ $t('copilot.welcome.title') }}
        </h2>
        <p class="text-sm text-center max-w-md">
          {{ $t('copilot.welcome.description') }}
        </p>

        <!-- 快捷指令展示 -->
        <div class="mt-6 flex flex-wrap justify-center gap-2 max-w-lg">
          <el-tag
            v-for="(prompt, index) in quickPrompts.slice(0, 5)"
            :key="index"
            class="cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
            effect="plain"
            @click="handlePromptClick(prompt)"
          >
            {{ prompt }}
          </el-tag>
        </div>
      </div>

      <!-- 消息列表 -->
      <template v-else>
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="flex"
          :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-[80%] rounded-lg px-4 py-3"
            :class="getMessageClass(message)"
          >
            <!-- 用户消息 -->
            <template v-if="message.role === 'user'">
              <p class="text-white whitespace-pre-wrap">
                {{ message.content }}
              </p>
            </template>

            <!-- 助手消息 -->
            <template v-else-if="message.role === 'assistant'">
              <div class="text-gray-800 dark:text-gray-200">
                <!-- 任务状态 -->
                <TaskStatus
                  v-if="message.status"
                  :status="message.status"
                  :steps="message.steps"
                  :current-step="message.currentStep"
                />
                <!-- 输出内容 -->
                <pre
                  v-if="message.content"
                  class="whitespace-pre-wrap font-sans text-sm"
                >{{ message.content }}</pre>
              </div>
            </template>

            <!-- 系统消息（错误等） -->
            <template v-else-if="message.role === 'system'">
              <div class="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <el-icon><WarningFilled /></el-icon>
                <span>{{ message.content }}</span>
              </div>
            </template>

            <div class="text-xs text-gray-400 mt-2">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>

        <!-- 正在输入指示器 -->
        <div v-if="isExecuting" class="flex justify-start">
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3">
            <div class="flex items-center space-x-2">
              <el-icon class="animate-spin text-primary-500">
                <Loading />
              </el-icon>
              <span class="text-gray-600 dark:text-gray-300">{{ $t('copilot.executing') }}</span>
            </div>
            <pre
              v-if="currentOutput"
              class="mt-2 text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap max-h-40 overflow-y-auto"
            >{{ currentOutput }}</pre>
          </div>
        </div>
      </template>
    </div>

    <!-- 快捷指令栏 -->
    <div
      v-if="quickPrompts.length > 0 && messages.length > 0"
      class="flex-none border-t border-gray-200 dark:border-gray-700 px-4 py-2"
    >
      <div class="flex items-center overflow-x-auto space-x-2 scrollbar-thin">
        <span class="text-xs text-gray-500 dark:text-gray-400 flex-none">
          {{ $t('copilot.quickPrompts') }}:
        </span>
        <el-tag
          v-for="(prompt, index) in quickPrompts.slice(0, 5)"
          :key="index"
          size="small"
          class="cursor-pointer flex-none hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
          effect="plain"
          @click="handlePromptClick(prompt)"
        >
          {{ prompt }}
        </el-tag>
        <el-button
          v-if="quickPrompts.length > 5"
          size="small"
          text
          type="primary"
          @click="emit('showPromptManager')"
        >
          {{ $t('copilot.morePrompts') }}
        </el-button>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="flex-none border-t border-gray-200 dark:border-gray-700 p-4">
      <div class="flex items-end space-x-3">
        <el-input
          ref="inputRef"
          v-model="inputText"
          type="textarea"
          :placeholder="$t('copilot.inputPlaceholder')"
          :autosize="{ minRows: 1, maxRows: 4 }"
          :disabled="isExecuting"
          class="flex-1"
          @keydown.enter.exact.prevent="handleSubmit"
          @keydown.enter.shift.exact="() => {}"
        />
        <div class="flex flex-col space-y-2">
          <el-button
            v-if="isExecuting"
            type="danger"
            :icon="VideoPause"
            @click="handleStop"
          >
            {{ $t('copilot.stop') }}
          </el-button>
          <el-button
            v-else
            type="primary"
            :icon="Promotion"
            :disabled="!inputText.trim()"
            @click="handleSubmit"
          >
            {{ $t('copilot.send') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { ChatDotRound, Loading, Promotion, VideoPause, WarningFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'

import TaskStatus from '../TaskStatus/index.vue'

const props = defineProps({
  taskMode: {
    type: String,
    default: 'single',
  },
  targetDevices: {
    type: Array,
    default: () => [],
  },
  currentDevice: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['showPromptManager'])

const { t } = useI18n()

// 状态
const inputText = ref('')
const messages = ref([])
const isExecuting = ref(false)
const currentOutput = ref('')
const messageListRef = ref(null)
const inputRef = ref(null)

// 快捷指令
const quickPrompts = computed(() => {
  return window.copilot?.getConfig?.()?.prompts || []
})

// 获取消息样式类
const getMessageClass = (message) => {
  switch (message.role) {
    case 'user':
      return 'bg-primary-500 text-white'
    case 'assistant':
      return 'bg-gray-100 dark:bg-gray-700'
    case 'system':
      return 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
    default:
      return 'bg-gray-100 dark:bg-gray-700'
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  return dayjs(timestamp).format('HH:mm:ss')
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

// 提交指令
const handleSubmit = async () => {
  const text = inputText.value.trim()
  if (!text || isExecuting.value)
    return

  // 检查配置
  const config = window.copilot?.getConfig?.() || {}
  if (!config.apiKey) {
    ElMessage.warning(t('copilot.error.noApiKey'))
    return
  }

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: text,
    timestamp: Date.now(),
  })

  inputText.value = ''
  isExecuting.value = true
  currentOutput.value = ''
  scrollToBottom()

  try {
    // 获取设备 ID
    const deviceId = props.taskMode === 'single'
      ? props.currentDevice?.id
      : props.targetDevices.map(d => d.id)

    // 执行任务
    const result = await window.copilot.execute(text, {
      deviceId,
      mode: props.taskMode,
      onOutput: (output) => {
        currentOutput.value += output
        scrollToBottom()
      },
      onError: (error) => {
        currentOutput.value += `[ERROR] ${error}`
        scrollToBottom()
      },
    })

    // 添加助手消息
    messages.value.push({
      role: 'assistant',
      content: result.output || currentOutput.value,
      timestamp: Date.now(),
      status: 'completed',
    })
  }
  catch (error) {
    // 添加错误消息
    messages.value.push({
      role: 'system',
      content: `${t('copilot.error.executionFailed')}: ${error.message}`,
      timestamp: Date.now(),
    })
    ElMessage.error(error.message)
  }
  finally {
    isExecuting.value = false
    currentOutput.value = ''
    scrollToBottom()
  }
}

// 快捷指令点击
const handlePromptClick = (prompt) => {
  inputText.value = prompt
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// 停止执行
const handleStop = () => {
  window.copilot?.stop?.()
  isExecuting.value = false
  currentOutput.value = ''

  messages.value.push({
    role: 'system',
    content: t('copilot.stopped'),
    timestamp: Date.now(),
  })
}

// 监听消息变化，自动滚动
watch(messages, scrollToBottom, { deep: true })

// 监听窗口关闭事件
onMounted(() => {
  window.electron.ipcRenderer.on('copilot-window-closing', () => {
    if (isExecuting.value) {
      window.copilot?.stop?.()
    }
  })
})

onUnmounted(() => {
  if (isExecuting.value) {
    window.copilot?.stop?.()
  }
})
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}
</style>
