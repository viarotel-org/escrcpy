<template>
  <el-dialog
    v-model="visible"
    :title="$t('device.task.list')"
    class="el-dialog--beautify el-dialog--flex el-dialog--fullscreen el-dialog--tasks"
    append-to-body
    fullscreen
    destroy-on-close
    @closed="onClosed"
  >
    <div class="flex items-center justify-center absolute top-4 left-center">
      <el-radio-group
        v-model="taskStatus"
        @change="onTaskStatusChange"
      >
        <el-radio-button value="progress" :label="$t('common.progress')" />
        <el-radio-button value="finished" :label="$t('common.finished')" />
      </el-radio-group>
    </div>

    <div v-loading="loading" class="h-full">
      <el-table :data="tableData" stripe height="100%">
        <template #empty>
          <el-empty></el-empty>
        </template>

        <el-table-column
          v-slot="{ row }"
          prop="taskType"
          :label="$t('device.task.type')"
          align="center"
        >
          <div class="h-full flex items-center justify-center">
            <el-dropdown :key="row.id" trigger="hover" :disabled="!row.extra">
              <span
                :class="
                  row.extra
                    ? 'text-primary hover:underline'
                    : 'text-[var(--el-table-text-color)]'
                "
              >
                {{ $t(getDictLabel(taskModel, row.taskType)) }}
              </span>

              <template v-if="row.extra" #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(item, index) of row.extra.split(',')"
                    :key="index"
                  >
                    {{ item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-table-column>

        <el-table-column
          v-slot="{ row }"
          prop="timerType"
          :label="$t('device.task.frequency')"
          align="center"
        >
          {{ $t(getDictLabel('timerType', row.timerType)) }}
        </el-table-column>

        <el-table-column
          v-slot="{ row }"
          :label="$t('device.task.timeout')"
          align="center"
          min-width="150"
        >
          <template v-if="['cron'].includes(row.timerType)">
            <el-tooltip :content="row.cronExpression" placement="top">
              <span class="text-primary cursor-help">{{ getNextCronExecution(row) }}</span>
            </el-tooltip>
          </template>
          <template v-else>
            {{ row.formatTimeout }}
          </template>
        </el-table-column>

        <el-table-column
          v-slot="{ row }"
          :label="$t('device.task.interval')"
          align="center"
        >
          <span v-if="['timeout'].includes(row.timerType)" class="">
            {{ $t('device.task.noRepeat') }}
          </span>
          <span v-if="['interval'].includes(row.timerType)" class="">
            {{ row.interval }}
            {{ $t(getDictLabel('timeUnit', row.intervalType)) }}
          </span>
          <span v-if="['cron'].includes(row.timerType)" class="text-primary">
            <el-tooltip :content="row.cronExpression" placement="top">
              <span class="cursor-help">Cron</span>
            </el-tooltip>
          </span>
        </el-table-column>

        <el-table-column
          v-slot="{ row }"
          prop="devices"
          :label="$t('device.task.devices')"
          align="center"
          min-width="150"
          show-overflow-tooltip
        >
          <ExTagCollapse
            effect="light"
            :value="row.devices"
            :label="(item) => deviceStore.getLabel(item, 'name')"
            class="justify-center"
          />
        </el-table-column>

        <el-table-column
          v-slot="{ row }"
          :label="$t('device.control.name')"
          align="center"
        >
          <ExTooltipButton
            v-if="['progress'].includes(taskStatus)"
            placement="top"
            :offset="2"
            text
            type="warning"
            effect="light"
            :content="$t('common.stop')"
            icon="CircleClose"
            circle
            @click="handleStop(row)"
          >
          </ExTooltipButton>

          <ExTooltipButton
            v-if="['finished'].includes(taskStatus)"
            placement="top"
            :offset="2"
            text
            type="primary"
            effect="light"
            :content="$t('device.task.restart')"
            icon="RefreshLeft"
            circle
            :disabled="!checkExpired(row)"
            @click="handleReStart(row)"
          >
          </ExTooltipButton>

          <ExTooltipButton
            placement="top"
            :offset="2"
            text
            type="danger"
            effect="light"
            :content="$t('common.remove')"
            icon="Remove"
            circle
            @click="handleRemove(row)"
          >
          </ExTooltipButton>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script setup>
import { getDictLabel } from '$/dicts/helper'

import { sleep } from '$/utils'

import dayjs from 'dayjs'
import { Cron } from 'croner'

const taskStore = useTaskStore()

const deviceStore = useDeviceStore()

const visible = ref(false)

const loading = ref(false)

const taskModel = computed(() => taskStore.model)

const taskStatus = ref('progress')

const tableData = computed(() => {
  const value = taskStore.list.filter(
    item => item.taskStatus === taskStatus.value,
  )

  return value
})

async function open(args) {
  visible.value = true
}

function close() {
  visible.value = false
}

async function onClosed() {
  taskStatus.value = 'progress'
}

async function onTaskStatusChange() {
  loading.value = true

  await sleep()

  loading.value = false
}

function handleStop(row) {
  taskStore.stop(row)
}

function handleReStart(row) {
  taskStatus.value = 'progress'
  taskStore.restart(row)
}

function handleRemove(row) {
  taskStore.remove(row)
}

/**
 * Get the next execution time for a Cron task
 * @param {Object} row - Task object
 * @returns {string} Formatted next execution time
 */
function getNextCronExecution(row) {
  if (!row.cronExpression) {
    return '-'
  }
  try {
    const cron = new Cron(row.cronExpression, { legacyMode: false })
    const nextRun = cron.nextRun()
    if (nextRun) {
      return dayjs(nextRun).format('YYYY-MM-DD HH:mm:ss')
    }
  }
  catch {
    return '-'
  }
  return '-'
}

function checkExpired(row) {
  if (!row?.formatTimeout || ['interval', 'cron'].includes(row.timerType)) {
    return true
  }

  return dayjs(row.formatTimeout).unix() > dayjs().unix()
}

defineExpose({
  open,
  close,
})
</script>

<style lang="postcss">
.el-dialog--tasks {
  .el-dialog__header {
    .el-dialog__title {
      @apply !invisible;
    }
  }
}
</style>
