import { sleep } from '$/utils'

export function useDialog() {
  const visible = ref(false)
  const lazyVisible = ref(false)
  const loading = ref(false)
  const params = ref({})
  const options = ref({})
  const promise = ref({
    resolve: null,
    reject: null,
  })

  watch(
    () => visible.value,
    async (value) => {
      if (!value) {
        await sleep()
      }
      lazyVisible.value = value
    },
  )

  function open(args) {
    options.value = args ?? {}
    params.value = args?.params ?? {}
    visible.value = true

    if (options.value?.promise) {
      return new Promise((resolve, reject) => {
        promise.value.resolve = resolve
        promise.value.reject = reject
      })
    }
  }

  function reset() {
    visible.value = false
    loading.value = false
    params.value = {}
    options.value = {}
    promise.value = {
      resolve: null,
      reject: null,
    }
  }

  function close() {
    cancel()
  }

  function cancel(data) {
    options.value.onCancel?.(data)
    promise.value.reject?.(data)
    reset()
  }

  function confirm(data) {
    options.value.onConfirm?.(data)
    promise.value.resolve?.(data)
    reset()
  }

  function success(data) {
    options.value.onSuccess?.(data)
    promise.value.resolve?.(data)
    reset()
  }

  return reactive({
    visible,
    lazyVisible,
    loading,
    params,
    options,
    open,
    close,
    reset,
    success,
    confirm,
    cancel,
  })
}

export default useDialog
