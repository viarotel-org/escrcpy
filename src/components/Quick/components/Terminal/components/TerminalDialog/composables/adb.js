import { createStderr, createStdout } from 'vue-command'

const $adb = window.adb

export function useAdb({ loading }) {
  const adb = async (args) => {
    loading.value = true
    const command = args.slice(1).join(' ')

    let stderr
    let stdout

    try {
      const res = await $adb.shell(command || 'help')

      stdout = res?.stdout
      stderr = res?.stderr
    }
    catch (error) {
      stderr = error?.message || JSON.stringify(error) || 'Command failed'
    }

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
