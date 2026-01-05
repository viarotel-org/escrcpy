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

// 任务 Store
const taskStore = useTaskStore()

// 加载状态
const loading = ref(false)

// 执行超时时间（毫秒）
const EXECUTION_TIMEOUT = 10 * 60 * 1000

const chatInputDialogRef = ref(null)

const currentTask = ref(null)

/**
 * 注册 Copilot 任务监听器
 * 基于 taskStore.on 机制，与其他任务类型（mirror、install 等）保持一致
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
 * 执行记录结构
 * @typedef {Object} ExecutionRecord
 * @property {number} timestamp - 执行时间（毫秒级时间戳）
 * @property {string} deviceId - 设备 ID
 * @property {'success'|'fail'} result - 执行结果
 * @property {string} errorMessage - 异常信息（无则为空）
 * @property {Object} taskConfig - 任务配置参数（含 Cron 表达式/定时规则）
 */

/**
 * 保存用户消息到设备数据库
 * 对齐 ChatPanel 逻辑：计划任务触发时记录用户指令
 *
 * @param {string} deviceId - 设备 ID
 * @param {string} command - 用户指令
 * @param {number} timestamp - 时间戳
 * @returns {Promise<Object>} 保存结果
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
 * 保存助手消息到设备数据库
 * 对齐 ChatPanel 逻辑：执行成功后记录输出结果
 *
 * @param {string} deviceId - 设备 ID
 * @param {string} output - 执行输出
 * @param {number} timestamp - 时间戳
 * @returns {Promise<Object>} 保存结果
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
 * 保存系统错误消息到设备数据库
 * 对齐 ChatPanel 逻辑：仅在执行失败时记录错误信息
 *
 * @param {string} deviceId - 设备 ID
 * @param {string} errorMessage - 错误信息
 * @param {number} timestamp - 时间戳
 * @returns {Promise<Object>} 保存结果
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
 * 带重试的单设备执行
 * 设备离线时触发 3 次重试，每次间隔 5s
 * 对齐 ChatPanel 消息入库逻辑：
 * - 正常场景：插入 USER + ASSISTANT 消息
 * - 异常场景：插入 USER + SYSTEM 错误消息
 *
 * @param {Object} device - 设备对象
 * @param {string} command - Copilot 指令
 * @param {Object} taskConfig - 任务配置
 * @returns {Promise<ExecutionRecord>} 执行记录
 */
async function executeWithRetryForDevice(device, command, taskConfig) {
  const deviceId = device.id
  const timestamp = Date.now()
  let lastError = null

  // 1. 先保存用户消息（对齐 ChatPanel 逻辑）
  const userMessageResult = await saveUserMessage(deviceId, command, timestamp)
  if (!userMessageResult.success) {
    console.error('Failed to save user message, but continuing execution')
  }

  try {
    // 使用 Promise.race 实现超时控制
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

    // 超时错误
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

  // 所有重试失败
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
 * 创建超时 Promise
 * @param {number} timeout - 超时时间（毫秒）
 */
function createTimeoutPromise(timeout) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('EXECUTION_TIMEOUT'))
    }, timeout)
  })
}

/**
 * 执行单个设备的 Copilot 指令
 *
 * @param {Object} device - 设备对象
 * @param {string} command - Copilot 指令
 * @returns {Promise<string>} 执行输出
 */
async function executeCopilotCommandForDevice(device, command) {
  const deviceId = device.id

  let output = ''

  // 检查配置
  const config = await copilotClient.getConfig() || {}
  if (!config.apiKey) {
    throw copilotClient.formatError('CONFIG_MISSING', window.t('copilot.batch.error.missingApiKey'))
  }

  // 执行任务
  await copilotClient.execute(command, {
    deviceId,
    onData: (data) => {
      output += data
    },
  })

  return output
}

/**
 * 批量执行 Copilot 任务
 *
 * @param {Array} devices - 设备列表
 * @param {Object} options - 执行选项
 * @param {string} options.extra - Copilot 指令内容
 * @param {string} options.taskId - 任务 ID
 * @param {Object} options.taskConfig - 完整任务配置
 */
async function executeBatchCopilotTask(devices, options = {}) {
  const { extra: command, taskId, ...taskConfig } = options

  loading.value = true

  const results = []
  const concurrencyLimit = window.appStore.get('common.concurrencyLimit') ?? 5
  const limit = pLimit(concurrencyLimit)

  try {
    // 创建受限并发的任务
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

    // 统计结果
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
 * 处理弹窗提交
 * @param {string} command - 用户输入的 Copilot 指令
 */
async function onSubmit(command) {
  const loading = ElMessage.loading(window.t('copilot.taskStatus.running'))

  const selectedDevices = deviceSelectionHelper.filter(props.devices, 'onlineAndUnique')

  // 调用批量执行方法
  await executeBatchCopilotTask(selectedDevices, {
    extra: command,
    taskId: `batch-copilot-${Date.now()}`,
  })

  loading.close()

  ElMessage.success(window.t('common.success'))
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
