import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'
import * as themes from './theme.js'
import { sleep } from '$/utils/index.js'

export function useTerminal({ theme = 'github' }) {
  const themeStore = useThemeStore()
  const terminalRef = ref(null)
  const terminal = shallowRef(null)
  const fitAddon = shallowRef(null)
  const sessionId = ref(null)
  const connected = ref(false)
  const disposeCallbacks = ref(null)
  let unwatchTheme = null
  let resizeTimer = null

  const terminalConfig = computed(() => {
    const payload = window.$preload.payload || {}

    const type = payload.type || 'local'
    const instanceId = String(payload.instanceId)

    return {
      type,
      instanceId,
      options: { deviceId: payload.device?.id },
      command: payload.command,
    }
  })

  function getCurrentTheme() {
    const isDark = themeStore.isDark
    return themes[theme][isDark ? 'dark' : 'light']
  }

  function handleInput(data) {
    if (!sessionId.value) {
      return false
    }

    window.$preload.terminal.writeSession(sessionId.value, data)
  }

  function handleResize({ cols, rows }) {
    if (!sessionId.value)
      return
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      window.$preload.terminal.resizeSession(sessionId.value, cols, rows)
    }, 16)
  }

  async function initTerminal() {
    disposeCallbacks.value?.()
    disposeCallbacks.value = null

    const platformFontMap = {
      windows: '"Cascadia Mono", "Consolas", "Courier New", monospace',
      macos: '"Menlo", "Monaco", "Courier New", monospace',
      linux: 'Monospace',
    }

    const fontFamily = platformFontMap[window.$platform.name] || 'Monospace'

    terminal.value = new Terminal({
      fontFamily,
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: 'bar',
      cursorWidth: 2,
      convertEol: true,
      allowTransparency: true,
      scrollback: 5000,
      smoothScrollDuration: 150,
      macOptionIsMeta: true,
      theme: getCurrentTheme(),
    })

    fitAddon.value = new FitAddon()
    terminal.value.loadAddon(fitAddon.value)
    terminal.value.open(terminalRef.value)
    terminal.value.clear()
    terminal.value.element.addEventListener('focus', () => terminal.value.textarea?.focus())

    await nextTick()
    fitAddon.value.fit()
    handleResize({ cols: terminal.value.cols, rows: terminal.value.rows })

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.value?.fit()
      handleResize({ cols: terminal.value.cols, rows: terminal.value.rows })
    })
    resizeObserver.observe(terminalRef.value)
    disposeCallbacks.value = () => resizeObserver.disconnect()

    terminal.value.onData(handleInput)
    terminal.value.onResize(handleResize)

    unwatchTheme?.()
    unwatchTheme = watch(
      () => themeStore.isDark,
      () => {
        terminal.value.options.theme = getCurrentTheme()
      },
      { immediate: true },
    )

    terminal.value.focus()
  }

  async function connectSession() {
    try {
      const actualDimensions = { cols: terminal.value.cols, rows: terminal.value.rows }
      const result = await window.$preload.terminal.createSession({
        type: terminalConfig.value.type,
        instanceId: terminalConfig.value.instanceId,
        options: { ...terminalConfig.value.options, ...actualDimensions },
        onData: data => terminal.value?.write(data),
        onExit: (code) => {
          connected.value = false
          terminal.value?.writeln(`\r\n\x1B[33mProcess exited with code ${code}\x1B[0m`)
        },
        onError: err => terminal.value?.writeln(`\r\n\x1B[31mError: ${err.message || err}\x1B[0m`),
      })

      if (!result.success) {
        terminal.value.writeln(`\r\n\x1B[31mError: ${result.error}\x1B[0m`)
        return
      }

      sessionId.value = result.sessionId

      if (result.dispose) {
        const prevDispose = disposeCallbacks.value
        disposeCallbacks.value = () => {
          prevDispose?.()
          result.dispose()
        }
      }

      connected.value = true

      if (terminalConfig.value.type === 'local') {
        terminal.value.writeln('\x1B[38;2;15;140;121m[Tip]\x1B[0m Full system commands, enhanced with scrcpy, adb, fastboot, and gnirehtet.\r\n')
      }

      if (terminalConfig.value.command) {
        // TODO: Delay to ensure terminal is ready
        await sleep(500)
        handleInput(`${terminalConfig.value.command}\r`)
      }
    }
    catch (error) {
      terminal.value.writeln(`\r\n\x1B[31mFailed to connect: ${error.message}\x1B[0m`)
    }
  }

  function cleanup() {
    unwatchTheme?.()
    sessionId.value && window.$preload.terminal.destroySession(sessionId.value)
    disposeCallbacks.value?.()
    disposeCallbacks.value = null
    terminal.value?.dispose()
  }

  onMounted(async () => {
    await initTerminal()
    await connectSession()
    window.addEventListener('beforeunload', cleanup)
  })

  onBeforeUnmount(() => {
    cleanup()
    window.removeEventListener('beforeunload', cleanup)
  })

  return { terminalRef, terminalConfig, terminal, connected, cleanup }
}
