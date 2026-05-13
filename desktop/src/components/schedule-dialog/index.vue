<template>
  <el-dialog
    v-model="dialog.visible"
    :title="$t('device.schedule.name')"
    center
    class="el-dialog--beautify el-dialog--flex el-dialog--fullscreen"
    append-to-body
    fullscreen
    destroy-on-close
    @closed="onClosed"
  >
    <div class="h-full overflow-auto pr-2 -mr-2">
      <el-alert
        :title="$t('device.schedule.tips')"
        type="primary"
        show-icon
        class="!mb-4"
        :closable="isShowScheduleTips"
        @close="isShowScheduleTips = false"
      />

      <el-form
        :key="model.scheduleType"
        ref="formRef"
        :model="model"
        :rules="rules"
        label-width="140px"
      >
        <div
          class="space-y-4"
        >
          <el-card :header="$t('device.schedule.section.basic')" shadow="never" class="el-card--beautify">
            <el-form-item
              :label="$t('device.schedule.type')"
              prop="scheduleType"
            >
              <el-select
                v-model="model.scheduleType"
                :placeholder="$t('common.select.please')"
                clearable
                filterable
                class="w-full"
                @change="onScheduleChange"
              >
                <el-option
                  v-for="item in scheduleModel"
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
              v-if="['install'].includes(model.scheduleType)"
              :label="$t('device.schedule.extra.app')"
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
          </el-card>

          <el-card :header="$t('device.schedule.section.frequency')" shadow="never" class="el-card--beautify">
            <el-form-item
              :label="$t('device.schedule.frequency')"
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
              :label="$t('device.schedule.timeout')"
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
              :label="$t('device.schedule.interval')"
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
              :label="$t('device.schedule.cronExpression')"
              prop="cronExpression"
            >
              <CronSelector
                ref="cronSelectorRef"
                v-model="model.cronExpression"
                @valid-change="onCronValidChange"
              />
            </el-form-item>
          </el-card>

          <el-card :header="$t('device.schedule.section.devices')" shadow="never" class="el-card--beautify">
            <div class="devices-info p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="flex items-center gap-2 mb-3">
                <span class="text-gray-600 dark:text-gray-300">
                  {{ $t('device.schedule.selectedDevices') }}:
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
                {{ $t('device.schedule.noDeviceSelected') }}
              </div>
            </div>
          </el-card>
        </div>
      </el-form>
    </div>

    <template #footer>
      <div class="flex items-center">
        <div class="flex-none ml-auto">
          <el-button @click="close">
            {{ $t('common.cancel') }}
          </el-button>
          <el-button
            type="primary"
            :loading="dialog.loading"
            @click="submit"
          >
            <el-icon class="mr-1">
              <Check />
            </el-icon>
            {{ $t('common.confirm') }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { Cron } from 'croner'

import InputPath from '$/components/preference-form/components/input-path/index.vue'
import CronSelector from '$/components/cron-selector/index.vue'

import {
  timeUnit as intervalModel,
  timerType as timerModel,
} from '$/dicts/index.js'

import { sleep } from '$/utils'

const scheduleStore = useScheduleStore()
const deviceStore = useDeviceStore()
const isShowScheduleTips = useStorage('schedule.dialog.isShowTips', true)

const dialog = useDialog()

const formRef = ref(null)
const cronSelectorRef = ref(null)

const devices = ref(null)

const defaultTime = ref(null)

const cronValid = ref(true)

const scheduleModel = computed(() => scheduleStore.model)

const model = ref({
  scheduleType: void 0,
  timerType: 'timeout',
  timeout: void 0,
  interval: void 0,
  intervalType: 'second',
  cronExpression: '',
  extra: void 0,
  automationConfig: null,
})

const rules = computed(() => {
  const baseRules = {
    scheduleType: [
      { required: true, message: window.t('common.required'), trigger: 'change' },
    ],
    timerType: [
      { required: true, message: window.t('common.required'), trigger: 'change' },
    ],
  }

  if (model.value.timerType === 'timeout') {
    baseRules.timeout = [
      { required: true, message: window.t('common.required'), trigger: 'change' },
      {
        trigger: 'change',
        validator: (rule, value, callback) => {
          if (value && value.getTime() <= Date.now()) {
            callback(new Error(window.t('device.schedule.timeout.tips')))
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
            callback(new Error(window.t('device.schedule.interval.invalid')))
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
            callback(new Error(window.t('device.schedule.cron.invalid')))
          }
          else {
            callback()
          }
        },
      },
    ]
  }

  if (['install'].includes(model.value.scheduleType)) {
    baseRules.extra = [
      { required: true, message: window.t('common.required'), trigger: 'blur' },
    ]
  }

  if (model.value.scheduleType === 'automation') {
    baseRules.automationConfig = [
      {
        required: true,
        trigger: 'change',
        validator: (rule, value, callback) => {
          if (!value?.scriptId) {
            callback(new Error(window.t('common.required')))
          }
          else {
            callback()
          }
        },
      },
    ]
  }

  return baseRules
})

watch(
  () => model.value.timerType,
  (newType) => {
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

function open(args) {
  dialog.open(args)

  if (args.devices) {
    devices.value = args.devices
  }
  else if (args.device) {
    devices.value = [args.device]
  }

  defaultTime.value = new Date()
}

function close() {
  dialog.close()
}

async function submit() {
  try {
    await formRef.value.validate()
  }
  catch (error) {
    return error.message
  }

  if (model.value.timerType === 'cron' && !cronValid.value) {
    ElMessage.warning(window.t('device.schedule.cron.invalid'))
    return
  }

  if (!devices.value || devices.value.length === 0) {
    ElMessage.warning(window.t('device.schedule.noDeviceSelected'))
    return
  }

  dialog.loading = true

  try {
    const scheduleData = {
      ...model.value,
      devices: devices.value,
    }

    if (model.value.scheduleType === 'automation' && model.value.automationConfig) {
      scheduleData.extra = JSON.stringify(model.value.automationConfig)
    }

    await scheduleStore.add(scheduleData)
    await sleep()
    await ElMessage.success(window.t('common.success'))

    close()
  }
  catch (error) {
    console.error('Failed to add schedule:', error)
    ElMessage.error(error.message || window.t('common.failed'))
  }
  finally {
    dialog.loading = false
  }
}

async function onClosed() {
  devices.value = null
  formRef.value?.resetFields()
  formRef.value?.clearValidate()

  model.value = {
    scheduleType: void 0,
    timerType: 'timeout',
    timeout: void 0,
    interval: void 0,
    intervalType: 'second',
    cronExpression: '',
    extra: void 0,
    automationConfig: null,
  }

  dialog.options?.onClosed?.()
}

function disabledDate(time) {
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

async function onScheduleChange(val) {
  model.value.extra = void 0
  model.value.automationConfig = null
}

function onCronValidChange(valid) {
  cronValid.value = valid
}

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
