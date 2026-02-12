<template>
  <slot v-bind="{ loading, trigger: onTrigger }" />
  <ChatInputDialog
    v-if="chatInputLazy.visible"
    ref="chatInputDialogRef"
    :is-executing="loading"
  />
</template>

<script setup>
import copilotClient from '$copilot/services/index.js'
import { useChatMessages } from '$/database/index.js'
import ChatInputDialog from './components/chat-input-dialog.vue'
import { MessageRoleEnum, MessageStatusEnum } from '$copilot/dicts/index.js'
import { deviceSelectionHelper } from '$/utils/device/selection/index.js'
import pLimit from 'p-limit'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  devices: {
    type: Array,
    default: () => [],
  },
})

const taskStore = useTaskStore()

const loading = ref(false)

const EXECUTION_TIMEOUT = 10 * 60 * 1000

const chatInputDialogRef = ref(null)
const chatInputLazy = useLazy()

const currentTask = ref(null)

onMounted(() => {
  taskStore.on('copilot', (task) => {
    currentTask.value = task

    taskStore.start({
      task,
      handler: executeBatchCopilotTask,
    })
  })
})

async function onTrigger() {
  await chatInputLazy.mount()

  chatInputDialogRef.value.open({
    devices: props.devices,
    onSubmit(...args) {
      handleSubmit(...args)
    },
    onStop() {
      handleStop()
    },
    onClosed() {
      chatInputLazy.unmount()
    },
  })
}

async function saveUserMessage(deviceId, command, timestamp) {
  try {
    const { addMessage } = useChatMessages(computed(() => deviceId))

    const result = await addMessage({
      role: MessageRoleEnum.USER,
      content: command,
      timestamp,
    })

    return result
  }
  catch (error) {
    console.error('Failed to save user message:', error)
    return { success: false, error: error.message }
  }
}

async function saveAssistantMessage(deviceId, output, timestamp) {
  try {
    const { addMessage } = useChatMessages(computed(() => deviceId))

    const result = await addMessage({
      role: MessageRoleEnum.ASSISTANT,
      content: output,
      timestamp,
      status: MessageStatusEnum.COMPLETED,
    })

    return result
  }
  catch (error) {
    console.error('Failed to save assistant message:', error)
    return { success: false, error: error.message }
  }
}

async function saveSystemErrorMessage(deviceId, errorMessage, timestamp) {
  try {
    const { addMessage } = useChatMessages(computed(() => deviceId))

    const result = await addMessage({
      role: MessageRoleEnum.SYSTEM,
      content: `${window.t('copilot.error.executionFailed')}: ${errorMessage}`,
      timestamp,
      status: MessageStatusEnum.FAILED,
    })

    return result
  }
  catch (error) {
    console.error('Failed to save system error message:', error)
    return { success: false, error: error.message }
  }
}

async function executeWithRetryForDevice(device, command, taskConfig) {
  const deviceId = device.id
  const timestamp = Date.now()
  let lastError = null

  const userMessageResult = await saveUserMessage(deviceId, command, timestamp)
  if (!userMessageResult.success) {
    console.error('Failed to save user message, but continuing execution')
  }

  try {
    const result = await Promise.race([
      executeCopilotCommandForDevice(device, command),
      createTimeoutPromise(EXECUTION_TIMEOUT),
    ])

    await saveAssistantMessage(deviceId, result, Date.now())

    const record = {
      timestamp,
      deviceId,
      result: 'success',
      errorMessage: '',
      taskConfig,
      output: result,
    }

    return record
  }
  catch (error) {
    lastError = error

    if (error.message === 'EXECUTION_TIMEOUT') {
      const errorMsg = window.t('copilot.batch.error.timeout', { timeout: EXECUTION_TIMEOUT })
      await saveSystemErrorMessage(deviceId, errorMsg, Date.now())

      const record = {
        timestamp,
        deviceId,
        result: 'fail',
        errorMessage: errorMsg,
        taskConfig,
      }
      return record
    }
  }

  const errorMsg = lastError?.message || 'Unknown error'

  await saveSystemErrorMessage(deviceId, errorMsg, Date.now())

  const record = {
    timestamp,
    deviceId,
    result: 'fail',
    errorMessage: errorMsg,
    taskConfig,
  }

  return record
}

function createTimeoutPromise(timeout) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('EXECUTION_TIMEOUT'))
    }, timeout)
  })
}

async function executeCopilotCommandForDevice(device, command) {
  const copilotStore = useCopilotStore()
  const deviceId = device.id

  let output = ''

  const config = copilotStore.config || {}

  if (!config.apiKey) {
    throw copilotClient.formatError('CONFIG_MISSING', window.t('copilot.batch.error.missingApiKey'))
  }

  await copilotClient.execute(command, {
    deviceId,
    onData: (data) => {
      output += data
    },
  })

  return output
}

async function executeBatchCopilotTask(devices, options = {}) {
  const { extra: command, taskId, ...taskConfig } = options

  loading.value = true

  const results = []
  const concurrencyLimit = Number(window.$preload.store.get('common.concurrencyLimit') ?? 5)
  const limit = pLimit(concurrencyLimit)

  try {
    const tasks = devices.map(device =>
      limit(() =>
        executeWithRetryForDevice(device, command, {
          ...taskConfig,
          taskId,
        }),
      ),
    )

    const settledResults = await Promise.allSettled(tasks)
    results.push(...settledResults)

    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.result === 'success').length

    if (successCount === 0) {
      ElMessage.error(window.t('common.failed'))
    }
    else {
      ElMessage.success(window.t('copilot.batch.success'))
    }
  }
  catch (error) {
    console.error('Batch execution failed:', error)
    ElMessage.error(error.message || window.t('common.failed'))
  }
  finally {
    loading.value = false
  }

  return results
}

async function handleSubmit(command) {
  const loading = ElMessage.loading(window.t('copilot.taskStatus.running'))

  const selectedDevices = deviceSelectionHelper.filter(props.devices, 'onlineAndUnique')

  await executeBatchCopilotTask(selectedDevices, {
    extra: command,
    taskId: `batch-copilot-${Date.now()}`,
  })

  loading.close()
}

async function handleStop() {
  taskStore.stop(currentTask.value)
  props.devices.forEach((device) => {
    copilotClient.stop(device.id)
  })
}
</script>

<style></style>
