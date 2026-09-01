<template>
  <component
    :is="tag"
    v-if="$slots.prefix"
    class="flex-none"
  >
    <slot name="prefix" />
  </component>

  <component
    :is="tag"
    ref="editableElement"
    v-bind="{
      title: currentValue,
      ...attrs,
    }"
    class="outline-none"
    :class="[
      {
        'cursor-pointer': editable,
        'truncate': !isEditing && truncate,
        'overflow-auto scrollbar-none': isEditing,
        'whitespace-nowrap': nowrap,
      },
      attrs.class,
    ]"
    :contenteditable="isEditing ? 'plaintext-only' : 'false'"
    @input="handleInput"
    @compositionstart="handleCompositionStart"
    @compositionend="handleCompositionEnd"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown="handleKeydown"
    @dblclick="beginEdit"
  />

  <component
    :is="tag"
    v-if="(showEditButton || $slots.suffix) && !isEditing"
    :class="[
      actionsClass,
    ]"
    class="flex-none !*:ml-0"
  >
    <el-button
      v-if="showEditButton"
      type="primary"
      text
      circle
      size="small"
      :aria-label="editButtonLabel"
      @mousedown.prevent
      @click.stop="startEdit"
    >
      <slot name="edit-icon">
        <span class="i-material-symbols:edit-outline" />
      </slot>
    </el-button>

    <slot name="suffix" />
  </component>
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  tag: {
    type: String,
    default: 'span',
  },
  modelValue: {
    type: String,
  },
  defaultValue: {
    type: String,
    default: '',
  },
  editable: {
    type: Boolean,
    default: true,
  },
  editing: {
    type: Boolean,
  },
  showEditButton: {
    type: Boolean,
    default: false,
  },
  actionsClass: {
    type: String,
    default: 'flex-none inline-flex items-center',
  },
  autoFocus: {
    type: Boolean,
    default: true,
  },
  selectAllOnFocus: {
    type: Boolean,
    default: false,
  },
  confirmOnEnter: {
    type: Boolean,
    default: true,
  },
  confirmOnBlur: {
    type: Boolean,
    default: true,
  },
  editButtonLabel: {
    type: String,
    default: 'Edit',
  },
  truncate: {
    type: Boolean,
    default: true,
  },
  nowrap: {
    type: Boolean,
    default: false,
  },
  allowEmpty: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'input',
  'focus',
  'blur',
  'enterEdit',
  'confirm',
  'cancel',
  'update:editing',
])

const attrs = useAttrs()

const editableElement = ref(null)
const internalValue = ref(props.defaultValue)
const originalValue = ref(props.defaultValue)
const isEditing = ref(props.editing ?? !props.showEditButton)
const isComposing = ref(false)

const isControlledValue = computed(() => props.modelValue !== undefined)

const currentValue = computed(() =>
  isControlledValue.value ? props.modelValue : internalValue.value,
)

onMounted(() => {
  syncElement(currentValue.value ?? '')
})

watch(() => props.defaultValue, (value) => {
  if (!isControlledValue.value && !isEditing.value) {
    internalValue.value = value
  }
})

watch(() => props.modelValue, (value) => {
  if (value !== undefined) {
    internalValue.value = value
    syncElement(value, document.activeElement === editableElement.value)
  }
})

watch(() => props.editing, (value) => {
  if (value === undefined || value === isEditing.value) {
    return
  }

  if (value) {
    beginEdit()
  }
  else {
    cancelEdit()
  }
})

function getValue() {
  return editableElement.value?.textContent ?? currentValue.value ?? ''
}

function setValue(value) {
  internalValue.value = value
  emit('update:modelValue', value)
}

function syncElement(value, preserveSelection = false) {
  const element = editableElement.value

  if (!element || element.textContent === value) {
    return
  }

  const selection = preserveSelection ? getSelectionOffsets(element) : null

  element.textContent = value

  if (selection) {
    restoreSelection(element, selection.start, selection.end)
  }
}

function beginEdit() {
  if (!props.editable || isEditing.value) {
    return
  }

  originalValue.value = currentValue.value ?? ''

  isEditing.value = true

  emit('update:editing', true)
  emit('enterEdit', originalValue.value)

  nextTick(() => {
    if (props.autoFocus) {
      editableElement.value?.focus()
    }

    if (props.selectAllOnFocus) {
      selectAll()
    }
  })
}

function startEdit() {
  beginEdit()
}

function finishEdit() {
  isEditing.value = false
  emit('update:editing', false)
}

function confirmEdit() {
  if (!isEditing.value) {
    return
  }

  let value = getValue()

  if (!value.trim() && !props.allowEmpty) {
    value = originalValue.value ?? ''
    syncElement(value)
  }

  setValue(value)

  emit('confirm', value)

  finishEdit()
}

function cancelEdit() {
  if (!isEditing.value) {
    return
  }

  internalValue.value = originalValue.value

  syncElement(originalValue.value)

  emit('cancel', originalValue.value)

  finishEdit()
}

function handleInput(event) {
  const value = getValue()

  internalValue.value = value

  if (isComposing.value) {
    return
  }

  emit('update:modelValue', value)
  emit('input', value, event)
}

function handleCompositionStart() {
  isComposing.value = true
}

function handleCompositionEnd(event) {
  isComposing.value = false

  const value = getValue()

  setValue(value)

  emit('input', value, event)
}

function handleFocus(event) {
  if (isEditing.value && props.selectAllOnFocus) {
    selectAll()
  }

  emit('focus', event)
}

function handleBlur(event) {
  if (isEditing.value && props.confirmOnBlur) {
    confirmEdit()
  }

  editableElement.value?.scrollTo(0, 0)

  emit('blur', event)
}

function handleKeydown(event) {
  if (!isEditing.value) {
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    cancelEdit()
    return
  }

  if (event.key === 'Enter' && props.confirmOnEnter) {
    event.preventDefault()
    confirmEdit()
  }
}

function selectAll() {
  const element = editableElement.value

  if (!element) {
    return
  }

  const range = document.createRange()

  range.selectNodeContents(element)

  const selection = window.getSelection()

  selection?.removeAllRanges()
  selection?.addRange(range)
}

function getSelectionOffsets(element) {
  const selection = window.getSelection()

  if (!selection?.rangeCount) {
    return null
  }

  const range = selection.getRangeAt(0)

  if (!element.contains(range.commonAncestorContainer)) {
    return null
  }

  const startRange = range.cloneRange()

  startRange.selectNodeContents(element)
  startRange.setEnd(range.startContainer, range.startOffset)

  const endRange = range.cloneRange()

  endRange.selectNodeContents(element)
  endRange.setEnd(range.endContainer, range.endOffset)

  return {
    start: startRange.toString().length,
    end: endRange.toString().length,
  }
}

function restoreSelection(element, start, end) {
  const selection = window.getSelection()

  if (!selection) {
    return
  }

  const range = document.createRange()

  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
  )

  let position = 0

  let startNode = null
  let endNode = null

  let startOffset = 0
  let endOffset = 0

  while (walker.nextNode()) {
    const node = walker.currentNode
    const length = node.textContent?.length ?? 0

    if (!startNode && start <= position + length) {
      startNode = node
      startOffset = start - position
    }

    if (!endNode && end <= position + length) {
      endNode = node
      endOffset = end - position
      break
    }

    position += length
  }

  if (!startNode || !endNode) {
    range.selectNodeContents(element)
    range.collapse(false)
  }
  else {
    range.setStart(startNode, startOffset)
    range.setEnd(endNode, endOffset)
  }

  selection.removeAllRanges()
  selection.addRange(range)
}

defineExpose({
  focus: () => editableElement.value?.focus(),
  selectAll,
  startEdit,
  confirm: confirmEdit,
  cancel: cancelEdit,
  element: editableElement,
})
</script>
