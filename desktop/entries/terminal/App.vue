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

          <el-tag v-if="currentDevice?.id" type="primary" class="">
            <div class="flex items-center gap-2">
              <div class="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              {{ deviceLabel }}
            </div>
          </el-tag>
          <div v-else class="device-badge flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            <span class="text-xs">{{ $t('copilot.noDevice') }}</span>
          </div>
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
const { queryParams: currentDevice, locale, size, themeStore } = useWindowStateSync()

const terminalRef = ref(null)
const terminal = shallowRef(null)
const fitAddon = shallowRef(null)
const shellId = ref(null)
const connected = ref(false)

const deviceLabel = computed(() => {
  return deviceStore.getLabel(currentDevice.value, 'name')
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
  connectShell()
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

async function connectShell() {
  try {
    const result = await window.$preload.terminal.createShell(currentDevice.value.id)

    if (!result.success) {
      terminal.value.writeln(`\r\n\x1B[31mError: ${result.error}\x1B[0m`)
      return
    }

    shellId.value = result.shellId
    connected.value = true

    window.$preload.ipcRenderer.on(
      `terminal:shell-output-${shellId.value}`,
      handleOutput,
    )

    window.$preload.ipcRenderer.on(
      `terminal:shell-error-${shellId.value}`,
      handleError,
    )

    window.$preload.ipcRenderer.on(
      `terminal:shell-exit-${shellId.value}`,
      handleExit,
    )
  }
  catch (error) {
    terminal.value.writeln(`\r\n\x1B[31mFailed to connect: ${error.message}\x1B[0m`)
  }
}

function handleInput(data) {
  if (!shellId.value) {
    return
  }

  if (data === '\r') {
    window.$preload.terminal.writeShell(shellId.value, '\r\n')
  }
  else {
    window.$preload.terminal.writeShell(shellId.value, data)
  }
}

function handleOutput(event, data) {
  terminal.value?.write(data)
}

function handleError(event, { message, code }) {
  terminal.value?.writeln(`\r\n\x1B[31mError (${code}): ${message}\x1B[0m`)
  onRefreshClick()
}

function handleExit(event, { code, signal }) {
  connected.value = false
  terminal.value?.writeln(`\r\n\x1B[33mProcess exited with code ${code}\x1B[0m`)
}

function handleResize() {
  fitAddon.value?.fit()
}

function cleanup() {
  window.removeEventListener('resize', handleResize)

  if (shellId.value) {
    window.$preload.ipcRenderer.off(
      `terminal:shell-output-${shellId.value}`,
      handleOutput,
    )
    window.$preload.ipcRenderer.off(
      `terminal:shell-error-${shellId.value}`,
      handleError,
    )
    window.$preload.ipcRenderer.off(
      `terminal:shell-exit-${shellId.value}`,
      handleExit,
    )
    window.$preload.terminal.destroyShell(shellId.value)
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
