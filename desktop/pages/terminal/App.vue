<template>
  <el-config-provider :locale="locale" :size="size">
    <div
      class="flex flex-col h-screen"
    >
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
          <div class="text-sm font-semibold pl-2">
            Escrcpy Terminal
          </div>

          <!-- 终端类型标签 -->
          <el-tag v-if="['device'].includes(terminalConfig.type)" type="primary" class="">
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
          >
          </el-button>

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

      <div class="flex-1 min-h-0 overflow-hidden p-4">
        <div
          ref="terminalRef"
          class="xterm--beautify size-full"
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
import { primaryShades } from '$/configs/index.js'

const deviceStore = useDeviceStore()
const { currentDevice, locale, size, themeStore } = useWindowStateSync()

const terminalRef = ref(null)
const terminal = shallowRef(null)
const fitAddon = shallowRef(null)
const sessionId = ref(null)
const connected = ref(false)
const disposeCallbacks = ref(null) // 用于清理 electron-ipcx 的回调监听器

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
  connectSession()

  // HMR 和页面刷新时提前清理，避免 ConPTY AttachConsole 失败
  window.addEventListener('beforeunload', cleanup)
})

onBeforeUnmount(() => {
  cleanup()
  window.removeEventListener('beforeunload', cleanup)
})

async function initTerminal() {
  terminal.value = new Terminal({
    theme: getCurrentTheme(),
    fontSize: 14,
    cursorBlink: true,
    cursorStyle: 'underline',
    cols: 80,
    rows: 24,
    convertEol: true,
    // 使用严格的等宽字体，确保字符宽度一致
    fontFamily: '"Cascadia Mono", Consolas, "Courier New", monospace',
    // 消除字符间距，避免宽度计算差异
    letterSpacing: 0,
    // 精确行高，避免垂直对齐问题
    lineHeight: 1.0,
  })

  fitAddon.value = new FitAddon()
  terminal.value.loadAddon(fitAddon.value)
  terminal.value.open(terminalRef.value)
  terminal.value.clear()

  // 关键：terminal.open() 后立即 fit，确保在首次数据到达前完成尺寸同步
  await nextTick()
  fitAddon.value.fit()

  window.addEventListener('resize', handleResize)

  terminal.value.onData(handleInput)

  terminal.value.onResize(handleTerminalResize)

  watchThemeChange()

  terminal.value.focus()
}

let unwatchTheme = null

function watchThemeChange() {
  unwatchTheme?.()

  unwatchTheme = watch(() => isDark.value, () => {
    if (!terminal.value) {
      return false
    }

    terminal.value.options.theme = {
      ...getCurrentTheme(),
    }
  }, {
    immediate: true,
  })
}

function getCurrentTheme() {
  if (isDark.value) {
    // 深色主题
    return {
      foreground: '#ffffff',
      background: '#1e1e1e',
      cursor: '#ffffff',
      selectionBackground: primaryShades[500],
    }
  }

  // 浅色主题 - GitHub Light 风格
  return {
    foreground: '#24292f',
    background: '#ffffff',
    cursor: '#24292f',
    cursorAccent: '#ffffff',
    selectionBackground: primaryShades[300],
    
    // ANSI 16 色 - GitHub Light Palette
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

    const result = await window.$preload.terminal.createSession({
      type,
      instanceId,
      options,
      onData: (data) => {
        terminal.value?.write(data)
      },
      onExit: (code, signal) => {
        connected.value = false
        terminal.value?.writeln(`\r\n\x1B[33mProcess exited with code ${code}\x1B[0m`)
      },
      onError: (error) => {
        terminal.value?.writeln(`\r\n\x1B[31mError: ${error.message || error}\x1B[0m`)
      },
    })

    if (!result.success) {
      terminal.value.writeln(`\r\n\x1B[31mError: ${result.error}\x1B[0m`)
      return
    }

    sessionId.value = result.sessionId
    disposeCallbacks.value = result.dispose
    connected.value = true

    if (['local'].includes(terminalConfig.value.type)) {
      terminal.value.writeln('\x1B[1;35m[Tip]\x1B[0m Terminal supports full system commands with scrcpy, adb, fastboot, gnirehtet, etc.\r\n')
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
  if (!sessionId.value) {
    return
  }

  window.$preload.terminal.writeSession(sessionId.value, data)
}

function handleResize() {
  fitAddon.value?.fit()
}

function handleTerminalResize({ cols, rows }) {
  if (!sessionId.value) {
    return
  }

  window.$preload.terminal.resizeSession(sessionId.value, cols, rows)
}

function cleanup() {
  window.removeEventListener('resize', handleResize)
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
:deep() {
  .xterm--beautify {
    /* 确保使用等宽字体，避免字符宽度差异导致光标错位 */
    font-family: "Cascadia Mono", Consolas, "Courier New", monospace;
    /* 消除额外的字符间距和行高，确保与 xterm.js 配置一致 */
    letter-spacing: 0;
    line-height: normal;
    
    .xterm-scrollable-element,
    .xterm-viewport {
      @apply !bg-transparent;
    }
  }
}
</style>
