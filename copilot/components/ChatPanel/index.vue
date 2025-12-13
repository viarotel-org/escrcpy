<template>
  <div class="chat-panel flex flex-col h-full bg-white dark:bg-gray-900">
    <!-- 欢迎界面 -->
    <WelcomePanel
      v-if="messages.length === 0"
      :prompts="quickPrompts"
      :max-display-count="4"
      class="flex-1"
      @select-prompt="handlePromptSelect"
      @show-prompt-manager="emit('showPromptManager')"
    />

    <!-- 聊天界面 -->
    <template v-else>
      <!-- 消息列表 -->
      <MessageList
        ref="messageListRef"
        :messages="messages"
        :is-executing="isExecuting"
        :current-output="currentOutput"
        class="flex-1 h-0"
      />
    </template>

    <!-- 输入区域 -->
    <ChatInput
      ref="chatInputRef"
      v-model="inputText"
      :is-executing="isExecuting"
      :quick-prompts="quickPrompts"
      :show-quick-prompts="messages.length > 0"
      @submit="handleSubmit"
      @stop="handleStop"
      @show-prompt-manager="emit('showPromptManager')"
    />
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import copilotClient from '$/services/copilot/index.js'

import WelcomePanel from '../WelcomePanel/index.vue'
import MessageList from '../MessageList/index.vue'
import ChatInput from '../ChatInput/index.vue'

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
const chatInputRef = ref(null)

// 快捷指令
const quickPrompts = ref([])

// 消息 ID 生成器
let messageIdCounter = 0
function generateMessageId() {
  return `msg_${Date.now()}_${++messageIdCounter}`
}

// 加载快捷指令
async function loadQuickPrompts() {
  const config = await copilotClient.getConfig()
  quickPrompts.value = config?.prompts || []
}

// 处理快捷指令选择
function handlePromptSelect(prompt) {
  inputText.value = prompt
  nextTick(() => {
    chatInputRef.value?.focus()
  })
}

// 提交指令
async function handleSubmit(text) {
  const trimmedText = text?.trim() || inputText.value.trim()
  if (!trimmedText || isExecuting.value)
    return

  // 检查配置
  const config = await copilotClient.getConfig() || {}
  if (!config.apiKey) {
    ElMessage.warning(t('copilot.error.noApiKey'))
    return
  }

  // 添加用户消息
  messages.value.push({
    id: generateMessageId(),
    role: 'user',
    content: trimmedText,
    timestamp: Date.now(),
  })

  inputText.value = ''
  isExecuting.value = true
  currentOutput.value = ''

  try {
    // 获取设备 ID
    const deviceId = props.taskMode === 'single'
      ? props.currentDevice?.id
      : props.targetDevices.map(d => d.id)

    // 执行任务
    await copilotClient.execute(trimmedText, {
      deviceId,
      mode: props.taskMode,
      onData: (output) => {
        currentOutput.value += output
      },
      onError: (error) => {
        currentOutput.value += `[ERROR] ${error}`
      },
    })

    // 添加助手消息
    messages.value.push({
      id: generateMessageId(),
      role: 'assistant',
      content: currentOutput.value,
      timestamp: Date.now(),
      status: 'completed',
    })
  }
  catch (error) {
    // 添加错误消息
    messages.value.push({
      id: generateMessageId(),
      role: 'system',
      content: `${t('copilot.error.executionFailed')}: ${error.message}`,
      timestamp: Date.now(),
    })
    ElMessage.error(error.message)
  }
  finally {
    isExecuting.value = false
    currentOutput.value = ''
  }
}

// 停止执行
function handleStop() {
  copilotClient.destroyAll()
  isExecuting.value = false
  currentOutput.value = ''

  messages.value.push({
    id: generateMessageId(),
    role: 'system',
    content: t('copilot.stopped'),
    timestamp: Date.now(),
  })
}

// 监听窗口关闭事件
onMounted(() => {
  loadQuickPrompts()

  window.electron.ipcRenderer.on('copilot-window-closing', () => {
    if (isExecuting.value) {
      copilotClient.destroyAll()
    }
  })
})

onUnmounted(() => {
  if (isExecuting.value) {
    copilotClient.destroyAll()
  }
})

// 监听配置变化，重新加载快捷指令
watch(() => props.currentDevice, () => {
  loadQuickPrompts()
})
</script>

<style scoped>
.chat-panel {
  min-height: 0;
}
</style>
