import { debounce } from 'lodash-es'
import { createStderr, createStdout, textFormatter } from 'vue-command'
import { useFixCursor, useSystemTerminal } from './helper.js'

const $gnirehtet = window.$preload.gnirehtet

export function useGnirehtet({ vShell, history, loading } = {}) {
  const gnirehtet = async (args) => {
    const appendToHistory = debounce(vShell.value.appendToHistory, 500)

    try {
      await useSystemTerminal(args.join(' '))
    }
    catch (error) {
      useFixCursor(history)
      appendToHistory(createStdout('System terminal is enabled'))
      return false
    }

    loading.value = true

    let stdoutText = ''
    let stderrText = ''

    const command = args.slice(1).join(' ')

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
