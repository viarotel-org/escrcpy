/**
 * Schedule store - manages persisted schedule records.
 *
 * @module storage/modules/schedule
 */

import { BaseStore } from '$/database/core/BaseStore.js'
import { db } from '$/database/core/database.js'
import { FieldTypes } from '$/database/utils/validation.js'

export const ScheduleStatus = {
  PENDING: 'pending',
  SCHEDULED: 'scheduled',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
}

export const ActiveScheduleStatuses = [
  ScheduleStatus.PENDING,
  ScheduleStatus.SCHEDULED,
  ScheduleStatus.RUNNING,
]

export const RecoverableScheduleStatuses = [
  ScheduleStatus.PENDING,
  ScheduleStatus.SCHEDULED,
  ScheduleStatus.RUNNING,
  ScheduleStatus.FAILED,
]

export const TerminalScheduleStatuses = [
  ScheduleStatus.COMPLETED,
  ScheduleStatus.FAILED,
  ScheduleStatus.CANCELLED,
  ScheduleStatus.EXPIRED,
]

const scheduleSchema = {
  id: {
    type: FieldTypes.STRING,
    required: true,
  },
  scheduleType: {
    type: FieldTypes.STRING,
    required: true,
  },
  timerType: {
    type: FieldTypes.STRING,
    required: true,
  },
  status: {
    type: FieldTypes.STRING,
    required: true,
    enum: Object.values(ScheduleStatus),
  },
  enabled: {
    type: FieldTypes.BOOLEAN,
  },
  devices: {
    type: FieldTypes.ARRAY,
  },
  deviceIds: {
    type: FieldTypes.ARRAY,
  },
  scheduledAt: {
    type: FieldTypes.NUMBER,
  },
  retryCount: {
    type: FieldTypes.NUMBER,
  },
  maxRetries: {
    type: FieldTypes.NUMBER,
  },
  payload: {
    type: FieldTypes.OBJECT,
  },
}

function normalizeSchedulePatch(patch = {}) {
  const now = Date.now()

  return {
    ...patch,
    updatedAt: now,
  }
}

class ScheduleStore extends BaseStore {
  constructor() {
    super({
      tableName: 'schedules',
      schema: scheduleSchema,
      primaryKey: 'id',
      requiredFields: ['id', 'scheduleType', 'timerType', 'status'],
    })
  }

  async createSchedule(schedule) {
    const now = Date.now()
    const data = {
      enabled: true,
      status: ScheduleStatus.PENDING,
      retryCount: 0,
      maxRetries: 3,
      runCount: 0,
      createdAt: now,
      updatedAt: now,
      schemaVersion: 1,
      ...schedule,
    }

    return this.add(data)
  }

  async updateSchedule(id, patch) {
    return this.update(id, normalizeSchedulePatch(patch))
  }

  async updateStatus(id, status, patch = {}) {
    return this.updateSchedule(id, {
      ...patch,
      status,
    })
  }

  async listAll() {
    try {
      const records = await this.table.toArray()
      records.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0))
      return { success: true, data: records }
    }
    catch (error) {
      console.error('[schedules] listAll error:', error)
      return { success: false, error }
    }
  }

  async listByStatus(status) {
    const statuses = Array.isArray(status) ? status : [status]

    try {
      const records = await this.table
        .where('status')
        .anyOf(statuses)
        .toArray()

      records.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0))
      return { success: true, data: records }
    }
    catch (error) {
      console.error('[schedules] listByStatus error:', error)
      return { success: false, error }
    }
  }

  async listRecoverable() {
    try {
      const records = await this.table
        .where('status')
        .anyOf(RecoverableScheduleStatuses)
        .toArray()

      return {
        success: true,
        data: records.filter(schedule => schedule.enabled !== false),
      }
    }
    catch (error) {
      console.error('[schedules] listRecoverable error:', error)
      return { success: false, error }
    }
  }

  async markExpired(id, reason = 'Schedule expired while application was not running') {
    return this.updateStatus(id, ScheduleStatus.EXPIRED, {
      enabled: false,
      expiredAt: Date.now(),
      lastError: reason,
    })
  }

  async markInterruptedRunning() {
    try {
      const runningSchedules = await this.table
        .where('status')
        .equals(ScheduleStatus.RUNNING)
        .toArray()

      if (runningSchedules.length === 0) {
        return { success: true, data: [] }
      }

      const now = Date.now()
      const updates = runningSchedules.map((schedule) => {
        const retryCount = Number(schedule.retryCount || 0)
        const maxRetries = Number(schedule.maxRetries || 0)
        const canRetry = schedule.enabled !== false && retryCount < maxRetries

        return {
          key: schedule.id,
          changes: {
            status: canRetry ? ScheduleStatus.PENDING : ScheduleStatus.FAILED,
            retryCount: canRetry ? retryCount + 1 : retryCount,
            failedAt: now,
            updatedAt: now,
            lastError: 'Schedule interrupted by application exit',
          },
        }
      })

      await db.schedules.bulkUpdate(updates)
      return { success: true, data: updates }
    }
    catch (error) {
      console.error('[schedules] markInterruptedRunning error:', error)
      return { success: false, error }
    }
  }
}

export const scheduleStore = new ScheduleStore()
