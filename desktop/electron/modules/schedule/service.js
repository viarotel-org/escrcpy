import { BrowserWindow, ipcMain } from 'electron'
import { Cron } from 'croner'

const cronInstances = new Map()
const senderScheduleIds = new Map()
const trackedSenderIds = new Set()

const ScheduleTimerType = {
  TIMEOUT: 'timeout',
  INTERVAL: 'interval',
  CRON: 'cron',
}

function convertScheduleToCronExpression(schedule) {
  if (schedule.timerType === ScheduleTimerType.CRON) {
    return schedule.cronExpression || null
  }

  if (schedule.timerType === ScheduleTimerType.TIMEOUT) {
    if (!schedule.timeout) {
      return null
    }

    const date = new Date(schedule.timeout)

    if (Number.isNaN(date.getTime()) || date.getTime() <= Date.now()) {
      return null
    }

    return `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`
  }

  if (schedule.timerType !== ScheduleTimerType.INTERVAL) {
    return null
  }

  const intervalValue = Number.parseInt(schedule.interval)

  if (!intervalValue || intervalValue <= 0) {
    return null
  }

  switch (schedule.intervalType) {
    case 'second':
      return `*/${intervalValue} * * * * *`
    case 'minute':
      return `*/${intervalValue} * * * *`
    case 'hour':
      return `0 */${intervalValue} * * *`
    case 'day':
      return `0 0 */${intervalValue} * *`
    case 'millisecond':
      return '* * * * * *'
    default:
      return `*/${intervalValue} * * * *`
  }
}

function stopCronJob(scheduleId) {
  const item = cronInstances.get(scheduleId)

  if (!item) {
    return { scheduleId, stopped: false }
  }

  item.cronJob.stop()
  cronInstances.delete(scheduleId)
  untrackSenderSchedule(item.senderId, scheduleId)
  return { scheduleId, stopped: true }
}

function trackSenderSchedule(senderId, scheduleId) {
  const scheduleIds = senderScheduleIds.get(senderId) || new Set()
  scheduleIds.add(scheduleId)
  senderScheduleIds.set(senderId, scheduleIds)
}

function untrackSenderSchedule(senderId, scheduleId) {
  const scheduleIds = senderScheduleIds.get(senderId)

  if (!scheduleIds) {
    return
  }

  scheduleIds.delete(scheduleId)

  if (scheduleIds.size === 0) {
    senderScheduleIds.delete(senderId)
  }
}

function stopCronJobsBySender(senderId) {
  const scheduleIds = Array.from(senderScheduleIds.get(senderId) || [])
  scheduleIds.forEach(scheduleId => stopCronJob(scheduleId))
  senderScheduleIds.delete(senderId)
}

function sendTick(senderId, scheduleId) {
  const win = BrowserWindow.getAllWindows().find((item) => {
    return item.webContents.id === senderId
  })

  if (!win || win.isDestroyed() || win.webContents.isDestroyed()) {
    stopCronJob(scheduleId)
    return false
  }

  win.webContents.send('schedule-timer-tick', scheduleId)
  return true
}

function startCronJob(sender, schedule) {
  stopCronJob(schedule.id)

  const cronExpression = convertScheduleToCronExpression(schedule)

  if (!cronExpression) {
    throw new Error('Failed to convert schedule to cron expression')
  }

  const senderId = sender.id
  const cronOptions = {
    legacyMode: false,
    protect: true,
  }

  if (schedule.timerType === ScheduleTimerType.TIMEOUT) {
    cronOptions.maxRuns = 1
  }

  const cronJob = new Cron(cronExpression, cronOptions, () => {
    sendTick(senderId, schedule.id)

    if (schedule.timerType === ScheduleTimerType.TIMEOUT) {
      stopCronJob(schedule.id)
    }
  })

  cronInstances.set(schedule.id, {
    cronJob,
    senderId,
  })
  trackSenderSchedule(senderId, schedule.id)

  if (!trackedSenderIds.has(senderId)) {
    trackedSenderIds.add(senderId)
    sender.once('destroyed', () => {
      stopCronJobsBySender(senderId)
      trackedSenderIds.delete(senderId)
    })
  }

  return {
    scheduleId: schedule.id,
    nextRun: cronJob.nextRun(),
  }
}

function listCronJobs() {
  return Array.from(cronInstances.entries()).map(([scheduleId, item]) => ({
    scheduleId,
    senderId: item.senderId,
    nextRun: item.cronJob.nextRun(),
  }))
}

function stopAllCronJobs() {
  const scheduleIds = Array.from(cronInstances.keys())
  scheduleIds.forEach(scheduleId => stopCronJob(scheduleId))
  return { stopped: scheduleIds.length }
}

export default {
  name: 'module:schedule:service',
  apply() {
    ipcMain.handle('schedule-timer-start', (event, schedule) => {
      return startCronJob(event.sender, schedule)
    })

    ipcMain.handle('schedule-timer-stop', (_, scheduleId) => {
      return stopCronJob(scheduleId)
    })

    ipcMain.handle('schedule-timer-list', () => {
      return listCronJobs()
    })

    ipcMain.handle('schedule-timer-stop-all', () => {
      return stopAllCronJobs()
    })

    return () => {
      cronInstances.forEach(item => item.cronJob.stop())
      cronInstances.clear()
      senderScheduleIds.clear()
      trackedSenderIds.clear()
      ipcMain.removeHandler('schedule-timer-start')
      ipcMain.removeHandler('schedule-timer-stop')
      ipcMain.removeHandler('schedule-timer-list')
      ipcMain.removeHandler('schedule-timer-stop-all')
    }
  },
}
