<template>
  <el-config-provider :locale="locale">
    <KeyboardMappingPopover v-if="mappingPopover" />
    <div
      v-else-if="inputOverlay"
      class="absolute inset-0 h-full overflow-hidden bg-transparent"
      @pointerdown.capture="forwardPointerDown"
      @pointermove.capture="forwardPointerMove"
      @pointerup.capture="forwardPointerUp"
      @pointercancel.capture="forwardPointerCancel"
      @contextmenu.prevent
    >
      <KeyboardMappingPanel
        v-if="mappingStore.editorOpen || mappingStore.config.enabled"
        class="absolute inset-0"
        :display-only="!mappingStore.editorOpen"
      />
    </div>
    <div
      v-else
      class="absolute inset-0 h-full overflow-hidden"
      :class="embedded
        ? (windowExpanded
          ? 'bg-transparent'
          : 'rounded-lg border border-[#3a3a3a] bg-transparent')
        : 'flex bg-transparent'"
      @pointerdown.capture="forwardPointerDown"
      @pointermove.capture="forwardPointerMove"
      @pointerup.capture="forwardPointerUp"
      @pointercancel.capture="forwardPointerCancel"
      @contextmenu.prevent
    >
      <!-- Opaque base below the native scrcpy child and Chromium controls. -->
      <div
        class="absolute inset-0 z-0 bg-[#171717]"
        :class="embedded && !windowExpanded ? 'rounded-[7px]' : ''"
      ></div>

      <header
        v-if="embedded"
        class="app-region-drag absolute inset-x-0 top-0 z-20 h-11 flex items-center bg-[#171717] px-2 pr-36"
      >
        <el-tag type="success" effect="plain" class="max-w-72 !border-emerald-700 !bg-emerald-950/40 !text-emerald-400">
          <span class="block truncate">{{ deviceName }}</span>
        </el-tag>
        <AppControls />
      </header>

      <div
        class="w-12 overflow-hidden bg-[#171717] py-1"
        :class="embedded ? 'absolute bottom-0 right-0 top-11 z-10' : 'h-full flex flex-none'"
      >
        <ControlBar :device="currentDevice" direction="vertical" floating />
      </div>

      <KeyboardMappingPanel
        v-if="mappingStore.editorOpen"
        :class="embedded ? 'absolute bottom-0 left-0 right-12 top-11' : 'flex-1'"
      />
    </div>
  </el-config-provider>
</template>

<script setup>
import AppControls from '$/components/app-controls/index.vue'
import ControlBar from '$/components/control-bar/index.vue'
import KeyboardMappingPanel from '$/components/keyboard-mapping-panel/index.vue'
import KeyboardMappingPopover from '$/components/keyboard-mapping-popover/index.vue'

const deviceStore = useDeviceStore()
const mappingStore = useKeyboardMappingStore()
const embedded = Boolean(window.$preload.payload?.targetWindowTitle)
const mappingPopover = Boolean(window.$preload.payload?.mappingPopover)
const inputOverlay = Boolean(window.$preload.payload?.inputOverlay)
const overlayDevice = window.$preload.payload?.device || null
const windowExpanded = ref(false)

const { currentDevice, locale } = useWindowStateSync({
  deviceSync: true,
})

const deviceName = computed(() => deviceStore.getLabel(
  currentDevice.value,
  ({ deviceName: value }) => value,
))

let activePointer = null
let lastPointerMoveAt = 0

function getVideoPoint(event) {
  const videoWidth = inputOverlay ? window.innerWidth : window.innerWidth - 48
  const videoHeight = inputOverlay ? window.innerHeight : window.innerHeight - 44
  const x = event.clientX
  const y = inputOverlay ? event.clientY : event.clientY - 44

  if (x < 0 || y < 0 || x > videoWidth || y > videoHeight)
    return null

  const scale = window.devicePixelRatio || 1
  return {
    x: Math.round(x * scale),
    y: Math.round(y * scale),
  }
}

function sendPointer(type, point, buttonState = 0) {
  if (!point)
    return

  window.$preload.ipcRenderer.invoke('control:forward-pointer', {
    type,
    buttonState,
    ...point,
  })
}

function forwardPointerDown(event) {
  if ((!embedded && !inputOverlay) || mappingStore.editorOpen || ![0, 2].includes(event.button))
    return

  const point = getVideoPoint(event)
  if (!point)
    return

  activePointer = { id: event.pointerId, button: event.button, point }
  event.currentTarget.setPointerCapture?.(event.pointerId)
  sendPointer(event.button === 0 ? 'leftDown' : 'rightDown', point, event.button === 0 ? 1 : 2)
}

if (inputOverlay && overlayDevice?.id)
  mappingStore.load(overlayDevice.id)

const removeOverlayEditorListener = inputOverlay
  ? window.$preload.ipcRenderer.on(
      'keyboard-mapping:open-editor',
      () => {
        mappingStore.load(overlayDevice?.id)
        mappingStore.beginEdit()
      },
    )
  : null

const removeWindowStateListener = embedded
  ? window.$preload.ipcRenderer.on(
      'control:window-state',
      (_event, state = {}) => {
        windowExpanded.value = Boolean(state.expanded)
      },
    )
  : null

onBeforeUnmount(() => {
  removeOverlayEditorListener?.()
  removeWindowStateListener?.()
})

function forwardPointerMove(event) {
  if (!activePointer || activePointer.id !== event.pointerId || mappingStore.editorOpen)
    return

  const now = performance.now()
  if (now - lastPointerMoveAt < 8)
    return
  lastPointerMoveAt = now
  const point = getVideoPoint(event)
  if (!point)
    return
  activePointer.point = point
  sendPointer('move', point, activePointer.button === 0 ? 1 : 2)
}

function forwardPointerUp(event) {
  if (!activePointer || activePointer.id !== event.pointerId)
    return

  const { button, point: lastPoint } = activePointer
  activePointer = null
  sendPointer(button === 0 ? 'leftUp' : 'rightUp', getVideoPoint(event) || lastPoint)
}

function forwardPointerCancel(event) {
  if (!activePointer || activePointer.id !== event.pointerId)
    return
  const { button, point } = activePointer
  activePointer = null
  sendPointer(button === 0 ? 'leftUp' : 'rightUp', getVideoPoint(event) || point)
}
</script>

<style lang="postcss">
html,
body,
#app {
  background-color: transparent;
  background: transparent !important;
}
</style>
