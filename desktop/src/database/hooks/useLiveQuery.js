/**
 * Vue 响应式存储 Hook - 基于 @vueuse/rxjs 和 Dexie liveQuery
 *
 * 设计思路：
 * 1. 利用 Dexie 的 liveQuery 实现数据变化自动响应
 * 2. 封装为 Vue Composition API 风格的 Hook
 * 3. 自动管理订阅生命周期
 *
 * @module storage/hooks/useLiveQuery
 */

import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'

/**
 * 使用 Dexie liveQuery 创建响应式查询
 * 当数据库数据变化时，自动更新 Vue 响应式数据
 *
 * @param {Function} queryFn - 返回 Promise 的查询函数
 * @param {Object} [options] - 选项
 * @param {any} [options.defaultValue] - 默认值
 * @param {Array} [options.deps] - 依赖项，当依赖变化时重新执行查询
 * @returns {import('vue').Ref} 响应式数据引用
 *
 * @example
 * // 基本用法
 * const messages = useLiveQuery(() => db.messages.toArray())
 *
 * // 带条件查询
 * const sessionMessages = useLiveQuery(
 *   () => db.messages.where('sessionId').equals(sessionId.value).toArray(),
 *   { deps: [sessionId] }
 * )
 */
export function useLiveQuery(queryFn, options = {}) {
  const { defaultValue = [] } = options

  // 使用 @vueuse/rxjs 的 useObservable 来消费 liveQuery 返回的 observable
  const result = useObservable(liveQuery(queryFn), { initialValue: defaultValue })

  return result
}

/**
 * 带手动刷新功能的 liveQuery Hook
 *
 * @param {Function} queryFn - 查询函数
 * @param {Object} [options] - 选项
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

  // 初始订阅
  subscribe()

  // 组件卸载时取消订阅
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
 * 带依赖监听的 liveQuery Hook
 * 当依赖变化时自动重新执行查询
 *
 * @param {Function} queryFnFactory - 返回查询函数的工厂函数
 * @param {Array|Function} deps - 依赖项
 * @param {Object} [options] - 选项
 * @returns {{data: Ref, loading: Ref, error: Ref}}
 */
export function useLiveQueryWithDeps(queryFnFactory, deps, options = {}) {
  const { defaultValue = [] } = options

  const data = shallowRef(defaultValue)
  const loading = ref(true)
  const error = ref(null)

  let subscription = null

  const subscribe = () => {
    // 先取消之前的订阅
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

  // 监听依赖变化
  watch(deps, () => {
    subscribe()
  }, { immediate: true, deep: true })

  // 组件卸载时取消订阅
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
