export function useSmsCountdown(options) {
  const value = ref(0)

  const loading = ref(false)

  let interval

  function start(seconds = options?.seconds || 60) {
    value.value = seconds

    interval = setInterval(() => {
      value.value -= 1

      if (value.value <= 0) {
        clearInterval(interval)
      }
    }, 1000)
  }

  function reset() {
    clearInterval(interval)
    value.value = 0
  }

  return {
    value,
    loading,
    start,
    reset,
  }
}
