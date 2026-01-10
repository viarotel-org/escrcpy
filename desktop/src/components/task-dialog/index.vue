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
    <div class="h-full overflow-auto pr-2">
      <el-form
        :key="model.taskType"
        ref="formRef"
        :model="model"
        :rules="rules"
        label-width="140px"
      >
        <div
          class="space-y-4"
        >
          <el-card :header="$t('device.task.section.basic')" shadow="never" class="el-card--beautify">
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

            <el-form-item
              v-if="['copilot'].includes(model.taskType)"
              :label="$t('device.task.extra.copilot')"
              prop="extra"
            >
              <div class="w-full space-y-2">
                <PromptBar class="!p-0" show-prompt-manager @select-prompt="selectQuickPrompt" />
                <el-input
                  v-model="model.extra"
                  type="textarea"
                  :rows="4"
                  :placeholder="$t('copilot.welcome.description')"
                  :maxlength="2000"
                  show-word-limit
                />
              </div>
            </el-form-item>
          </el-card>

          <el-card :header="$t('device.task.section.frequency')" shadow="never" class="el-card--beautify">
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
          </el-card>

          <el-card :header="$t('device.task.section.devices')" shadow="never" class="el-card--beautify">
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
          </el-card>

          <el-alert
            :title="$t('device.task.tips')"
            type="warning"
            :closable="false"
            show-icon
            class="!mb-0"
          />
        </div>
      </el-form>
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
import { Cron } from 'croner'

import InputPath from '$/components/preference-form/components/input-path/index.vue'
import CronSelector from '$/components/cron-selector/index.vue'
import { PromptBar } from '$copilot/components/prompts/index.js'

import {
  timeUnit as intervalModel,
  timerType as timerModel,
} from '$/dicts/index.js'

import { sleep } from '$/utils'

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

/**
 * Form data model
 */
const model = ref({
  taskType: void 0, // Task type
  timerType: 'timeout', // Timer type: 'timeout' | 'interval' | 'cron'
  timeout: void 0, // Single execution time
  interval: void 0, // Interval value
  intervalType: 'second', // Interval unit
  cronExpression: '', // Cron expression
  extra: void 0, // Extra parameters (e.g., APK path, script path, Copilot instruction)
})

/**
 * Form validation rules
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

  // Dynamically add validation rules based on timer type
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

  // Add extra parameter validation according to task type
  if (['install', 'shell', 'copilot'].includes(model.value.taskType)) {
    baseRules.extra = [
      { required: true, message: window.t('common.required'), trigger: 'blur' },
    ]
  }

  return baseRules
})

// Watch timer type changes and clear related fields
watch(
  () => model.value.timerType,
  (newType) => {
    // Clear fields of other types when switching timer type
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
 * Validate Cron expression validity
 * Uses croner@9.1.0 for validation
 * @param {string} expression - Cron expression
 * @returns {boolean} True if valid
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
 * Opens the dialog
 * @param {Object} args - Argument object
 * @param {Array|Object} args.devices - Devices array or single device
 */
function open(args) {
  visible.value = true

  // Handle device parameters
  if (args.devices) {
    devices.value = args.devices
  }
  else if (args.device) {
    devices.value = [args.device]
  }

  // Set default time to current time
  defaultTime.value = new Date()
}

/**
 * Closes the dialog
 */
function close() {
  visible.value = false
}

/**
 * Submit form
 */
async function submit() {
  // Validate form
  try {
    await formRef.value.validate()
  }
  catch (error) {
    return error.message
  }

  // Additional validation for cron expression
  if (model.value.timerType === 'cron' && !cronValid.value) {
    ElMessage.warning(window.t('device.task.cron.invalid'))
    return
  }

  // Check devices
  if (!devices.value || devices.value.length === 0) {
    ElMessage.warning(window.t('device.task.noDeviceSelected'))
    return
  }

  loading.value = true

  try {
    // Build task data
    const taskData = {
      ...model.value,
      devices: devices.value,
    }

    // Add task to store
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
 * Dialog close callback
 */
async function onClosed() {
  devices.value = null
  formRef.value?.resetFields()
  formRef.value?.clearValidate()

  // Reset model
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
 * Disable dates (do not allow selecting past dates)
 */
function disabledDate(time) {
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

/**
 * Task type change callback
 */
async function onTaskChange() {
  model.value.extra = void 0
}

/**
 * Cron validity change callback
 */
function onCronValidChange(valid) {
  cronValid.value = valid
}

/**
 * Select quick prompt
 * @param {string} prompt - Quick prompt content
 */
function selectQuickPrompt(prompt) {
  model.value.extra = prompt
}

// Expose methods
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
