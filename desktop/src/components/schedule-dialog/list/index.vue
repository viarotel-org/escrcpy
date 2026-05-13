<template>
  <el-dialog
    v-model="dialog.visible"
    :title="$t('device.schedule.list')"
    class="el-dialog--beautify el-dialog--flex el-dialog--fullscreen el-dialog--schedules"
    append-to-body
    fullscreen
    destroy-on-close
    @closed="onClosed"
    @opened="() => teleportVisible = true"
    @close="() => teleportVisible = false"
  >
    <Teleport to=".app-header" :disabled="!teleportVisible">
      <div class="flex items-center justify-center absolute top-4 z-9999 left-center app-region-no-drag">
        <el-radio-group
          v-model="scheduleGroup"
          size="small"
          @change="onScheduleGroupChange"
        >
          <el-radio-button value="active" :label="$t('common.progress')" />
          <el-radio-button value="history" :label="$t('common.finished')" />
        </el-radio-group>
      </div>
    </Teleport>

    <div v-loading="dialog.loading" class="h-full">
      <el-table :data="tableData" class="el-table--beautify" stripe height="100%">
        <template #empty>
          <el-empty></el-empty>
        </template>

        <el-table-column
          v-slot="{ row }"
          prop="scheduleType"
          :label="$t('device.schedule.type')"
          align="center"
        >
          <div class="h-full flex items-center justify-center">
            <el-popover v-if="getScheduleExtra(row)" :key="row.id" width="50%" trigger="click" :disabled="!getScheduleExtra(row)">
              <template #reference>
                <el-button
                  type="primary"
                  link
                >
                  {{ $t(getDictLabel(scheduleModel, row.scheduleType)) }}
                </el-button>
              </template>

              <div class="max-h-64 overflow-auto">
                <el-text>{{ getScheduleExtra(row) }}</el-text>
              </div>
            </el-popover>

            <span v-else>
              {{ $t(getDictLabel(scheduleModel, row.scheduleType)) }}
            </span>
          </div>
        </el-table-column>

        <el-table-column
          v-slot="{ row }"
          prop="timerType"
          :label="$t('device.schedule.frequency')"
          align="center"
        >
          {{ $t(getDictLabel('timerType', row.timerType)) }}
        </el-table-column>

        <el-table-column
          v-slot="{ row }"
          prop="status"
          :label="$t('common.status')"
          align="center"
        >
          <el-tag :type="getStatusType(row)" effect="light">
            {{ getStatusLabel(row) }}
          </el-tag>
        </el-table-column>

        <el-table-column
          v-slot="{ row }"
          :label="$t('device.schedule.timeout')"
          align="center"
          min-width="150"
        >
          <template v-if="['cron'].includes(row.timerType)">
            <el-tooltip :content="row.cronExpression" placement="top">
              <span class="text-primary cursor-help">{{ getNextCronExecution(row) }}</span>
            </el-tooltip>
          </template>
          <template v-else>
            {{ getScheduledTime(row) }}
          </template>
        </el-table-column>

        <el-table-column
          v-slot="{ row }"
          :label="$t('device.schedule.interval')"
          align="center"
        >
          <span v-if="['timeout'].includes(row.timerType)" class="">
            {{ $t('device.schedule.noRepeat') }}
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
          :label="$t('device.schedule.devices')"
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
          :label="$t('common.actions')"
          align="center"
        >
          <ExTooltipButton
            v-if="isActive(row)"
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
            v-if="!isActive(row)"
            placement="top"
            :offset="2"
            text
            type="primary"
            effect="light"
            :content="$t('device.schedule.restart')"
            icon="RefreshLeft"
            circle
            :disabled="!canRestart(row)"
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
import { ScheduleStatus, ScheduleStatusGroups } from '$/store/schedule/index.js'

import { sleep } from '$/utils'

import dayjs from 'dayjs'
import { Cron } from 'croner'

const scheduleStore = useScheduleStore()

const deviceStore = useDeviceStore()

const dialog = useDialog()

const scheduleModel = computed(() => scheduleStore.model)

const scheduleGroup = ref('active')

const teleportVisible = ref(false)

const tableData = computed(() => {
  const statuses = scheduleGroup.value === 'active'
    ? ScheduleStatusGroups.ACTIVE
    : ScheduleStatusGroups.HISTORY

  return scheduleStore.list.filter(item => statuses.includes(getStatus(item)))
})

async function open(args) {
  dialog.open(args)
}

function close() {
  dialog.close()
}

async function onClosed() {
  scheduleGroup.value = 'active'
  dialog.options?.onClosed?.()
}

async function onScheduleGroupChange() {
  dialog.loading = true

  await sleep()

  dialog.loading = false
}

async function handleStop(row) {
  await scheduleStore.stop(row)
}

async function handleReStart(row) {
  scheduleGroup.value = 'active'
  await scheduleStore.restart(row)
}

async function handleRemove(row) {
  await scheduleStore.remove(row)
}

/**
 * Get the next execution time for a Cron schedule
 * @param {Object} row - Schedule object
 * @returns {string} Formatted next execution time
 */
function getNextCronExecution(row) {
  if (row.nextRunAt) {
    return dayjs(row.nextRunAt).format('YYYY-MM-DD HH:mm:ss')
  }

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

function canRestart(row) {
  if (getStatus(row) === ScheduleStatus.EXPIRED) {
    return false
  }

  if (!row?.scheduledAt || ['interval', 'cron'].includes(row.timerType)) {
    return true
  }

  return dayjs(row.scheduledAt).unix() > dayjs().unix()
}

function getStatus(row) {
  return row.status
}

function isActive(row) {
  return ScheduleStatusGroups.ACTIVE.includes(getStatus(row))
}

function getScheduleExtra(row) {
  return row?.payload?.extra ?? row?.extra ?? ''
}

function getScheduledTime(row) {
  const time = row.scheduledAt || row.timeout
  return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-'
}

function getStatusLabel(row) {
  const status = getStatus(row)
  const labelMap = {
    [ScheduleStatus.PENDING]: window.t('common.progress'),
    [ScheduleStatus.SCHEDULED]: window.t('common.progress'),
    [ScheduleStatus.RUNNING]: window.t('common.progress'),
    [ScheduleStatus.COMPLETED]: window.t('common.finished'),
    [ScheduleStatus.FAILED]: window.t('common.failed'),
    [ScheduleStatus.CANCELLED]: window.t('common.cancelled'),
    [ScheduleStatus.EXPIRED]: window.t('device.schedule.timeout.expired'),
  }

  return labelMap[status] || status || '-'
}

function getStatusType(row) {
  const status = getStatus(row)
  const typeMap = {
    [ScheduleStatus.PENDING]: 'info',
    [ScheduleStatus.SCHEDULED]: 'primary',
    [ScheduleStatus.RUNNING]: 'warning',
    [ScheduleStatus.COMPLETED]: 'success',
    [ScheduleStatus.FAILED]: 'danger',
    [ScheduleStatus.CANCELLED]: 'info',
    [ScheduleStatus.EXPIRED]: 'danger',
  }

  return typeMap[status] || 'info'
}

defineExpose({
  open,
  close,
})
</script>

<style lang="postcss">
.el-dialog--schedules {
  .el-dialog__header {
    .el-dialog__title {
      @apply !invisible;
    }
  }
}
</style>
