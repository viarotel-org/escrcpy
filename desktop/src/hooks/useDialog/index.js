import { sleep } from '$/utils'

export function useDialog() {
  const visible = ref(false)
  const lazyVisible = ref(false)
  const loading = ref(false)
  const params = ref({})
  const options = ref({})

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
  }

  function close() {
    params.value = {}
    visible.value = false
  }

  function reset() {
    visible.value = false
    loading.value = false
    params.value = {}
    options.value = {}
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
  })
}

export default useDialog
