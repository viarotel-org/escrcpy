export function useLazy(options) {
  const visible = ref(false)
  const mounted = ref(false)

  async function mount() {
    visible.value = true

    await nextTick()
    mounted.value = true
    options?.onMounted?.()
  }

  async function unmount() {
    visible.value = false

    await nextTick()
    mounted.value = false

    options?.onUnmounted?.()
  }

  return reactive({
    visible,
    mounted,
    mount,
    unmount,
  })
}
