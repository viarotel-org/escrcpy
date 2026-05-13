/**
 * Schedule composables - Vue reactive hooks for schedules.
 *
 * @module storage/modules/schedule/hooks
 */

import { liveQuery } from 'dexie'
import { db } from '$/database/core/database.js'
import { scheduleStore } from './store.js'

export function useSchedules(statusRef = null) {
  const schedules = shallowRef([])
  const loading = ref(false)
  const error = ref(null)

  let subscription = null

  const getStatus = () => {
    if (typeof statusRef === 'object' && statusRef !== null && 'value' in statusRef) {
      return statusRef.value
    }
    return statusRef
  }

  const subscribe = () => {
    subscription?.unsubscribe()
    subscription = null

    loading.value = true
    error.value = null

    try {
      const observable = liveQuery(async () => {
        const status = getStatus()
        const records = status
          ? await db.schedules.where('status').equals(status).toArray()
          : await db.schedules.toArray()

        return records.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0))
      })

      subscription = observable.subscribe({
        next(value) {
          schedules.value = value || []
          loading.value = false
        },
        error(err) {
          console.error('[useSchedules] Subscribe error:', err)
          error.value = err
          loading.value = false
        },
      })
    }
    catch (err) {
      console.error('[useSchedules] Init error:', err)
      error.value = err
      loading.value = false
    }
  }

  subscribe()

  if (typeof statusRef === 'object' && statusRef !== null && 'value' in statusRef) {
    watch(statusRef, () => subscribe())
  }

  onUnmounted(() => {
    subscription?.unsubscribe()
    subscription = null
  })

  async function createSchedule(data = {}) {
    const result = await scheduleStore.createSchedule(data)
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to create schedule')
    }
    return result.data
  }

  async function updateSchedule(id, patch) {
    const result = await scheduleStore.updateSchedule(id, patch)
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to update schedule')
    }
    return result.data
  }

  async function removeSchedule(id) {
    const result = await scheduleStore.deleteById(id)
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to delete schedule')
    }
  }

  return {
    schedules,
    loading,
    error,
    createSchedule,
    updateSchedule,
    removeSchedule,
  }
}
