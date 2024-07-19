<template>
  <el-dialog
    v-model="visible"
    title="定时任务"
    width="60%"
    class="el-dialog-beautify"
    append-to-body
    @closed="onClosed"
  >
    <ele-form-row :model="model" label-width="120px" class="!pr-[120px] !pt-4">
      <ele-form-item-col label="任务类型" :span="24">
        <el-select v-model="model.taskType" placeholder="请选择任务类型">
          <el-option
            v-for="item in taskModel"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </ele-form-item-col>
      <ele-form-item-col label="定时器类型" :span="24">
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
    </ele-form-row>
    <template #footer>
      <el-button @click="close">
        取消
      </el-button>
      <el-button type="primary" @click="submit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
const visible = ref(false)

const model = ref({
  taskType: '',
  timerType: 'timeout',
})

const taskModel = [
  {
    label: 'device.control.install',
    value: 'install',
  },
  {
    label: 'device.control.capture',
    value: 'screenshot',
  },
  {
    label: 'device.control.shell.name',
    value: 'shell',
  },
]

const timerModel = [
  {
    label: '单次',
    value: 'timeout',
  },
  {
    label: '周期',
    value: 'interval',
  },
]

function open() {
  visible.value = true
}

function close() {
  visible.value = false
}

function submit() {}

function onClosed() {}

defineExpose({
  open,
  close,
})
</script>

<style></style>
