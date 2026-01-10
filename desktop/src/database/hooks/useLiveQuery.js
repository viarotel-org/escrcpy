/**
 * Vue reactive storage hooks - based on @vueuse/rxjs and Dexie liveQuery
 *
 * Design:
 * 1. Use Dexie liveQuery for automatic reactive updates
 * 2. Provide hooks in Vue Composition API style
 * 3. Automatically manage subscription lifecycle
 *
 * @module storage/hooks/useLiveQuery
 */

import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'

/**
 * Create reactive queries using Dexie liveQuery
 * Automatically update Vue reactive data when database changes
 *
 * @param {Function} queryFn - Query function that returns a Promise
 * @param {Object} [options] - Options
 * @param {any} [options.defaultValue] - Default value
 * @param {Array} [options.deps] - Dependencies; re-run query when they change
 * @returns {import('vue').Ref} Reactive data reference
 *
 * @example
 * // Basic usage
 * const messages = useLiveQuery(() => db.messages.toArray())
 *
 * // Conditional query with dependencies
 * const sessionMessages = useLiveQuery(
 *   () => db.messages.where('sessionId').equals(sessionId.value).toArray(),
 *   { deps: [sessionId] }
 * )
 */
export function useLiveQuery(queryFn, options = {}) {
  const { defaultValue = [] } = options

  // Use @vueuse/rxjs useObservable to consume the observable returned by liveQuery
  const result = useObservable(liveQuery(queryFn), { initialValue: defaultValue })

  return result
}

/**
 * liveQuery Hook with manual refresh capability
 *
 * @param {Function} queryFn - Query function
 * @param {Object} [options] - Options
 * @returns {{data: Ref, loading: Ref, error: Ref, refresh: Function}}
 */
export function useLiveQueryWithState(queryFn, options = {}) {
  const { defaultValue = [] } = options

  const data = shallowRef(defaultValue)
  const loading = ref(true)
  const error = ref(null)

  let subscription = null

  const subscribe = () => {
    loading.value = true
    error.value = null

    try {
      const observable = liveQuery(queryFn)

      subscription = observable.subscribe({
        next: (value) => {
          data.value = value
          loading.value = false
        },
        error: (err) => {
          console.error('[useLiveQueryWithState] Query error:', err)
          error.value = err
          loading.value = false
        },
      })
    }
    catch (err) {
      console.error('[useLiveQueryWithState] Subscribe error:', err)
      error.value = err
      loading.value = false
    }
  }

  const unsubscribe = () => {
    if (subscription) {
      subscription.unsubscribe()
      subscription = null
    }
  }

  const refresh = () => {
    unsubscribe()
    subscribe()
  }

  // Initial subscription
  subscribe()

  // Unsubscribe on component unmount
  onUnmounted(() => {
    unsubscribe()
  })

  return {
    data,
    loading,
    error,
    refresh,
  }
}

/**
 * liveQuery Hook with dependency watch
 * Automatically re-executes the query when dependencies change
 *
 * @param {Function} queryFnFactory - Factory that returns the query function
 * @param {Array|Function} deps - Dependencies
 * @param {Object} [options] - Options
 * @returns {{data: Ref, loading: Ref, error: Ref}}
 */
export function useLiveQueryWithDeps(queryFnFactory, deps, options = {}) {
  const { defaultValue = [] } = options

  const data = shallowRef(defaultValue)
  const loading = ref(true)
  const error = ref(null)

  let subscription = null

  const subscribe = () => {
    // Unsubscribe previous subscription
    if (subscription) {
      subscription.unsubscribe()
      subscription = null
    }

    loading.value = true
    error.value = null

    try {
      const queryFn = queryFnFactory()

      if (!queryFn) {
        data.value = defaultValue
        loading.value = false
        return
      }

      const observable = liveQuery(queryFn)

      subscription = observable.subscribe({
        next: (value) => {
          data.value = value
          loading.value = false
        },
        error: (err) => {
          console.error('[useLiveQueryWithDeps] Query error:', err)
          error.value = err
          loading.value = false
        },
      })
    }
    catch (err) {
      console.error('[useLiveQueryWithDeps] Subscribe error:', err)
      error.value = err
      loading.value = false
    }
  }

  // Watch dependencies for changes
  watch(deps, () => {
    subscribe()
  }, { immediate: true, deep: true })

  // Unsubscribe on component unmount
  onUnmounted(() => {
    if (subscription) {
      subscription.unsubscribe()
    }
  })

  return {
    data,
    loading,
    error,
  }
}

export default {
  useLiveQuery,
  useLiveQueryWithState,
  useLiveQueryWithDeps,
}
