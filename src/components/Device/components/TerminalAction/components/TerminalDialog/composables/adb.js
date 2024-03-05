import { createStderr, createStdout } from 'vue-command'

const $adb = window.adbkit

export function useAdb({ loading }) {
  const adb = async (args) => {
    loading.value = true
    const command = args.slice(1).join(' ')

    const { stderr, stdout } = await $adb.shell(command || 'help')

    if (stderr) {
      return createStderr(stderr)
    }

    loading.value = false

    return createStdout(stdout)
  }

  return {
    adb,
  }
}
