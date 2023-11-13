import { debounce } from 'lodash-es'
import { createStderr, createStdout, textFormatter } from 'vue-command'

const $gnirehtet = window.gnirehtet

const fixCursor = (history) => {
  const length = history.value.length
  if (history.value[length - 1]?.__name === 'VueCommandQuery') {
    history.value.splice(length - 1, 1, textFormatter('Waiting...'))
  }
}

export function useGnirehtet({ vShell, history, loading } = {}) {
  const gnirehtet = async (args) => {
    loading.value = true

    const command = args.slice(1).join(' ')

    const appendToHistory = debounce(vShell.value.appendToHistory, 500)

    let stdoutText = ''
    let stderrText = ''
    $gnirehtet.shell(command, {
      stdout(text) {
        loading.value = false

        stdoutText += text

        fixCursor(history)

        appendToHistory(createStdout(stdoutText))
      },
      stderr(text) {
        loading.value = false

        stderrText += text

        fixCursor(history)

        appendToHistory(createStderr(stderrText))
      },
    })

    return textFormatter('Loading...')
  }

  return {
    gnirehtet,
  }
}
