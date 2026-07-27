<template>
  <div
    ref="editorRef"
    class="absolute inset-0 z-30 select-none"
    :class="{ 'pointer-events-none': displayOnly }"
    @contextmenu.prevent="displayOnly ? undefined : openCreateMenu($event)"
  >
    <input v-if="!displayOnly" ref="importInputRef" class="hidden" type="file" accept="application/json,.json" @change="importConfig">
    <div v-if="!displayOnly" class="absolute inset-0 bg-black/45 backdrop-blur-[1px]"></div>

    <div v-if="!displayOnly" ref="toolbarRef" class="absolute z-20 w-74 rounded-lg border border-white/20 bg-[#1d1f21]/96 p-2 shadow-2xl" :style="toolbarStyle" @contextmenu.stop>
      <div class="flex items-center gap-2">
        <el-dropdown @command="handleProfileCommand">
          <button class="flex min-w-0 flex-1 items-center justify-between rounded border border-emerald-500/70 px-3 py-1.5 text-left text-emerald-400">
            <span class="truncate">{{ mappingStore.activeProfile?.name }}</span><i class="i-carbon-chevron-down"></i>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="profile in mappingStore.config.profiles" :key="profile.id" :command="`select:${profile.id}`">
                {{ profile.name }}
              </el-dropdown-item>
              <el-dropdown-item divided command="rename">
                编辑名称
              </el-dropdown-item>
              <el-dropdown-item :disabled="mappingStore.config.profiles.length <= 1" command="delete">
                删除方案
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <i ref="toolbarHandleRef" class="i-carbon-draggable cursor-move text-lg text-gray-300"></i>
      </div>
      <div class="mt-2 flex overflow-hidden rounded border border-white/15">
        <button v-for="action in actions" :key="action.id" class="toolbar-action" :disabled="action.disabled" :title="action.label" @click="action.run">
          <span class="text-base leading-none" aria-hidden="true">{{ action.symbol }}</span>
        </button>
      </div>
      <div class="mt-2 border-t border-white/10 pt-2">
        <RangeSlider label="键位透明度" :value="hintOpacityPercent" :min="10" :max="100" :step="5" suffix="%" @change="setHintOpacity" />
      </div>
    </div>

    <div class="absolute inset-0" :style="{ opacity: displayOnly ? mappingStore.config.hintOpacity : 1 }" @click.self="selectedId = ''" @pointermove="dragToken" @pointerup="stopDrag" @pointercancel="stopDrag">
      <button v-for="mapping in visibleMappings" :key="mapping.id" class="mapping-token" :class="{ selected: !displayOnly && selectedId === mapping.id, joystick: mapping.type === 'joystick' }" :style="tokenStyle(mapping)" @contextmenu.stop @pointerdown.stop="startDrag($event, mapping)" @pointerup.stop="stopDrag">
        <template v-if="mapping.type === 'joystick'">
          <span class="joystick-up">{{ mapping.upKey }}</span>
          <span class="joystick-left">{{ mapping.leftKey }}</span>
          <i class="joystick-center i-carbon-game-console"></i>
          <span class="joystick-right">{{ mapping.rightKey }}</span>
          <span class="joystick-down">{{ mapping.downKey }}</span>
        </template>
        <template v-else>
          <i class="mapping-action-icon" :class="tokenIcon(mapping.type)"></i>
          <b class="mapping-key-label">{{ mapping.accelerator || '键' }}</b>
        </template>
      </button>
    </div>

    <div v-if="!displayOnly && selectedMapping && !configPanelHidden" ref="configPanelRef" class="absolute z-20 max-h-[calc(100%-1rem)] max-w-[calc(100%-1rem)] w-88 overflow-y-auto rounded-2xl border border-white/15 bg-[#1d1f21]/98 shadow-2xl" :style="configPanelStyle" @contextmenu.stop>
      <div class="flex items-center gap-2 border-b border-white/12 px-4 py-3">
        <i :class="tokenIcon(selectedMapping.type)"></i><b>{{ typeLabel(selectedMapping.type) }}</b><span class="flex-1"></span><i class="i-carbon-draggable text-lg"></i>
      </div>
      <div class="space-y-3 p-4 text-sm">
        <div class="flex items-center justify-between">
          <span>启用</span><el-switch :model-value="selectedMapping.enabled" @update:model-value="value => update({ enabled: value })" />
        </div>
        <template v-if="selectedMapping.type === 'joystick'">
          <div class="space-y-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3">
            <RangeSlider label="拖动范围" :value="joystickDragRange" :min="2" :max="50" :step="1" suffix="%" @change="setJoystickDragRange" />
            <RangeSlider label="拖动平滑度" :value="selectedMapping.smoothness" :min="0" :max="200" :step="5" suffix="ms" @change="value => update({ smoothness: value })" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <KeyInput label="up" :value="selectedMapping.upKey" @change="value => update({ upKey: value })" /><KeyInput label="down" :value="selectedMapping.downKey" @change="value => update({ downKey: value })" /><KeyInput label="left" :value="selectedMapping.leftKey" @change="value => update({ leftKey: value })" /><KeyInput label="right" :value="selectedMapping.rightKey" @change="value => update({ rightKey: value })" />
          </div>
        </template>
        <template v-else>
          <div>
            <div class="mb-1 text-gray-300">
              触发键
            </div><KeyInput :value="selectedMapping.accelerator" @change="value => update({ accelerator: value })" />
          </div>
          <div v-if="selectedMapping.type === 'swipe'" class="flex gap-1">
            <button v-for="direction in directions" :key="direction" class="flex-1 border border-white/20 py-1" :class="swipeDirection === direction ? 'bg-emerald-600' : ''" @click="setSwipeDirection(direction)">
              {{ direction }}
            </button>
          </div>
          <RangeSlider v-if="selectedMapping.type === 'swipe'" label="距离" :value="swipeDistance" :min="0.05" :max="0.8" :step="0.01" @change="setSwipeDistance" />
          <RangeSlider v-if="selectedMapping.type === 'swipe'" label="持续时间" :value="selectedMapping.duration" :min="16" :max="1000" :step="10" suffix="ms" @change="value => update({ duration: value })" />
          <RangeSlider v-if="selectedMapping.type === 'rapidTap'" label="间隔" :value="selectedMapping.interval" :min="20" :max="500" :step="10" suffix="ms" @change="value => update({ interval: value })" />
        </template>
        <div class="flex justify-end border-t border-white/12 pt-3">
          <button class="rounded bg-white/5 px-3 py-1.5 text-red-400 hover:bg-red-500/15" @click="removeSelected">
            删除
          </button>
        </div>
      </div>
    </div>

    <div v-if="!displayOnly && createMenu.visible" class="absolute z-30 w-60 overflow-hidden rounded-lg bg-[#1d1f21] p-1 shadow-2xl ring-1 ring-white/15" :style="{ left: `${createMenu.left}px`, top: `${createMenu.top}px` }" @contextmenu.stop>
      <button v-for="type in createTypes" :key="type.id" class="flex w-full items-center gap-3 rounded px-3 py-2 text-left hover:bg-emerald-950/60" @click="createMapping(type.id)">
        <i :class="type.icon"></i>{{ type.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import KeyInput from './key-input.vue'
import RangeSlider from './range-slider.vue'

const props = defineProps({
  displayOnly: {
    type: Boolean,
    default: false,
  },
})

const mappingStore = useKeyboardMappingStore()
const editorRef = ref()
const toolbarRef = ref()
const toolbarHandleRef = ref()
const importInputRef = ref()
const configPanelRef = ref()
const selectedId = ref('')
const dragging = ref(null)
const configPanelHidden = ref(false)
const createMenu = reactive({ visible: false, left: 0, top: 0, x: 0.5, y: 0.5 })
const { x, y } = useDraggable(toolbarRef, {
  handle: toolbarHandleRef,
  initialValue: { x: 8, y: 8 },
})
const toolbarStyle = computed(() => ({ transform: `translate(${x.value}px, ${y.value}px)` }))
const mappings = computed(() => mappingStore.activeProfile?.mappings || [])
const visibleMappings = computed(() =>
  props.displayOnly ? mappings.value.filter(mapping => mapping.enabled) : mappings.value,
)
const hintOpacityPercent = computed(() =>
  Math.round((Number(mappingStore.config.hintOpacity) || 0.35) * 100),
)
const selectedMapping = computed(() => mappings.value.find(item => item.id === selectedId.value))
const { width: editorWidth, height: editorHeight } = useElementSize(editorRef)
const { width: toolbarWidth } = useElementSize(toolbarRef)
const { width: configPanelWidth, height: configPanelHeight } = useElementSize(configPanelRef)
let toolbarPositionInitialized = false
watch([editorWidth, toolbarWidth], ([width, menuWidth]) => {
  if (toolbarPositionInitialized || !width || !menuWidth)
    return
  x.value = Math.max(8, Math.round((width - menuWidth) / 2))
  y.value = 8
  toolbarPositionInitialized = true
})
const configPanelStyle = computed(() => {
  const mapping = selectedMapping.value
  const width = editorWidth.value
  const height = editorHeight.value

  if (!mapping || !width || !height)
    return { left: '8px', top: '8px' }

  const margin = 8
  const gap = 12
  const panelWidth = Math.min(configPanelWidth.value || 352, Math.max(1, width - margin * 2))
  const panelHeight = Math.min(configPanelHeight.value || 420, Math.max(1, height - margin * 2))
  const centerX = (mapping.x || 0.5) * width
  const centerY = (mapping.y || 0.5) * height
  const radiusX = mapping.type === 'joystick' ? 68 : 48
  const radiusY = mapping.type === 'joystick' ? 68 : 24
  const spaces = {
    top: centerY - radiusY - margin,
    bottom: height - centerY - radiusY - margin,
    left: centerX - radiusX - margin,
    right: width - centerX - radiusX - margin,
  }
  const preferred = centerY < height / 3
    ? ['bottom', 'right', 'left', 'top']
    : centerY > height * 2 / 3
      ? ['top', 'right', 'left', 'bottom']
      : centerX < width / 2
        ? ['right', 'bottom', 'top', 'left']
        : ['left', 'bottom', 'top', 'right']
  const required = {
    top: panelHeight + gap,
    bottom: panelHeight + gap,
    left: panelWidth + gap,
    right: panelWidth + gap,
  }
  const side = preferred.find(value => spaces[value] >= required[value])
    || preferred.reduce((best, value) =>
      spaces[value] - required[value] > spaces[best] - required[best] ? value : best,
    preferred[0])

  let left = centerX - panelWidth / 2
  let top = centerY - panelHeight / 2

  if (side === 'top')
    top = centerY - radiusY - gap - panelHeight
  else if (side === 'bottom')
    top = centerY + radiusY + gap
  else if (side === 'left')
    left = centerX - radiusX - gap - panelWidth
  else
    left = centerX + radiusX + gap

  left = Math.max(margin, Math.min(width - panelWidth - margin, left))
  top = Math.max(margin, Math.min(height - panelHeight - margin, top))

  return {
    left: `${Math.round(left)}px`,
    top: `${Math.round(top)}px`,
  }
})
const directions = ['up', 'down', 'left', 'right']
const createTypes = [
  { id: 'tap', label: '点击', icon: 'i-carbon-touch-1' },
  { id: 'joystick', label: '摇杆', icon: 'i-carbon-game-console' },
  { id: 'swipe', label: '滑动', icon: 'i-carbon-move' },
  { id: 'rapidTap', label: '连点', icon: 'i-carbon-cursor-1' },
]
const actions = computed(() => [
  { id: 'new', label: '新建', icon: 'i-carbon-add', symbol: '+', run: () => mappingStore.addProfile() },
  { id: 'copy', label: '复制', icon: 'i-carbon-copy', symbol: '⧉', run: () => mappingStore.copyProfile() },
  { id: 'delete', label: '删除', icon: 'i-carbon-trash-can', symbol: '−', disabled: mappingStore.config.profiles.length <= 1, run: () => mappingStore.deleteProfile() },
  { id: 'export', label: '导出', icon: 'i-carbon-upload', symbol: '↑', run: exportConfig },
  { id: 'import', label: '导入', icon: 'i-carbon-download', symbol: '↓', run: () => importInputRef.value?.click() },
  { id: 'save', label: '保存', icon: 'i-carbon-checkmark', symbol: '✓', run: () => mappingStore.saveEdit() },
  { id: 'cancel', label: '取消', icon: 'i-carbon-close', symbol: '×', run: () => mappingStore.cancelEdit() },
])
const swipeDirection = computed(() => {
  const m = selectedMapping.value
  if (!m)
    return 'right'
  const dx = (m.endX || 0) - m.x
  const dy = (m.endY || 0) - m.y
  return Math.abs(dx) >= Math.abs(dy)
    ? (dx >= 0 ? 'right' : 'left')
    : (dy >= 0 ? 'down' : 'up')
})
const swipeDistance = computed(() => {
  const m = selectedMapping.value
  return Math.max(Math.abs((m?.endX || 0) - (m?.x || 0)), Math.abs((m?.endY || 0) - (m?.y || 0)))
})
const joystickDragRange = computed(() =>
  Math.round(Math.max(0.02, Math.min(0.5, Number(selectedMapping.value?.dragDistance) || 0.14)) * 100),
)
function tokenStyle(m) {
  return { left: `${(m.x || 0.5) * 100}%`, top: `${(m.y || 0.5) * 100}%` }
}
function tokenIcon(type) {
  return ({ tap: 'i-carbon-touch-1', joystick: 'i-carbon-game-console', swipe: 'i-carbon-move', rapidTap: 'i-carbon-cursor-1' })[type] || 'i-carbon-touch-1'
}
function typeLabel(type) {
  return createTypes.find(item => item.id === type)?.label || '点击'
}
function update(patch) {
  if (selectedMapping.value)
    mappingStore.updateMapping(selectedMapping.value.id, patch)
}
function setHintOpacity(percent) {
  mappingStore.setHintOpacity(Math.max(10, Math.min(100, Number(percent) || 35)) / 100)
}
function openCreateMenu(event) {
  const rect = editorRef.value.getBoundingClientRect()
  createMenu.x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
  createMenu.y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
  createMenu.left = Math.max(4, Math.min(rect.width - 244, event.clientX - rect.left))
  createMenu.top = Math.max(4, Math.min(rect.height - 180, event.clientY - rect.top))
  createMenu.visible = true
}
function startDrag(event, mapping) {
  dragging.value = {
    id: mapping.id,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
    wasSelected: selectedId.value === mapping.id,
  }
  event.currentTarget.setPointerCapture?.(event.pointerId)
}
function dragToken(event) {
  const drag = dragging.value
  if (!drag || drag.pointerId !== event.pointerId)
    return

  if (!drag.moved) {
    const distance = Math.hypot(
      event.clientX - drag.startX,
      event.clientY - drag.startY,
    )
    if (distance < 4)
      return
    drag.moved = true
    configPanelHidden.value = true
  }

  const rect = editorRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
  const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
  mappingStore.updateMapping(drag.id, { x, y })
}
function stopDrag(event) {
  const drag = dragging.value
  if (!drag || (event?.pointerId !== undefined && drag.pointerId !== event.pointerId))
    return

  dragging.value = null
  selectedId.value = drag.moved
    ? (drag.wasSelected ? drag.id : '')
    : drag.id
  nextTick(() => {
    configPanelHidden.value = false
  })
}
function createMapping(type) {
  const m = mappingStore.addMapping(type, { x: createMenu.x, y: createMenu.y })
  selectedId.value = m.id
  createMenu.visible = false
}
function removeSelected() {
  mappingStore.removeMapping(selectedId.value)
  selectedId.value = ''
}
function setSwipeDirection(direction) {
  const m = selectedMapping.value
  const d = swipeDistance.value || 0.2
  const delta = { up: [0, -d], down: [0, d], left: [-d, 0], right: [d, 0] }[direction]
  update({ endX: Math.max(0, Math.min(1, m.x + delta[0])), endY: Math.max(0, Math.min(1, m.y + delta[1])) })
}
function setSwipeDistance(distance) {
  const m = selectedMapping.value
  const delta = { up: [0, -distance], down: [0, distance], left: [-distance, 0], right: [distance, 0] }[swipeDirection.value]
  update({ endX: Math.max(0, Math.min(1, m.x + delta[0])), endY: Math.max(0, Math.min(1, m.y + delta[1])) })
}
function setJoystickDragRange(percent) {
  update({ dragDistance: Math.max(2, Math.min(50, Number(percent) || 14)) / 100 })
}
async function handleProfileCommand(command) {
  if (command.startsWith('select:'))
    return mappingStore.selectProfile(command.slice(7))
  if (command === 'delete')
    return mappingStore.deleteProfile()
  if (command === 'rename') {
    const { value } = await ElMessageBox.prompt('方案名称', '编辑方案', { inputValue: mappingStore.activeProfile?.name })
    if (value)
      mappingStore.renameProfile(value)
  }
}
async function exportConfig() {
  const data = JSON.stringify(mappingStore.config, null, 2)
  const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `${mappingStore.activeProfile?.name || 'keyboard-mapping'}.json`
  link.click()
  URL.revokeObjectURL(url)
}
async function importConfig(event) {
  try {
    const file = event.target.files?.[0]
    if (!file)
      return
    const text = await file.text()
    const value = JSON.parse(text)
    if (!Array.isArray(value.profiles))
      throw new Error('Invalid keyboard mapping profile')
    mappingStore.replaceConfig(value)
    ElMessage.success('方案已导入')
  }
  catch { ElMessage.error('所选文件不是有效的方案 JSON') }
  finally { event.target.value = '' }
}
</script>

<style scoped>
.toolbar-action {
  @apply flex-1 border-r border-white/15 py-1.5 text-gray-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35;
}
.toolbar-action:last-child {
  @apply border-r-0;
}
.mapping-token {
  position: absolute;
  transform: translate(-50%, -50%);
  color: rgb(243 244 246);
  cursor: move;
  user-select: none;
  transition:
    border-color 120ms ease,
    box-shadow 120ms ease,
    background-color 120ms ease;
}
.mapping-token.selected {
  border-color: rgb(52 211 153 / 90%);
  box-shadow:
    0 0 0 2px rgb(52 211 153 / 65%),
    0 8px 24px rgb(0 0 0 / 35%);
}
.mapping-token:not(.joystick) {
  display: flex;
  min-width: 78px;
  height: 42px;
  align-items: center;
  justify-content: space-between;
  gap: 9px;
  padding: 4px 5px 4px 12px;
  border: 1px solid rgb(226 232 240 / 60%);
  border-radius: 999px;
  background: rgb(19 23 27 / 82%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 7%),
    0 7px 18px rgb(0 0 0 / 34%);
  backdrop-filter: blur(4px);
}
.mapping-action-icon {
  width: 18px;
  height: 18px;
  flex: none;
  font-size: 18px;
  color: rgb(229 231 235);
}
.mapping-key-label {
  display: flex;
  min-width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 999px;
  background: rgb(71 77 85 / 78%);
  box-shadow: inset 0 1px 1px rgb(255 255 255 / 8%);
  color: white;
  font-size: 14px;
  line-height: 1;
}
.mapping-token.joystick {
  width: 124px;
  min-width: 124px;
  height: 124px;
  padding: 0;
  border: 1px solid rgb(226 232 240 / 50%);
  border-radius: 50%;
  background: radial-gradient(circle at 50% 45%, rgb(42 47 52 / 72%), rgb(13 17 20 / 84%));
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 8%),
    0 9px 24px rgb(0 0 0 / 36%);
  backdrop-filter: blur(4px);
}
.mapping-token.joystick span {
  display: flex;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(255 255 255 / 13%);
  border-radius: 50%;
  background: rgb(65 70 76 / 76%);
  box-shadow: inset 0 1px 1px rgb(255 255 255 / 7%);
  color: rgb(229 231 235);
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
}
.mapping-token.joystick .joystick-up {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
}
.mapping-token.joystick .joystick-left {
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
}
.mapping-token.joystick .joystick-center {
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  border: 1px solid rgb(255 255 255 / 70%);
  border-radius: 50%;
  background: rgb(44 49 55 / 82%);
  box-shadow: inset 0 1px 1px rgb(255 255 255 / 8%);
  font-size: 22px;
  line-height: 1;
}
.mapping-token.joystick .joystick-right {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
}
.mapping-token.joystick .joystick-down {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
