import { watchEffect } from 'vue'

export function useOtg(data) {
  watchEffect(() => {
    if (data.value['--hid-keyboard']) {
      data.value['--hid-mouse'] = false
    }
  })

  watchEffect(() => {
    if (data.value['--hid-mouse']) {
      data.value['--hid-keyboard'] = false
    }
  })
}
