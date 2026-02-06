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
    convertEol: false, // 禁用自动转换，手动控制换行符以避免光标错位
    disableStdin: false,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  })

  fitAddon.value = new FitAddon()
  terminal.value.loadAddon(fitAddon.value)
  terminal.value.open(terminalRef.value)
  terminal.value.clear()

  window.addEventListener('resize', handleResize)

  terminal.value.onData(handleInput)

  terminal.value.onResize(handleTerminalResize)

  watchThemeChange()

  await nextTick()
  fitAddon.value.fit()
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
  const value = {
    foreground: isDark.value ? '#ffffff' : '#000000',
    cursor: isDark.value ? '#ffffff' : '#000000',
    selectionBackground: isDark.value ? primaryShades[500] : primaryShades[300],
  }

  return value
}

async function connectSession() {
  try {
    const { type, instanceId, options } = terminalConfig.value
    const isWindows = window.$platform.is('windows')

    const result = await window.$preload.terminal.createSession({
      type,
      instanceId,
      options,
      onData: (data) => {
        // Windows: 规范化换行符以避免光标错位
        if (isWindows && terminalConfig.value.type === 'local') {
          data = data.replace(/\r?\n/g, '\r\n')
        }
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

  // Windows: 转换退格键 DEL (\x7F) 为 BS (\x08)
  if (window.$platform.is('windows') && terminalConfig.value.type === 'local') {
    data = data.replace(/\x7F/g, '\x08')
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
    .xterm-scrollable-element,
    .xterm-viewport {
      @apply !bg-transparent;
    }
  }
}
</style>
