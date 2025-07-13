import { debounce } from 'lodash-es'
import { createStderr, createStdout, textFormatter } from 'vue-command'
import { useFixCursor } from './helper.js'

const $gnirehtet = window.gnirehtet

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

        useFixCursor(history)

        appendToHistory(createStdout(stdoutText))
      },
      stderr(text) {
        loading.value = false

        stderrText += text

        useFixCursor(history)

        appendToHistory(createStderr(stderrText))
      },
    })

    return textFormatter('Waiting...')
  }

  return {
    gnirehtet,
  }
}
