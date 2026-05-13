import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { Cron } from 'croner'
import { liveQuery } from 'dexie'
import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'
import { scheduleStore as scheduleDataStore, ScheduleStatus } from '$/database/index.js'
import { db } from '$/database/core/database.js'
import { clonePlainValue } from '$/utils/index.js'

dayjs.extend(duration)

export { ScheduleStatus }

export const ScheduleStatusGroups = {
  ACTIVE: [ScheduleStatus.PENDING, ScheduleStatus.SCHEDULED, ScheduleStatus.RUNNING],
  HISTORY: [ScheduleStatus.COMPLETED, ScheduleStatus.FAILED, ScheduleStatus.CANCELLED, ScheduleStatus.EXPIRED],
}

export const ScheduleTimerType = {
  TIMEOUT: 'timeout',
  INTERVAL: 'interval',
  CRON: 'cron',
}

function getDeviceId(device) {
  return typeof device === 'string' ? device : device?.id
}

function getScheduleExtra(schedule) {
  return schedule?.payload?.extra ?? schedule?.extra ?? ''
}

function getScheduledAt(form) {
  if (form.scheduledAt) {
    return Number(form.scheduledAt)
  }

  if (form.timerType === ScheduleTimerType.TIMEOUT) {
    const date = new Date(form.timeout)
    return Number.isNaN(date.getTime()) ? null : date.getTime()
  }

  if (form.timerType === ScheduleTimerType.INTERVAL) {
    return Date.now() + dayjs.duration(form.interval, form.intervalType).asMilliseconds()
  }

  if (form.timerType === ScheduleTimerType.CRON && form.cronExpression) {
    try {
      return new Cron(form.cronExpression, { legacyMode: false }).nextRun()?.getTime() || null
    }
    catch {
      return null
    }
  }

  return null
}

function isTimeoutExpired(schedule) {
  return schedule?.timerType === ScheduleTimerType.TIMEOUT && Number(schedule.scheduledAt || 0) <= Date.now()
}

function getNextRetryAt() {
  return Date.now() + 1000
}

function normalizeScheduleForTimer(schedule) {
  return {
    ...schedule,
    timeout: schedule.timerType === ScheduleTimerType.TIMEOUT ? schedule.scheduledAt : schedule.timeout,
  }
}

export const useScheduleStore = defineStore('app-schedule', () => {
  const model = ref([
    {
      label: 'device.control.install',
      value: 'install',
    },
    {
      label: 'device.control.capture',
      value: 'screenshot',
    },
    {
      label: 'device.mirror.start',
      value: 'mirror',
    },
  ])

  const list = shallowRef([])
  const loading = ref(false)
  const initialized = ref(false)
  const recovering = ref(false)

  const scheduleListeners = new Map()
  const timerHandlers = new Map()
  const timerRunningScheduleIds = new Set()

  let subscription = null
  let recoveryPrepared = false

  subscribeSchedules()

  window.$preload.ipcRenderer?.on?.('schedule-timer-tick', handleTimerTick)

  function subscribeSchedules() {
    subscription?.unsubscribe?.()

    subscription = liveQuery(async () => {
      const records = await db.schedules.toArray()
      return records.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0))
    }).subscribe({
      next(value) {
        list.value = value || []
        initialized.value = true
      },
      error(error) {
        console.error('[ScheduleStore] Failed to subscribe schedules:', error)
        initialized.value = true
      },
    })
  }

  function registerScheduleType(scheduleType) {
    const exists = model.value.some(item => item.value === scheduleType.value)
    if (!exists) {
      model.value.push(scheduleType)
    }
  }

  function buildSchedule(form) {
    const now = Date.now()
    const scheduledAt = getScheduledAt(form)
    const devices = form.devices || []
    const deviceIds = devices.map(getDeviceId).filter(Boolean)
    const extra = form.scheduleType === 'automation' && form.automationConfig
      ? JSON.stringify(form.automationConfig)
      : form.extra

    return {
      id: form.id || nanoid(),
      title: form.title || form.scheduleType,
      scheduleType: form.scheduleType,
      timerType: form.timerType,
      timeout: form.timeout,
      interval: form.interval ? Number(form.interval) : void 0,
      intervalType: form.intervalType,
      cronExpression: form.cronExpression || '',
      devices,
      deviceIds,
      payload: {
        extra,
        automationConfig: form.automationConfig || null,
      },
      extra,
      automationConfig: form.automationConfig || null,
      status: ScheduleStatus.PENDING,
      enabled: true,
      scheduledAt,
      nextRunAt: scheduledAt,
      retryCount: 0,
      maxRetries: Number(form.maxRetries ?? 3),
      runCount: 0,
      createdAt: now,
      updatedAt: now,
      schemaVersion: 1,
    }
  }

  async function add(form) {
    const schedule = buildSchedule(form)
    const result = await scheduleDataStore.createSchedule(clonePlainValue(schedule))

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to create schedule')
    }

    dispatchSchedule(result.data)
    return result.data
  }

  function getTimeout(schedule) {
    if (schedule.timerType === ScheduleTimerType.TIMEOUT) {
      return dayjs(schedule.scheduledAt || schedule.timeout).diff(dayjs())
    }

    if (schedule.timerType === ScheduleTimerType.INTERVAL) {
      return dayjs.duration(schedule.interval, schedule.intervalType).asMilliseconds()
    }

    return 0
  }

  async function start({ schedule, handler }) {
    if (!schedule || !handler || schedule.enabled === false) {
      return false
    }

    if (isTimeoutExpired(schedule)) {
      await scheduleDataStore.markExpired(schedule.id)
      ElMessage.warning(window.t('device.schedule.timeout.expired'))
      return false
    }

    const { id } = schedule

    await stopScheduleTimer(id)

    timerHandlers.set(id, {
      schedule,
      handler,
    })

    try {
      const result = await window.$preload.ipcRenderer.invoke('schedule-timer-start', {
        ...normalizeScheduleForTimer(schedule),
      })

      await scheduleDataStore.updateStatus(id, ScheduleStatus.SCHEDULED, {
        enabled: true,
        nextRunAt: result?.nextRun ? new Date(result.nextRun).getTime() : schedule.nextRunAt,
        lastError: void 0,
      })

      return true
    }
    catch (error) {
      timerHandlers.delete(id)
      timerRunningScheduleIds.delete(id)

      await scheduleDataStore.updateStatus(id, ScheduleStatus.FAILED, {
        enabled: false,
        failedAt: Date.now(),
        lastError: error?.message || String(error),
      })

      console.error('Failed to start schedule timer in main process:', error)
      ElMessage.error(window.t('device.schedule.start.failed'))
      return false
    }
  }

  async function stopScheduleTimer(scheduleId) {
    timerHandlers.delete(scheduleId)
    timerRunningScheduleIds.delete(scheduleId)

    try {
      await window.$preload.ipcRenderer.invoke('schedule-timer-stop', scheduleId)
      return true
    }
    catch (error) {
      console.warn('Failed to stop schedule timer in main process:', error)
      return false
    }
  }

  async function handleTimerTick(_, scheduleId) {
    const item = timerHandlers.get(scheduleId)

    if (!item || timerRunningScheduleIds.has(scheduleId)) {
      return false
    }

    const latest = await db.schedules.get(scheduleId)
    const schedule = latest || item.schedule

    if (!schedule || schedule.enabled === false) {
      await stopScheduleTimer(scheduleId)
      return false
    }

    const { handler } = item
    const extra = getScheduleExtra(schedule)
    const files = extra ? String(extra).split(',') : void 0

    timerRunningScheduleIds.add(scheduleId)

    await scheduleDataStore.updateStatus(scheduleId, ScheduleStatus.RUNNING, {
      startedAt: Date.now(),
      lastRunAt: Date.now(),
      runCount: Number(schedule.runCount || 0) + 1,
    })

    try {
      await handler(schedule.devices || [], {
        files,
        extra,
        payload: schedule.payload || {},
        scheduleId,
        scheduleType: schedule.scheduleType,
      })

      if (schedule.timerType === ScheduleTimerType.TIMEOUT) {
        await complete(schedule)
      }
      else {
        await scheduleDataStore.updateStatus(scheduleId, ScheduleStatus.SCHEDULED, {
          lastError: void 0,
        })
      }
    }
    catch (error) {
      await handleScheduleFailure(schedule, error)
    }
    finally {
      timerRunningScheduleIds.delete(scheduleId)
    }

    return true
  }

  async function handleScheduleFailure(schedule, error) {
    const retryCount = Number(schedule.retryCount || 0) + 1
    const maxRetries = Number(schedule.maxRetries || 0)
    const canRetry = schedule.enabled !== false && retryCount <= maxRetries
    const lastError = error?.message || String(error)

    console.error('Failed to execute schedule timer:', error)

    if (canRetry && schedule.timerType === ScheduleTimerType.TIMEOUT) {
      const scheduledAt = getNextRetryAt()
      const result = await scheduleDataStore.updateStatus(schedule.id, ScheduleStatus.PENDING, {
        retryCount,
        failedAt: Date.now(),
        lastError,
        scheduledAt,
        nextRunAt: scheduledAt,
      })

      if (result.success) {
        dispatchSchedule(result.data)
      }
      return
    }

    await scheduleDataStore.updateStatus(schedule.id, canRetry ? ScheduleStatus.SCHEDULED : ScheduleStatus.FAILED, {
      enabled: canRetry,
      retryCount,
      failedAt: Date.now(),
      lastError,
    })

    if (!canRetry) {
      await stopScheduleTimer(schedule.id)
    }
  }

  async function complete(schedule) {
    await stopScheduleTimer(schedule.id)
    return scheduleDataStore.updateStatus(schedule.id, ScheduleStatus.COMPLETED, {
      enabled: false,
      completedAt: Date.now(),
      lastError: void 0,
    })
  }

  async function stop(schedule) {
    if (!schedule) {
      return false
    }

    await stopScheduleTimer(schedule.id)
    await scheduleDataStore.updateStatus(schedule.id, ScheduleStatus.CANCELLED, {
      enabled: false,
      cancelledAt: Date.now(),
    })

    return true
  }

  async function restart(schedule) {
    if (!schedule) {
      return false
    }

    if (isTimeoutExpired(schedule)) {
      ElMessage.warning(window.t('device.schedule.timeout.expired'))
      return false
    }

    const result = await scheduleDataStore.updateStatus(schedule.id, ScheduleStatus.PENDING, {
      enabled: true,
      retryCount: 0,
      lastError: void 0,
      completedAt: void 0,
      failedAt: void 0,
      cancelledAt: void 0,
      expiredAt: void 0,
    })

    if (result.success) {
      return dispatchSchedule(result.data)
    }

    return false
  }

  async function remove(schedule) {
    if (!schedule) {
      return false
    }

    await stopScheduleTimer(schedule.id)
    const result = await scheduleDataStore.deleteById(schedule.id)
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to remove schedule')
    }
    return true
  }

  async function removeAll(schedules) {
    for (const item of schedules) {
      await remove(item)
    }
  }

  function dispatchSchedule(schedule) {
    const listener = scheduleListeners.get(schedule.scheduleType)
    if (!listener) {
      return false
    }

    listener(schedule)
    return true
  }

  function on(name, callback) {
    scheduleListeners.set(name, callback)
    recoverSchedules({ scheduleType: name })

    return {
      off() {
        if (scheduleListeners.get(name) === callback) {
          scheduleListeners.delete(name)
        }
      },
    }
  }

  function emit(name, args) {
    return dispatchSchedule({ scheduleType: name, ...args })
  }

  async function prepareRecovery() {
    if (recoveryPrepared) {
      return
    }

    recoveryPrepared = true
    await scheduleDataStore.markInterruptedRunning()
  }

  async function recoverSchedules(options = {}) {
    recovering.value = true

    try {
      await prepareRecovery()

      const result = await scheduleDataStore.listRecoverable()
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to load recoverable schedules')
      }

      const schedules = result.data.filter((schedule) => {
        if (options.scheduleType && schedule.scheduleType !== options.scheduleType) {
          return false
        }

        return schedule.enabled !== false
      })

      for (const schedule of schedules) {
        if (isTimeoutExpired(schedule)) {
          await scheduleDataStore.markExpired(schedule.id)
          continue
        }

        if (schedule.status === ScheduleStatus.FAILED && Number(schedule.retryCount || 0) >= Number(schedule.maxRetries || 0)) {
          continue
        }

        dispatchSchedule(schedule)
      }

      return true
    }
    catch (error) {
      console.error('[ScheduleStore] Failed to recover schedules:', error)
      return false
    }
    finally {
      recovering.value = false
    }
  }

  return {
    emit,
    getTimeout,
    initialized,
    list,
    loading,
    model,
    on,
    recoverSchedules,
    registerScheduleType,
    remove,
    removeAll,
    restart,
    add,
    start,
    stop,
    ScheduleStatus,
    ScheduleStatusGroups,
    ScheduleTimerType,
  }
})
