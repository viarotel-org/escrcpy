<template>
  <slot v-bind="{ loading, trigger: onTrigger }" />
  <ChatInputDialog
    ref="chatInputDialogRef"
    :devices="devices"
    :is-executing="loading"
    @submit="onSubmit"
    @stop="onStopClick"
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

// Task store
const taskStore = useTaskStore()

// Loading state
const loading = ref(false)

// Execution timeout (milliseconds)
const EXECUTION_TIMEOUT = 10 * 60 * 1000

const chatInputDialogRef = ref(null)

const currentTask = ref(null)

/**
 * Register Copilot task listener
 * Uses taskStore.on mechanism to remain consistent with other task types (mirror, install, etc.)
 */
onMounted(() => {
  taskStore.on('copilot', (task) => {
    currentTask.value = task

    taskStore.start({
      task,
      handler: executeBatchCopilotTask,
    })
  })
})

/**
 * Execution record structure
 * @typedef {Object} ExecutionRecord
 * @property {number} timestamp - Execution time (ms UTC timestamp)
 * @property {string} deviceId - Device ID
 * @property {'success'|'fail'} result - Execution result
 * @property {string} errorMessage - Error message (empty when none)
 * @property {Object} taskConfig - Task configuration (includes cron expression / scheduling rules)
 */

/**
 * Save user message to device database
 * Aligns with ChatPanel logic: record user command when a scheduled task triggers
 *
 * @param {string} deviceId - Device ID
 * @param {string} command - User command
 * @param {number} timestamp - Timestamp
 * @returns {Promise<Object>} Save result
 */
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

/**
 * Save assistant message to device database
 * Aligns with ChatPanel logic: record assistant output after successful execution
 *
 * @param {string} deviceId - Device ID
 * @param {string} output - Execution output
 * @param {number} timestamp - Timestamp
 * @returns {Promise<Object>} Save result
 */
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

/**
 * Save system error message to device database
 * Aligns with ChatPanel logic: record errors only when execution fails
 *
 * @param {string} deviceId - Device ID
 * @param {string} errorMessage - Error message
 * @param {number} timestamp - Timestamp
 * @returns {Promise<Object>} Save result
 */
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

/**
 * Single-device execution with retries
 * Retries up to 3 times for offline devices with 5s intervals
 * Aligns with ChatPanel persistence logic:
 * - Success: insert USER + ASSISTANT messages
 * - Failure: insert USER + SYSTEM error message
 *
 * @param {Object} device - Device object
 * @param {string} command - Copilot command
 * @param {Object} taskConfig - Task configuration
 * @returns {Promise<ExecutionRecord>} Execution record
 */
async function executeWithRetryForDevice(device, command, taskConfig) {
  const deviceId = device.id
  const timestamp = Date.now()
  let lastError = null

  // 1. Save user message first (align with ChatPanel logic)
  const userMessageResult = await saveUserMessage(deviceId, command, timestamp)
  if (!userMessageResult.success) {
    console.error('Failed to save user message, but continuing execution')
  }

  try {
    // Use Promise.race to implement timeout control
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

    // Timeout error
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

  // All retries failed
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

/**
 * Create a timeout Promise
 * @param {number} timeout - Timeout in milliseconds
 */
function createTimeoutPromise(timeout) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('EXECUTION_TIMEOUT'))
    }, timeout)
  })
}

/**
 * Execute a Copilot command on a single device
 *
 * @param {Object} device - Device object
 * @param {string} command - Copilot command
 * @returns {Promise<string>} Execution output
 */
async function executeCopilotCommandForDevice(device, command) {
  const copilotStore = useCopilotStore()
  const deviceId = device.id

  let output = ''

  const config = copilotStore.config || {}

  if (!config.apiKey) {
    throw copilotClient.formatError('CONFIG_MISSING', window.t('copilot.batch.error.missingApiKey'))
  }

  // Execute task
  await copilotClient.execute(command, {
    deviceId,
    onData: (data) => {
      output += data
    },
  })

  return output
}

/**
 * Execute Copilot task in batch
 *
 * @param {Array} devices - Device list
 * @param {Object} options - Execution options
 * @param {string} options.extra - Copilot command content
 * @param {string} options.taskId - Task ID
 * @param {Object} options.taskConfig - Full task configuration
 */
async function executeBatchCopilotTask(devices, options = {}) {
  const { extra: command, taskId, ...taskConfig } = options

  loading.value = true

  const results = []
  const concurrencyLimit = Number(window.electronStore.get('common.concurrencyLimit') ?? 5)
  const limit = pLimit(concurrencyLimit)

  try {
    // Create concurrency-limited tasks
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

    // Aggregate results
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

/**
 * Handle dialog submit
 * @param {string} command - Copilot command entered by user
 */
async function onSubmit(command) {
  const loading = ElMessage.loading(window.t('copilot.taskStatus.running'))

  const selectedDevices = deviceSelectionHelper.filter(props.devices, 'onlineAndUnique')

  // Invoke the batch execution method
  await executeBatchCopilotTask(selectedDevices, {
    extra: command,
    taskId: `batch-copilot-${Date.now()}`,
  })

  loading.close()
}

async function onStopClick() {
  taskStore.stop(currentTask.value)
  props.devices.forEach((device) => {
    copilotClient.stop(device.id)
  })
}

function onTrigger() {
  chatInputDialogRef.value.open()
}
</script>

<style></style>
