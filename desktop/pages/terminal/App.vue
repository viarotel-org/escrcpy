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
          <el-tag :type="terminalTypeConfig.tagType" class="">
            <div class="flex items-center gap-2">
              <div class="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              {{ terminalTypeConfig.label }}
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

const terminalTypeConfig = computed(() => {
  const type = terminalConfig.value.type

  if (type === 'local') {
    return {
      label: 'Debug',
      tagType: 'primary',
    }
  }

  if (type === 'device') {
    const device = currentDevice.value
    return {
      label: device?.id ? deviceStore.getLabel(device, 'name') : 'Device Terminal',
      tagType: 'primary',
    }
  }

  return {
    label: `${type} Terminal`,
    tagType: 'primary',
  }
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

onMounted(() => {
  initTerminal()
  connectSession()
})

onUnmounted(() => {
  cleanup()
})

function initTerminal() {
  terminal.value = new Terminal({
    theme: getCurrentTheme(),
    fontSize: 14,
    cursorBlink: true,
    cursorStyle: 'underline',
    cols: 80,
    rows: 24,
    convertEol: true,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  })

  fitAddon.value = new FitAddon()
  terminal.value.loadAddon(fitAddon.value)
  terminal.value.open(terminalRef.value)
  terminal.value.clear()

  nextTick(() => {
    fitAddon.value.fit()
    terminal.value.focus()
  })

  window.addEventListener('resize', handleResize)

  terminal.value.onData(handleInput)

  terminal.value.onResize(handleTerminalResize)

  watchThemeChange()
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
    connected.value = true

    console.log(`[Terminal] Connected to session: ${sessionId.value}`)
  }
  catch (error) {
    terminal.value.writeln(`\r\n\x1B[31mFailed to connect: ${error.message}\x1B[0m`)
  }
}

function handleInput(data) {
  if (!sessionId.value) {
    return
  }

  if (data === '\r') {
    window.$preload.terminal.writeSession(sessionId.value, '\r\n')
  }
  else {
    window.$preload.terminal.writeSession(sessionId.value, data)
  }
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
