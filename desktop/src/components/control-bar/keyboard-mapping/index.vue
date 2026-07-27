<template>
  <div @mouseenter="showPopover" @mouseleave="hidePopover">
    <slot :trigger="togglePopover" />
  </div>
</template>

<script setup>
const props = defineProps({
  device: {
    type: Object,
    default: () => ({}),
  },
})

const mappingStore = useKeyboardMappingStore()
let cachedScreenState = null
let cachedScreenStateAt = 0
let cachedInputState = false
let cachedInputStateAt = 0
const textInputActive = ref(false)
const externalEditorOpen = ref(false)
const windowFocused = ref(document.hasFocus())
const activeMappingTouches = new Map()
const activeJoystickStates = new Map()
const mappingCommandQueues = new Map()
let nativeBindingIds = new Map()
let inputStateTimer

function enqueueMapping(bindingId, phase) {
  const queueId = String(bindingId).split('|')[0]
  const previous = mappingCommandQueues.get(queueId) || Promise.resolve()
  const next = previous
    .catch(() => {})
    .then(() => executeMapping(bindingId, phase))
    .catch((error) => {
      ElMessage.error(error?.message || String(error))
    })
    .finally(() => {
      if (mappingCommandQueues.get(queueId) === next)
        mappingCommandQueues.delete(queueId)
    })
  mappingCommandQueues.set(queueId, next)
  return next
}

function releaseActiveMappings() {
  for (const bindingId of activeMappingTouches.keys())
    enqueueMapping(bindingId, 'up')
  for (const [mappingId, state] of activeJoystickStates) {
    for (const key of [...state.keys])
      enqueueMapping(`${mappingId}|${key}`, 'up')
  }
}

function showPopover() {
  // The editor belongs to the transparent overlay window. Its toolbar remains
  // visible below that overlay, so ignore hover there instead of hiding the
  // overlay underneath an unrelated profile popup.
  if (mappingStore.editorOpen || externalEditorOpen.value)
    return false

  return window.$preload.ipcRenderer.invoke('control:show-mapping-popover', {
    // Vue props are proxies and cannot be structured-cloned by Electron IPC.
    // Passing the proxy made every hover/click fail before reaching main.
    device: toRaw(props.device),
    profileCount: mappingStore.config.profiles.length,
    config: JSON.parse(JSON.stringify(toRaw(mappingStore.config))),
  })
}

function hidePopover() {
  window.$preload.ipcRenderer.invoke('control:hide-mapping-popover')
}

function togglePopover() {
  return showPopover()
}

function clamp(value) {
  return Math.max(0, Math.min(1, Number(value) || 0))
}

async function getScreenSize() {
  if (cachedScreenState && Date.now() - cachedScreenStateAt < 1000) {
    return cachedScreenState
  }

  const width = Number(props.device?.screenWidth)
  const height = Number(props.device?.screenHeight)
  const size = width > 0 && height > 0
    ? { width, height }
    : await window.$preload.adb.getScreenSize(props.device.id)

  if (!size?.width || !size?.height) {
    return size
  }

  const orientationText = await window.$preload.adb.deviceShell(
    props.device.id,
    'dumpsys input | grep SurfaceOrientation',
  ).catch(() => '')
  const orientation = Number(orientationText.match(/SurfaceOrientation:\s*(\d+)/)?.[1] || 0)

  cachedScreenState = orientation % 2
    ? { width: size.height, height: size.width }
    : size
  cachedScreenStateAt = Date.now()

  return cachedScreenState
}

async function executeMapping(bindingId, phase = 'down') {
  const [mappingId, pressedKey = ''] = String(bindingId).split('|')
  const activeTouch = activeMappingTouches.get(bindingId)
  const joystickState = activeJoystickStates.get(mappingId)

  if (phase === 'up' && joystickState) {
    const key = String(pressedKey).toUpperCase()
    if (!joystickState.keys.delete(key))
      return false

    if (joystickState.keys.size === 0) {
      activeJoystickStates.delete(mappingId)
      await window.$preload.adb.deviceShell(
        props.device.id,
        `input touchscreen motionevent UP ${joystickState.current.x} ${joystickState.current.y}`,
      )
      return true
    }

    let offsetX = 0
    let offsetY = 0
    for (const activeKey of joystickState.keys) {
      const vector = joystickState.directions[activeKey]
      offsetX += vector?.[0] || 0
      offsetY += vector?.[1] || 0
    }
    const magnitude = Math.hypot(offsetX, offsetY)
    if (magnitude > joystickState.distance) {
      offsetX = Math.round(offsetX * joystickState.distance / magnitude)
      offsetY = Math.round(offsetY * joystickState.distance / magnitude)
    }
    joystickState.current = {
      x: joystickState.start.x + offsetX,
      y: joystickState.start.y + offsetY,
    }
    await window.$preload.adb.deviceShell(
      props.device.id,
      `input touchscreen motionevent MOVE ${joystickState.current.x} ${joystickState.current.y}`,
    )
    return true
  }

  if (phase === 'up' && activeTouch) {
    activeMappingTouches.delete(bindingId)
    await window.$preload.adb.deviceShell(
      props.device.id,
      `input touchscreen motionevent UP ${activeTouch.x} ${activeTouch.y}`,
    )
    return true
  }

  if (phase !== 'down'
    || activeTouch
    || mappingStore.editorOpen
    || externalEditorOpen.value
    || !windowFocused.value) {
    return false
  }

  if (mappingId === '__keyboard-mapping-escape__') {
    if (props.device?.id) {
      await window.$preload.adb.deviceShell(props.device.id, 'input keyevent 4')
    }
    return true
  }

  const mapping = mappingStore.activeProfile?.mappings.find(item => item.id === mappingId)

  if (!mapping?.enabled || !props.device?.id) {
    return false
  }

  if (textInputActive.value || await isTextInputActive()) {
    return false
  }

  const size = await getScreenSize()

  if (!size?.width || !size?.height) {
    throw new Error('Unable to resolve the device screen size')
  }

  const point = (x, y) => ({
    x: Math.round(clamp(x) * size.width),
    y: Math.round(clamp(y) * size.height),
  })

  const start = point(mapping.x, mapping.y)
  let command = ''
  let releasePoint

  if (mapping.type === 'swipe') {
    const end = point(mapping.endX, mapping.endY)
    releasePoint = end
    command = `input touchscreen motionevent DOWN ${start.x} ${start.y}; input touchscreen motionevent MOVE ${end.x} ${end.y}`
  }
  else if (mapping.type === 'joystick') {
    const distance = Math.max(24, Math.round((Number(mapping.dragDistance) || 0.14) * Math.min(size.width, size.height)))
    const key = String(pressedKey || mapping.accelerator || '').toUpperCase()
    const directions = {
      [String(mapping.upKey || 'W').toUpperCase()]: [0, -distance],
      [String(mapping.downKey || 'S').toUpperCase()]: [0, distance],
      [String(mapping.leftKey || 'A').toUpperCase()]: [-distance, 0],
      [String(mapping.rightKey || 'D').toUpperCase()]: [distance, 0],
    }
    const vector = directions[key]
    if (!vector)
      return false

    const state = joystickState || {
      start,
      current: start,
      distance,
      directions,
      keys: new Set(),
    }
    state.keys.add(key)
    let offsetX = 0
    let offsetY = 0
    for (const activeKey of state.keys) {
      const activeVector = state.directions[activeKey]
      offsetX += activeVector?.[0] || 0
      offsetY += activeVector?.[1] || 0
    }
    const magnitude = Math.hypot(offsetX, offsetY)
    if (magnitude > state.distance) {
      offsetX = Math.round(offsetX * state.distance / magnitude)
      offsetY = Math.round(offsetY * state.distance / magnitude)
    }
    state.current = {
      x: state.start.x + offsetX,
      y: state.start.y + offsetY,
    }
    activeJoystickStates.set(mappingId, state)
    command = joystickState
      ? `input touchscreen motionevent MOVE ${state.current.x} ${state.current.y}`
      : `input touchscreen motionevent DOWN ${state.start.x} ${state.start.y}; input touchscreen motionevent MOVE ${state.current.x} ${state.current.y}`
  }
  else if (mapping.type === 'rapidTap') {
    const interval = Math.max(20, Math.round(Number(mapping.interval) || 90))
    command = `input tap ${start.x} ${start.y}; sleep 0.${String(interval).padStart(3, '0')}; input tap ${start.x} ${start.y}`
  }
  else if (mapping.type === 'keyevent') {
    command = `input keyevent ${Math.max(0, Math.round(Number(mapping.keyCode) || 0))}`
  }
  else {
    releasePoint = start
    command = `input touchscreen motionevent DOWN ${start.x} ${start.y}`
  }

  if (releasePoint)
    activeMappingTouches.set(bindingId, releasePoint)

  await window.$preload.adb.deviceShell(props.device.id, command)
  return true
}

async function isTextInputActive() {
  if (Date.now() - cachedInputStateAt < 500)
    return cachedInputState
  const result = await window.$preload.adb.deviceShell(
    props.device.id,
    'dumpsys input_method | grep -E "mInputShown|mShowRequested"',
  ).catch(() => '')
  cachedInputState = /mInputShown=true|mShowRequested=true/.test(result)
  cachedInputStateAt = Date.now()
  return cachedInputState
}

const syncShortcuts = useDebounceFn(async () => {
  const candidates = mappingStore.config.enabled
    && !mappingStore.editorOpen
    && !externalEditorOpen.value
    && !textInputActive.value
    && windowFocused.value
    ? (mappingStore.activeProfile?.mappings || []).flatMap((item) => {
        if (!item.enabled)
          return []
        if (item.type === 'joystick') {
          return [item.upKey, item.downKey, item.leftKey, item.rightKey]
            .filter(Boolean)
            .map(key => ({ id: `${item.id}|${key}`, accelerator: key }))
        }
        return item.accelerator
          ? [{ id: item.id, accelerator: item.accelerator }]
          : []
      })
    : []
  nativeBindingIds = new Map()
  for (const candidate of candidates) {
    const accelerator = String(candidate.accelerator || '').trim()
    if (accelerator && !nativeBindingIds.has(accelerator))
      nativeBindingIds.set(accelerator, candidate.id)
  }

  const nativeActive = await window.$preload.ipcRenderer.invoke(
    'keyboard-mapping:set-native-bindings',
    candidates,
  )
  const mappings = nativeActive ? [] : [...candidates]

  if (!mappingStore.editorOpen
    && !externalEditorOpen.value
    && windowFocused.value
    && props.device?.id) {
    mappings.push({ id: '__keyboard-mapping-escape__', accelerator: 'Escape' })
  }

  const result = await window.$preload.ipcRenderer.invoke('keyboard-mapping:set-active', {
    bindings: mappings.map(item => ({
      id: item.id,
      accelerator: item.accelerator,
    })),
  })

  if (result?.failed?.length) {
    console.warn('[keyboard-mapping] Unable to register:', result.failed.join(', '))
  }
}, 100)

watch(
  () => props.device?.id,
  (deviceId) => {
    if (!deviceId) {
      return
    }

    mappingStore.load(deviceId)
    syncShortcuts()
  },
  { immediate: true },
)

watch(
  () => [mappingStore.config, mappingStore.editorOpen],
  () => {
    if (mappingStore.editorOpen)
      releaseActiveMappings()
    syncShortcuts()
  },
  { deep: true },
)

const removeTriggerListener = window.$preload.ipcRenderer.on(
  'keyboard-mapping:trigger',
  (_event, mappingId) => {
    enqueueMapping(mappingId, 'down')
  },
)

const removeEditorListener = window.$preload.ipcRenderer.on(
  'keyboard-mapping:open-editor',
  () => mappingStore.beginEdit(),
)

const removeNativeKeyListener = window.$preload.ipcRenderer.on(
  'keyboard-mapping:native-key',
  (_event, payload = {}) => {
    const accelerator = String(payload.accelerator || '').trim()
    const bindingId = nativeBindingIds.get(accelerator)
    if (bindingId)
      enqueueMapping(bindingId, payload.phase === 'up' ? 'up' : 'down')
  },
)

const removeProfileListener = window.$preload.ipcRenderer.on(
  'keyboard-mapping:select-profile',
  (_event, profileId) => {
    mappingStore.selectProfile(profileId)
    mappingStore.setEnabled(true)
  },
)

const removeReloadListener = window.$preload.ipcRenderer.on(
  'keyboard-mapping:reload',
  () => {
    if (props.device?.id) {
      mappingStore.load(props.device.id)
      syncShortcuts()
    }
  },
)

const removeEditorStateListener = window.$preload.ipcRenderer.on(
  'keyboard-mapping:editor-state',
  (_event, open) => {
    externalEditorOpen.value = Boolean(open)
    if (externalEditorOpen.value) {
      releaseActiveMappings()
      window.$preload.ipcRenderer.invoke('keyboard-mapping:clear')
      window.$preload.ipcRenderer.invoke('keyboard-mapping:set-native-bindings', [])
    }
    else {
      syncShortcuts()
    }
  },
)

const removeConfigUpdatedListener = window.$preload.ipcRenderer.on(
  'keyboard-mapping:config-updated',
  (_event, payload = {}) => {
    if (payload.deviceId && payload.deviceId !== props.device?.id)
      return
    mappingStore.replaceConfig(payload.config)
    syncShortcuts()
  },
)

const removeRequestSyncListener = window.$preload.ipcRenderer.on(
  'keyboard-mapping:request-sync',
  () => {
    windowFocused.value = document.hasFocus()
    syncShortcuts()
  },
)

function handleWindowBlur() {
  windowFocused.value = false
  releaseActiveMappings()
  window.$preload.ipcRenderer.invoke('keyboard-mapping:clear')
  window.$preload.ipcRenderer.invoke('keyboard-mapping:set-native-bindings', [])
}

function handleWindowFocus() {
  windowFocused.value = true
  syncShortcuts()
}

async function refreshTextInputState() {
  if (!props.device?.id || mappingStore.editorOpen) {
    textInputActive.value = false
    return
  }

  const active = await isTextInputActive()
  if (active !== textInputActive.value) {
    textInputActive.value = active
    if (active)
      releaseActiveMappings()
    syncShortcuts()
  }
}

onMounted(() => {
  window.addEventListener('blur', handleWindowBlur)
  window.addEventListener('focus', handleWindowFocus)
  inputStateTimer = window.setInterval(refreshTextInputState, 400)
  refreshTextInputState()
})

onBeforeUnmount(() => {
  window.removeEventListener('blur', handleWindowBlur)
  window.removeEventListener('focus', handleWindowFocus)
  window.clearInterval(inputStateTimer)
  releaseActiveMappings()
  removeTriggerListener?.()
  removeNativeKeyListener?.()
  removeEditorListener?.()
  removeProfileListener?.()
  removeReloadListener?.()
  removeEditorStateListener?.()
  removeConfigUpdatedListener?.()
  removeRequestSyncListener?.()
  window.$preload.ipcRenderer.invoke('keyboard-mapping:clear')
  window.$preload.ipcRenderer.invoke('keyboard-mapping:set-native-bindings', [])
})
</script>
