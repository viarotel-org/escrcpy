<template>
  <el-dialog
    v-model="visible"
    title="定时任务"
    width="60%"
    class="el-dialog-beautify"
    append-to-body
    destroy-on-close
    @closed="onClosed"
  >
    <ele-form-row
      ref="formRef"
      :model="model"
      :rules="rules"
      label-width="120px"
      class="!pr-[120px] !pt-4"
    >
      <ele-form-item-col label="任务类型" :span="24" prop="taskType">
        <el-select
          v-model="model.taskType"
          placeholder="请选择任务类型"
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
      <ele-form-item-col label="执行频率" :span="24" prop="timerType">
        <el-radio-group v-model="model.timerType">
          <el-radio
            v-for="(item, index) of timerModel"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </ele-form-item-col>

      <ele-form-item-col
        v-if="['timeout'].includes(model.timerType)"
        label="执行时间"
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
        label="重复规则"
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
              placeholder="请选择时间单位"
              filterable
              class="!w-24"
            >
              <el-option
                v-for="(item, index) of intervalModel"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-input>
      </ele-form-item-col>

      <ele-form-item-col
        v-if="['install'].includes(model.taskType)"
        label="选择应用"
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
        label="选择脚本"
        :span="24"
        prop="extra"
      >
        <InputPath
          v-model="model.extra"
          :placeholder="$t('device.control.shell.select')"
          :data="{
            properties: ['openFile'],
            filters: [
              {
                name: $t('device.control.shell.select'),
                extensions: ['sh'],
              },
            ],
          }"
        />
      </ele-form-item-col>
    </ele-form-row>

    <template #footer>
      <el-button @click="close">
        取消
      </el-button>
      <el-button :loading type="primary" @click="submit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'

import {
  timeUnit as intervalModel,
  timerType as timerModel,
} from '$/dicts/index.js'

import { useTaskStore } from '$/store/index.js'
import { sleep } from '$/utils'

import InputPath from '$/components/Preference/components/PreferenceForm/components/InputPath/index.vue'

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
    obj[item] = [{ required: true, message: '该选项不能为空', trigger: 'blur' }]

    if (item === 'timeout') {
      obj[item].push({
        trigger: 'blur',
        validator: (rule, value, callback) => {
          if (value.getTime() <= Date.now()) {
            callback(new Error('不能小于当前时间'))
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
