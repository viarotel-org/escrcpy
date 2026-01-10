<template>
  <t-chat
    ref="chatRef"
    class="t-chat--copilot !h-full scroll-smooth"
    layout="both"
    :clear-history="displayMessages.length > 0 && !isExecuting"
    @clear="handleClearAll"
  >
    <!-- 欢迎界面 -->
    <WelcomePanel
      v-if="displayMessages.length === 0 && !loading"
      class="mt-4"
    />

    <div class="p-4">
      <template v-for="item of reverseMessages" :key="item.id">
        <ChatItem v-bind="{ item, deleteMessage }"></ChatItem>
      </template>
    </div>

    <!-- 输入框 -->
    <template #footer>
      <ChatInput
        v-model="inputText"
        class="px-4 pb-4"
        :is-executing="isExecuting"
        @submit="handleSubmit"
        @stop="handleStop"
      />
    </template>
  </t-chat>
</template>

<script setup>
import WelcomePanel from './modules/welcome.vue'
import ChatItem from './modules/item.vue'
import ChatInput from './modules/input.vue'

import { t } from '$/locales/index.js'

import copilotClient from '$copilot/services/index.js'

import { useChatMessages } from '$/database/index.js'

import { adaptMessagesForTDesign, createTemporaryAssistantMessage } from '$copilot/utils/messageAdapter.js'
import { MessageRoleEnum, MessageStatusEnum, TaskStatusEnum } from '$copilot/dicts/index.js'

const props = defineProps({
  currentDevice: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['showPromptManager'])

// 会话ID - 使用设备ID作为会话标识
const sessionId = computed(() => {
  return props.currentDevice?.id || 'default'
})

// 使用聊天消息 Hook - 响应式自动同步
const {
  messages,
  loading,
  addMessage,
  deleteMessage,
  clearAll,
} = useChatMessages(sessionId)

// State
const inputText = ref('')
const isExecuting = ref(false)
const currentOutput = ref('')
const chatRef = ref(null)

// 临时消息（用于实时输出流）
const temporaryMessage = ref(null)

const displayMessages = ref([])

watchEffect(() => {
  if (!messages.value.length) {
    displayMessages.value = []
    return false
  }

  // 获取适配后的持久化消息
  const adapted = adaptMessagesForTDesign(messages.value, {
    reverse: true,
  })

  const merged = [...adapted]

  if (temporaryMessage.value) {
    merged.unshift(temporaryMessage.value)
  }

  displayMessages.value = merged
})

const reverseMessages = computed(() => {
  return [...displayMessages.value].reverse()
})

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

  // 添加用户消息到数据库
  const userMessageResult = await addMessage({
    role: MessageRoleEnum.USER,
    content: trimmedText,
    timestamp: Date.now(),
  })

  scrollToBottom()

  if (!userMessageResult.success) {
    ElMessage.error(t('copilot.error.saveFailed'))
    return
  }

  inputText.value = ''
  isExecuting.value = true
  currentOutput.value = ''

  // 创建临时助手消息（用于实时输出）
  temporaryMessage.value = createTemporaryAssistantMessage()

  try {
    // 获取设备 ID
    const deviceId = props.currentDevice?.id

    // 执行任务
    await copilotClient.execute(trimmedText, {
      deviceId,
      onData: (output, { payload }) => {
        currentOutput.value += output

        if (temporaryMessage.value) {
          temporaryMessage.value.content = currentOutput.value
          const event = payload?.event || 'start'
          temporaryMessage.value.status = TaskStatusEnum.raw(event).messageStatus || MessageStatusEnum.ERROR
        }

        scrollToBottom()
      },
    })

    if ([MessageStatusEnum.PENDING, MessageStatusEnum.RUNNING].includes(temporaryMessage.value.status)) {
      throw new Error(`${temporaryMessage.value.content}\n\n${window.t('copilot.check.subscription.expired.maybe')}`)
    }

    await addMessage({
      role: MessageRoleEnum.ASSISTANT,
      content: temporaryMessage.value.content,
      timestamp: Date.now(),
      status: temporaryMessage.value.status,
    })
  }
  catch (error) {
    // 添加错误消息到数据库
    await addMessage({
      role: MessageRoleEnum.ASSISTANT,
      content: error.message ?? window.t('copilot.error.executionFailed'),
      timestamp: Date.now(),
      status: MessageStatusEnum.FAILED,
    })
  }
  finally {
    temporaryMessage.value = null
    isExecuting.value = false
    currentOutput.value = ''
    scrollToBottom()
  }
}

function scrollToBottom(behavior = 'smooth') {
  if (chatRef.value?.scrollToBottom) {
    chatRef.value.scrollToBottom({ behavior })
  }
}

// 停止执行
async function handleStop() {
  copilotClient.stop(props.currentDevice?.id)
  isExecuting.value = false
}

// 清空所有消息
async function handleClearAll() {
  try {
    const result = await clearAll()
    if (result.success) {
      ElMessage.success(t('copilot.chat.clearSuccess'))
    }
    else {
      ElMessage.error(t('copilot.chat.clearFailed'))
    }
  }
  catch {
    ElMessage.error(t('copilot.chat.clearFailed'))
  }
}

onMounted(() => {
  window.electron.ipcRenderer.on('copilot-window-closing', () => {
    if (isExecuting.value) {
      copilotClient.destroy(props.currentDevice?.id)
    }
  })
})

onUnmounted(() => {
  if (isExecuting.value) {
    copilotClient.destroy(props.currentDevice?.id)
  }
})
</script>

<style lang="postcss">
</style>
