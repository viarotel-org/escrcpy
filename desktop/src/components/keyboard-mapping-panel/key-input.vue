<template>
  <label class="block">
    <span v-if="label" class="mb-1 block text-xs text-gray-400">{{ label }}</span>
    <button
      ref="buttonRef"
      type="button"
      class="flex min-h-10 w-full items-center gap-2 rounded border px-3 text-left outline-none transition-colors"
      :class="recording ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300' : 'border-white/20 bg-black/10 text-gray-100 hover:border-white/35'"
      @click="beginRecording"
      @keydown="captureKey"
      @keyup="captureModifierRelease"
      @blur="recording = false"
    >
      <i class="i-carbon-keyboard flex-none"></i>
      <span class="min-w-0 flex-1 truncate">{{ displayValue }}</span>
      <span class="flex-none text-xs text-gray-500">{{ recording ? '请按键…' : '点击改键' }}</span>
    </button>
  </label>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['change'])
const buttonRef = ref()
const recording = ref(false)
const pendingModifier = ref('')

const displayValue = computed(() => {
  if (recording.value)
    return '等待输入'
  return props.value ? props.value.split('+').join(' + ') : '未设置'
})

const keyNames = {
  ' ': 'Space',
  'ArrowUp': 'Up',
  'ArrowDown': 'Down',
  'ArrowLeft': 'Left',
  'ArrowRight': 'Right',
  'Esc': 'Escape',
}

function beginRecording() {
  recording.value = true
  pendingModifier.value = ''
  nextTick(() => buttonRef.value?.focus())
}

function captureKey(event) {
  if (!recording.value)
    return

  event.preventDefault()
  event.stopPropagation()

  const modifiers = []
  if (event.ctrlKey)
    modifiers.push('Ctrl')
  if (event.altKey)
    modifiers.push('Alt')
  if (event.shiftKey)
    modifiers.push('Shift')
  if (event.metaKey)
    modifiers.push('Meta')

  const rawKey = keyNames[event.key] || event.key
  const modifier = {
    Control: 'Ctrl',
    Alt: 'Alt',
    Shift: 'Shift',
    Meta: 'Meta',
  }[rawKey]
  // Keep a modifier armed for a following key, but commit it on release when
  // it is intended to be a standalone mapping.
  if (modifier) {
    pendingModifier.value = modifier
    return
  }

  const key = rawKey.length === 1 ? rawKey.toUpperCase() : rawKey
  emit('change', [...modifiers, key].join('+'))
  recording.value = false
  pendingModifier.value = ''
  buttonRef.value?.blur()
}

function captureModifierRelease(event) {
  if (!recording.value)
    return

  const modifier = {
    Control: 'Ctrl',
    Alt: 'Alt',
    Shift: 'Shift',
    Meta: 'Meta',
  }[keyNames[event.key] || event.key]

  if (!modifier || modifier !== pendingModifier.value)
    return

  event.preventDefault()
  event.stopPropagation()
  emit('change', modifier)
  recording.value = false
  pendingModifier.value = ''
  buttonRef.value?.blur()
}
</script>
