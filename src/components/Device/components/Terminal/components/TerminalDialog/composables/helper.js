import { textFormatter } from 'vue-command'

export function useFixCursor(history) {
  const length = history.value.length
  if (history.value[length - 1]?.__name === 'VueCommandQuery') {
    history.value.splice(length - 1, 1, textFormatter('Waiting...'))
  }
}
