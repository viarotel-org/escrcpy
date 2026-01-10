<template>
  <el-dialog
    v-model="visible"
    :title="$t('device.task.name')"
    center
    class="el-dialog--beautify el-dialog--flex el-dialog--fullscreen"
    append-to-body
    fullscreen
    destroy-on-close
    @closed="onClosed"
  >
    <div class="h-full overflow-auto">
      <div class="">
        <!-- Form sections layout -->
        <el-form
          ref="formRef"
          :model="model"
          :rules="rules"
          label-width="140px"
        >
          <div
            class="space-y-4"
          >
            <!-- Basic info section -->
            <div class="form-section">
              <div class="section-title mb-4">
                <el-icon class="mr-2">
                  <Setting />
                </el-icon>
                {{ $t('device.task.section.basic') }}
              </div>

              <el-form-item
                :label="$t('device.task.type')"
                prop="taskType"
              >
                <el-select
                  v-model="model.taskType"
                  :placeholder="$t('common.select.please')"
                  clearable
                  filterable
                  class="w-full"
                  @change="onTaskChange"
                >
                  <el-option
                    v-for="item in taskModel"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  >
                    <div class="flex items-center gap-2">
                      <span>{{ $t(item.label) }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>

              <!-- Task extra params: install app -->
              <el-form-item
                v-if="['install'].includes(model.taskType)"
                :label="$t('device.task.extra.app')"
                prop="extra"
              >
                <InputPath
                  v-model="model.extra"
                  :placeholder="$t('device.control.install.placeholder')"
                  :data="{
                    properties: ['openFile', 'multiSelections'],
                    filters: [
                      {
                        name: $t('device.control.install.placeholder'),
                        extensions: ['apk'],
                      },
                    ],
                  }"
                />
              </el-form-item>

              <!-- Task extra params: execute script -->
              <el-form-item
                v-if="['shell'].includes(model.taskType)"
                :label="$t('device.task.extra.shell')"
                prop="extra"
              >
                <InputPath
                  v-model="model.extra"
                  :placeholder="$t('terminal.script.select')"
                  :data="{
                    properties: ['openFile'],
                    filters: [
                      {
                        name: $t('terminal.script.select'),
                        extensions: ['sh'],
                      },
                    ],
                  }"
                />
              </el-form-item>

              <!-- Copilot task extra params: command content -->
              <el-form-item
                v-if="['copilot'].includes(model.taskType)"
                :label="$t('device.task.extra.copilot')"
                prop="extra"
              >
                <div class="w-full space-y-3">
                  <el-input
                    v-model="model.extra"
                    type="textarea"
                    :rows="4"
                    :placeholder="$t('copilot.welcome.description')"
                    :maxlength="2000"
                    show-word-limit
                  />

                  <!-- Quick prompt selection -->
                  <div v-if="quickPrompts.length > 0" class="quick-prompts-section">
                    <div class="flex items-center gap-2 mb-2">
                      <el-icon class="text-gray-400">
                        <EditPen />
                      </el-icon>
                      <span class="text-sm text-gray-500 dark:text-gray-400">
                        {{ $t('copilot.promptManager.quickSelect') }}
                      </span>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <el-tag
                        v-for="(prompt, index) in quickPrompts"
                        :key="index"
                        class="cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                        effect="plain"
                        @click="selectQuickPrompt(prompt)"
                      >
                        {{ prompt }}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </div>

            <!-- Execution frequency section -->
            <div class="form-section">
              <div class="section-title mb-4">
                <el-icon class="mr-2">
                  <Clock />
                </el-icon>
                {{ $t('device.task.section.frequency') }}
              </div>

              <el-form-item
                :label="$t('device.task.frequency')"
                prop="timerType"
              >
                <el-radio-group v-model="model.timerType" class="frequency-radio-group">
                  <el-radio
                    v-for="(item, index) of timerModel"
                    :key="index"
                    :value="item.value"
                    class="frequency-radio"
                  >
                    <div class="flex items-center gap-1">
                      <span>{{ $t(item.label) }}</span>
                    </div>
                  </el-radio>
                </el-radio-group>
              </el-form-item>

              <!-- Single-run configuration -->
              <el-form-item
                v-if="['timeout'].includes(model.timerType)"
                :label="$t('device.task.timeout')"
                prop="timeout"
              >
                <el-date-picker
                  v-model="model.timeout"
                  type="datetime"
                  placeholder="0000-00-00 00:00:00"
                  clearable
                  class="w-full"
                  v-bind="{ disabledDate, defaultTime }"
                />
              </el-form-item>

              <!-- Interval configuration -->
              <el-form-item
                v-if="['interval'].includes(model.timerType)"
                :label="$t('device.task.interval')"
                prop="interval"
              >
                <el-input
                  v-model="model.interval"
                  type="number"
                  placeholder="0"
                  clearable
                  class="w-full"
                >
                  <template #append>
                    <el-select
                      v-model="model.intervalType"
                      :placeholder="$t('common.select.please')"
                      filterable
                      class="!w-36"
                    >
                      <el-option
                        v-for="(item, index) of intervalModel"
                        :key="index"
                        :label="$t(item.label)"
                        :value="item.value"
                      />
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>

              <!-- Cron expression configuration -->
              <el-form-item
                v-if="['cron'].includes(model.timerType)"
                :label="$t('device.task.cronExpression')"
                prop="cronExpression"
              >
                <CronSelector
                  ref="cronSelectorRef"
                  v-model="model.cronExpression"
                  @valid-change="onCronValidChange"
                />
              </el-form-item>
            </div>

            <!-- Execution target block (device info display) -->
            <div class="form-section">
              <div class="section-title mb-4">
                <el-icon class="mr-2">
                  <Monitor />
                </el-icon>
                {{ $t('device.task.section.devices') }}
              </div>

              <div class="devices-info p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-gray-600 dark:text-gray-300">
                    {{ $t('device.task.selectedDevices') }}:
                  </span>
                  <el-tag type="primary">
                    {{ devices?.length || 0 }} {{ $t('common.device') }}
                  </el-tag>
                </div>
                <div v-if="devices && devices.length > 0" class="devices-list">
                  <ExTagCollapse
                    effect="light"
                    :value="devices"
                    :label="(item) => deviceStore.getLabel(item, 'name')"
                    :max="5"
                  />
                </div>
                <div v-else class="text-gray-400 text-sm">
                  {{ $t('device.task.noDeviceSelected') }}
                </div>
              </div>
            </div>

            <!-- Tips -->
            <div>
              <el-alert
                :title="$t('device.task.tips')"
                type="warning"
                :closable="false"
                show-icon
                class="!mb-0"
              />
            </div>
          </div>
        </el-form>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer flex items-center justify-end gap-3">
        <el-button @click="close">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="submit"
        >
          <el-icon class="mr-1">
            <Check />
          </el-icon>
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { Check, Clock, EditPen, Monitor, Setting } from '@element-plus/icons-vue'
import { Cron } from 'croner'

import InputPath from '$/components/preference-form/components/input-path/index.vue'
import CronSelector from '$/components/cron-selector/index.vue'
import {
  timeUnit as intervalModel,
  timerType as timerModel,
} from '$/dicts/index.js'
import { sleep } from '$/utils'
import copilotClient from '$copilot/services/index.js'

// Store references
const taskStore = useTaskStore()
const deviceStore = useDeviceStore()

// Dialog state
const visible = ref(false)
const loading = ref(false)

// Form refs
const formRef = ref(null)
const cronSelectorRef = ref(null)

// Device list
const devices = ref(null)

// Default time (for date picker)
const defaultTime = ref(null)

// Cron expression validity state
const cronValid = ref(true)

// Task model (from store, includes Copilot)
const taskModel = computed(() => taskStore.model)

// Copilot quick prompts
const quickPrompts = ref([])

/**
 * Form data model
 */
const model = ref({
  taskType: void 0, // 任务类型
  timerType: 'timeout', // 执行频率类型：timeout | interval | cron
  timeout: void 0, // 单次执行时间
  interval: void 0, // 周期间隔值
  intervalType: 'second', // 周期间隔单位
  cronExpression: '', // Cron 表达式
  extra: void 0, // 额外参数（如 APK 路径、脚本路径、Copilot 指令）
})

/**
 * 表单校验规则
 */
const rules = computed(() => {
  const baseRules = {
    taskType: [
      { required: true, message: window.t('common.required'), trigger: 'change' },
    ],
    timerType: [
      { required: true, message: window.t('common.required'), trigger: 'change' },
    ],
  }

  // 根据执行频率类型动态添加校验规则
  if (model.value.timerType === 'timeout') {
    baseRules.timeout = [
      { required: true, message: window.t('common.required'), trigger: 'change' },
      {
        trigger: 'change',
        validator: (rule, value, callback) => {
          if (value && value.getTime() <= Date.now()) {
            callback(new Error(window.t('device.task.timeout.tips')))
          }
          else {
            callback()
          }
        },
      },
    ]
  }
  else if (model.value.timerType === 'interval') {
    baseRules.interval = [
      { required: true, message: window.t('common.required'), trigger: 'blur' },
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          if (!value || Number.parseInt(value) <= 0) {
            callback(new Error(window.t('device.task.interval.invalid')))
          }
          else {
            callback()
          }
        },
      },
    ]
  }
  else if (model.value.timerType === 'cron') {
    baseRules.cronExpression = [
      { required: true, message: window.t('common.required'), trigger: 'change' },
      {
        trigger: 'change',
        validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error(window.t('common.required')))
          }
          else if (!validateCronExpression(value)) {
            callback(new Error(window.t('device.task.cron.invalid')))
          }
          else {
            callback()
          }
        },
      },
    ]
  }

  // 根据任务类型添加额外参数校验
  if (['install', 'shell', 'copilot'].includes(model.value.taskType)) {
    baseRules.extra = [
      { required: true, message: window.t('common.required'), trigger: 'blur' },
    ]
  }

  return baseRules
})

// 监听执行频率类型变化，清除相关字段
watch(
  () => model.value.timerType,
  (newType) => {
    // 切换类型时清除其他类型的值
    if (newType !== 'timeout') {
      model.value.timeout = void 0
    }
    if (newType !== 'interval') {
      model.value.interval = void 0
    }
    if (newType !== 'cron') {
      model.value.cronExpression = ''
    }
  },
)

/**
 * 验证 Cron 表达式有效性
 * 使用 croner@9.1.0 的验证能力
 * @param {string} expression - Cron 表达式
 * @returns {boolean} 是否有效
 */
function validateCronExpression(expression) {
  if (!expression) {
    return false
  }
  try {
    new Cron(expression, { legacyMode: false })
    return true
  }
  catch {
    return false
  }
}

/**
 * 打开弹窗
 * @param {Object} args - 参数对象
 * @param {Array|Object} args.devices - 设备列表或单个设备
 */
function open(args) {
  visible.value = true

  // 处理设备参数
  if (args.devices) {
    devices.value = args.devices
  }
  else if (args.device) {
    devices.value = [args.device]
  }

  // 设置默认时间为当前时间
  defaultTime.value = new Date()

  // 加载快捷指令
  loadQuickPrompts()
}

/**
 * 关闭弹窗
 */
function close() {
  visible.value = false
}

/**
 * 提交表单
 */
async function submit() {
  // 表单校验
  try {
    await formRef.value.validate()
  }
  catch (error) {
    return error.message
  }

  // Cron 表达式额外校验
  if (model.value.timerType === 'cron' && !cronValid.value) {
    ElMessage.warning(window.t('device.task.cron.invalid'))
    return
  }

  // 检查设备
  if (!devices.value || devices.value.length === 0) {
    ElMessage.warning(window.t('device.task.noDeviceSelected'))
    return
  }

  loading.value = true

  try {
    // 构建任务数据
    const taskData = {
      ...model.value,
      devices: devices.value,
    }

    // 添加任务到 store
    await taskStore.add(taskData)
    await sleep()
    await ElMessage.success(window.t('common.success'))

    close()
  }
  catch (error) {
    console.error('Failed to add task:', error)
    ElMessage.error(error.message || window.t('common.failed'))
  }
  finally {
    loading.value = false
  }
}

/**
 * 弹窗关闭回调
 */
async function onClosed() {
  devices.value = null
  formRef.value?.resetFields()
  formRef.value?.clearValidate()

  // 重置模型
  model.value = {
    taskType: void 0,
    timerType: 'timeout',
    timeout: void 0,
    interval: void 0,
    intervalType: 'second',
    cronExpression: '',
    extra: void 0,
  }
}

/**
 * 禁用日期（不能选择过去的日期）
 */
function disabledDate(time) {
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

/**
 * 任务类型变化回调
 */
function onTaskChange() {
  model.value.extra = void 0
}

/**
 * Cron 表达式有效性变化回调
 */
function onCronValidChange(valid) {
  cronValid.value = valid
}

/**
 * 加载快捷指令
 */
async function loadQuickPrompts() {
  try {
    const config = await copilotClient.getConfig() || {}
    quickPrompts.value = config.prompts || []
  }
  catch (error) {
    console.error('Failed to load quick prompts:', error)
    quickPrompts.value = []
  }
}

/**
 * 选择快捷指令
 * @param {string} prompt - 快捷指令内容
 */
function selectQuickPrompt(prompt) {
  model.value.extra = prompt
}

// 暴露方法
defineExpose({
  open,
  close,
})
</script>

<style lang="postcss" scoped>
.form-section {
  @apply p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800;
}

.section-title {
  @apply flex items-center text-lg font-medium text-gray-700 dark:text-gray-200;
}

.frequency-radio-group {
  @apply flex flex-wrap gap-4;
}

.frequency-radio {
  @apply !mr-0;
}

.devices-list {
  @apply max-h-32 overflow-y-auto;
}
</style>
