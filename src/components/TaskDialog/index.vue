<template>
  <el-dialog
    v-model="visible"
    :title="$t('device.task.name')"
    width="70%"
    class="el-dialog--beautify"
    append-to-body
    destroy-on-close
    @closed="onClosed"
  >
    <div class="pr-12 pt-4">
      <ele-form-row
        ref="formRef"
        :model="model"
        :rules="rules"
        label-width="120px"
        class=""
      >
        <ele-form-item-col
          :label="$t('device.task.type')"
          :span="24"
          prop="taskType"
        >
          <el-select
            v-model="model.taskType"
            :placeholder="$t('common.select.please')"
            clearable
            filterable
            @change="onTaskChange"
          >
            <el-option
              v-for="item in taskModel"
              :key="item.value"
              :label="$t(item.label)"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </ele-form-item-col>
        <ele-form-item-col
          :label="$t('device.task.frequency')"
          :span="24"
          prop="timerType"
        >
          <el-radio-group v-model="model.timerType">
            <el-radio
              v-for="(item, index) of timerModel"
              :key="index"
              :value="item.value"
            >
              {{ $t(item.label) }}
            </el-radio>
          </el-radio-group>
        </ele-form-item-col>

        <ele-form-item-col
          v-if="['timeout'].includes(model.timerType)"
          :label="$t('device.task.timeout')"
          :span="24"
          prop="timeout"
        >
          <el-date-picker
            v-model="model.timeout"
            type="datetime"
            placeholder="0000-00-00 00:00:00"
            clearable
            v-bind="{ disabledDate, defaultTime }"
          ></el-date-picker>
        </ele-form-item-col>

        <ele-form-item-col
          v-if="['interval'].includes(model.timerType)"
          :label="$t('device.task.interval')"
          :span="24"
          prop="interval"
        >
          <el-input
            v-model="model.interval"
            type="number"
            placeholder="0"
            clearable
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
        </ele-form-item-col>

        <ele-form-item-col
          v-if="['install'].includes(model.taskType)"
          :label="$t('device.task.extra.app')"
          :span="24"
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
        </ele-form-item-col>

        <ele-form-item-col
          v-if="['shell'].includes(model.taskType)"
          :label="$t('device.task.extra.shell')"
          :span="24"
          prop="extra"
        >
          <InputPath
            v-model="model.extra"
            :placeholder="$t('device.control.terminal.script.select')"
            :data="{
              properties: ['openFile'],
              filters: [
                {
                  name: $t('device.control.terminal.script.select'),
                  extensions: ['sh'],
                },
              ],
            }"
          />
        </ele-form-item-col>

        <ele-form-item-col :span="24" label="">
          <div
            class="text-red-200 dark:text-red-900 !hover:text-red-500 transition-colors"
          >
            {{ $t('device.task.tips') }}
          </div>
        </ele-form-item-col>
      </ele-form-row>
    </div>

    <template #footer>
      <el-button @click="close">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button :loading type="primary" @click="submit">
        {{ $t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import InputPath from '$/components/PreferenceForm/components/InputPath/index.vue'

import {
  timeUnit as intervalModel,
  timerType as timerModel,
} from '$/dicts/index.js'

import { sleep } from '$/utils'

const taskStore = useTaskStore()

const visible = ref(false)

const loading = ref(false)

const model = ref({
  taskType: void 0,
  timerType: 'timeout',
  timeout: void 0,
  interval: void 0,
  intervalType: 'second',
  extra: void 0,
})

const rules = computed(() =>
  Object.keys(model.value).reduce((obj, item) => {
    obj[item] = [
      { required: true, message: window.t('common.required'), trigger: 'blur' },
    ]

    if (item === 'timeout') {
      obj[item].push({
        trigger: 'blur',
        validator: (rule, value, callback) => {
          if (value.getTime() <= Date.now()) {
            callback(new Error(window.t('device.task.timeout.tips')))
          }
          else {
            callback()
          }
        },
      })
    }

    return obj
  }, {}),
)

const formRef = ref(null)

const taskModel = computed(() => taskStore.model)

const devices = ref(null)

const defaultTime = ref(null)

function open(args) {
  visible.value = true

  if (args.devices) {
    devices.value = args.devices
  }
  else if (args.device) {
    devices.value = [args.device]
  }

  defaultTime.value = new Date()
}

function close() {
  visible.value = false
}

async function submit() {
  try {
    await formRef.value.validate()
  }
  catch (error) {
    return error.message
  }

  loading.value = true

  await taskStore.add({ ...model.value, devices: devices.value })
  await sleep()
  await ElMessage.success(window.t('common.success'))

  loading.value = false

  close()
}

async function onClosed() {
  devices.value = null
  formRef.value.resetFields()
  formRef.value.clearValidate()
}

function disabledDate(time) {
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

function onTaskChange() {
  model.value.extra = void 0
}

defineExpose({
  open,
  close,
})
</script>

<style></style>
