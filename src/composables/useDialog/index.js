import { sleep } from '$/utils'

export function useDialog() {
  const visible = ref(false)
  const lazyVisible = ref(false)
  const loading = ref(false)
  const params = ref({})

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
    visible.value = true
    params.value = args?.params ?? {}
  }

  function close() {
    visible.value = false
  }

  function reset() {
    visible.value = false
    loading.value = false
    params.value = {}
  }

  return {
    visible,
    lazyVisible,
    loading,
    params,
    open,
    close,
    reset,
  }
}

export default useDialog
