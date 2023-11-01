import { watchEffect } from 'vue'

export function useOTG(data) {
  watchEffect(() => {
    if (data.value['--hid-keyboard'] || data.value['--hid-mouse']) {
      data.value['--otg'] = true
    }
    else {
      data.value['--otg'] = false
    }
  })

  watchEffect(() => {
    if (!data.value['--otg']) {
      data.value['--hid-keyboard'] = false
      data.value['--hid-mouse'] = false
    }
  })

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
