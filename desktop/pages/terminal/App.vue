<template>
  <el-config-provider :locale="locale" :size="size">
    <div class="flex flex-col h-screen">
      <div
        :class="[
          {
            'pl-20': $platform.is('macos'),
            'pr-[calc(100px+3.6vw)]': $platform.is('windows') || $platform.is('linux'),
          },
        ]"
        class="app-region-drag flex-none flex items-center justify-between px-2 py-2"
      >
        <div class="flex items-center gap-4">
          <div class="text-sm font-semibold pl-2 select-none">
            Escrcpy Terminal
          </div>

          <el-tag v-if="['device'].includes(terminalConfig.type)" type="primary">
            <div class="flex items-center gap-2">
              <div class="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              {{ currentDeviceLabel }}
            </div>
          </el-tag>
        </div>

        <div class="flex items-center !space-x-2 *:app-region-no-drag">
          <el-button
            circle
            text
            icon="Refresh"
            :title="$t('device.refresh.name')"
            @click="onRefreshClick"
          />
          <el-switch v-model="isDark" class="el-switch--theme">
            <template #active-action>
              <i class="i-solar-moon-bold"></i>
            </template>
            <template #inactive-action>
              <i class="i-solar-sun-bold"></i>
            </template>
          </el-switch>
        </div>
      </div>

      <div class="flex-1 min-h-0 overflow-hidden relative group pl-4 pr-2 py-2">
        <div
          ref="terminalRef"
          class="xterm-wrapper size-full"
        ></div>
      </div>
    </div>

    <WindowControls v-if="$platform.is('windows') || $platform.is('linux')" />
  </el-config-provider>
</template>

<script setup>
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'
import WindowControls from '$/components/window-controls/index.vue'

const deviceStore = useDeviceStore()
const { currentDevice, locale, size, themeStore } = useWindowStateSync()

const terminalRef = ref(null)
const terminal = shallowRef(null)
const fitAddon = shallowRef(null)
const sessionId = ref(null)
const connected = ref(false)
const disposeCallbacks = ref(null)

const terminalConfig = computed(() => {
  const type = window.$preload.payload.type || 'local'
  const instanceId = window.$preload.payload.instanceId

  return {
    type,
    instanceId: String(instanceId),
    options: type === 'device'
      ? { deviceId: currentDevice.value?.id }
      : {},
  }
})

const currentDeviceLabel = computed(() => {
  const device = currentDevice.value
  const value = device?.id ? deviceStore.getLabel(device, 'name') : 'Device Terminal'
  return value
})

const isDark = computed({
  get() {
    return themeStore.isDark
  },
  set(value) {
    themeStore.isDark = value
    themeStore.updateHtml(value ? 'dark' : 'light')
  },
})

onMounted(async () => {
  await initTerminal()
  await connectSession()
  window.addEventListener('beforeunload', cleanup)
})

onBeforeUnmount(() => {
  cleanup()
  window.removeEventListener('beforeunload', cleanup)
})

async function initTerminal() {
  const fontFamily = window.$platform.is('windows')
    ? '"Cascadia Mono", "Consolas", "Courier New", monospace'
    : '"Menlo", "Monaco", "Courier New", monospace'

  terminal.value = new Terminal({
    theme: getCurrentTheme(),
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
  })

  fitAddon.value = new FitAddon()
  terminal.value.loadAddon(fitAddon.value)

  terminal.value.open(terminalRef.value)
  terminal.value.clear()
  terminal.value.element.addEventListener('focus', () => {
    terminal.value.textarea?.focus()
  })

  await nextTick()
  fitAddon.value.fit()

  const resizeObserver = new ResizeObserver(() => {
    fitAddon.value?.fit()
    if (terminal.value) {
      handleTerminalResize({ cols: terminal.value.cols, rows: terminal.value.rows })
    }
  })

  resizeObserver.observe(terminalRef.value)
  disposeCallbacks.value = () => {
    resizeObserver.disconnect()
  }

  terminal.value.onData(handleInput)
  terminal.value.onResize(handleTerminalResize)
  watchThemeChange()
  terminal.value.focus()
}

let unwatchTheme = null

function watchThemeChange() {
  unwatchTheme?.()
  unwatchTheme = watch(() => isDark.value, () => {
    if (!terminal.value)
      return
    terminal.value.options.theme = { ...getCurrentTheme() }
  }, { immediate: true })
}

function getCurrentTheme() {
  const selectionColor = isDark.value ? '#264f78' : '#add6ff'
  if (isDark.value) {
    return {
      foreground: '#cccccc',
      background: 'transparent',
      cursor: '#ffffff',
      cursorAccent: '#1e1e1e',
      selectionBackground: selectionColor,
      selectionInactiveBackground: '#3a3d41',
      black: '#000000',
      red: '#cd3131',
      green: '#0dbc79',
      yellow: '#e5e510',
      blue: '#2472c8',
      magenta: '#bc3fbc',
      cyan: '#11a8cd',
      white: '#e5e5e5',
      brightBlack: '#666666',
      brightRed: '#f14c4c',
      brightGreen: '#23d18b',
      brightYellow: '#f5f543',
      brightBlue: '#3b8eea',
      brightMagenta: '#d670d6',
      brightCyan: '#29b8db',
      brightWhite: '#e5e5e5',
    }
  }
  return {
    foreground: '#24292f',
    background: 'transparent',
    cursor: '#24292f',
    cursorAccent: '#ffffff',
    selectionBackground: selectionColor,
    black: '#24292f',
    red: '#cf222e',
    green: '#116329',
    yellow: '#4d2d00',
    blue: '#0969da',
    magenta: '#8250df',
    cyan: '#1b7c83',
    white: '#6e7781',
    brightBlack: '#57606a',
    brightRed: '#a40e26',
    brightGreen: '#1a7f37',
    brightYellow: '#633c01',
    brightBlue: '#218bff',
    brightMagenta: '#a475f9',
    brightCyan: '#3192aa',
    brightWhite: '#8c959f',
  }
}

async function connectSession() {
  try {
    const { type, instanceId, options } = terminalConfig.value
    const actualDimensions = { cols: terminal.value.cols, rows: terminal.value.rows }

    const result = await window.$preload.terminal.createSession({
      type,
      instanceId,
      options: { ...options, ...actualDimensions },
      onData: (data) => { terminal.value?.write(data) },
      onExit: (code) => {
        connected.value = false
        terminal.value?.writeln(`\r\n\x1B[33mProcess exited with code ${code}\x1B[0m`)
      },
      onError: (error) => { terminal.value?.writeln(`\r\n\x1B[31mError: ${error.message || error}\x1B[0m`) },
    })

    if (!result.success) {
      terminal.value.writeln(`\r\n\x1B[31mError: ${result.error}\x1B[0m`)
      return
    }

    sessionId.value = result.sessionId
    if (result.dispose) {
      const prevDispose = disposeCallbacks.value
      disposeCallbacks.value = () => {
        if (prevDispose)
          prevDispose()
        result.dispose()
      }
    }

    connected.value = true

    if (['local'].includes(terminalConfig.value.type)) {
      terminal.value.writeln('\x1B[1;35m[Tip]\x1B[0m Terminal supports full system commands with scrcpy, adb, fastboot, etc.\r\n')
    }

    if (window.$preload.payload.command) {
      handleInput(`${window.$preload.payload.command}\n`)
    }
  }
  catch (error) {
    terminal.value.writeln(`\r\n\x1B[31mFailed to connect: ${error.message}\x1B[0m`)
  }
}

function handleInput(data) {
  if (!sessionId.value)
    return
  window.$preload.terminal.writeSession(sessionId.value, data)
}

function handleTerminalResize({ cols, rows }) {
  if (!sessionId.value)
    return
  window.$preload.terminal.resizeSession(sessionId.value, cols, rows)
}

function cleanup() {
  unwatchTheme?.()

  if (sessionId.value) {
    window.$preload.terminal.destroySession(sessionId.value)
  }

  if (disposeCallbacks.value) {
    disposeCallbacks.value()
    disposeCallbacks.value = null
  }

  terminal.value?.dispose()
}

function onRefreshClick() {
  window.location.reload()
}
</script>

<style lang="postcss" scoped>
.xterm-wrapper {
  --scrollbar-width: 5px;
  --scrollbar-track: transparent;
  --scrollbar-thumb: rgba(0, 0, 0, 0.2);
  --scrollbar-thumb-hover: rgba(0, 0, 0, 0.4);
}

:deep(.dark .xterm-wrapper) {
  --scrollbar-thumb: rgba(255, 255, 255, 0.2);
  --scrollbar-thumb-hover: rgba(255, 255, 255, 0.4);
}

:deep() {
  .xterm {
    font-feature-settings: 'liga' 0;
    padding: 0;
  }

  .xterm-viewport,
  .xterm-scrollable-element {
    background-color: transparent !important;
  }

  .xterm-viewport {
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);

    &::-webkit-scrollbar {
      width: var(--scrollbar-width);
      background-color: var(--scrollbar-track);
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar-thumb);
      border-radius: 6px;
      border: 2px solid transparent;
      background-clip: content-box;
      transition: background-color 0.2s;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: var(--scrollbar-thumb-hover);
    }

    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
}
</style>
