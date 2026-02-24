<template>
  <div
    ref="rootRef"
    class="relative w-full h-full"
    @dragenter.prevent="handleDragEnter"
    @dragleave="handleDragLeave"
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <slot />

    <Transition name="drag-overlay">
      <div
        v-if="isDragging"
        class="absolute inset-2 z-50 flex items-center justify-center rounded-lg border-2 border-dashed border-primary-500 bg-primary-50/80 dark:bg-primary-900/40 backdrop-blur-sm pointer-events-none"
      >
        <div class="flex flex-col items-center gap-3 select-none">
          <el-icon :size="48" class="text-primary-500 dark:text-primary-400">
            <Upload />
          </el-icon>
          <p class="text-base font-semibold text-primary-600 dark:text-primary-300">
            {{ $t('device.control.file.manager.upload.drag.title') }}
          </p>
          <p class="text-sm text-primary-500 dark:text-primary-400 opacity-80">
            {{ $t('device.control.file.manager.upload.drag.subtitle') }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['files-dropped'])

const rootRef = ref(null)

const dragCounter = ref(0)

const isDragging = computed(() => dragCounter.value > 0 && !props.disabled)

function handleDragEnter(event) {
  if (props.disabled) {
    return
  }

  if (!hasFiles(event.dataTransfer)) {
    return
  }

  dragCounter.value += 1
}

function handleDragLeave() {
  if (props.disabled) {
    return
  }

  dragCounter.value = Math.max(0, dragCounter.value - 1)
}

function handleDrop(event) {
  dragCounter.value = 0

  if (props.disabled) {
    return
  }

  const { dataTransfer } = event

  if (!dataTransfer) {
    return
  }

  const fileList = Array.from(dataTransfer.items || [])
    .filter(item => item.kind === 'file')
    .map(item => item.getAsFile())
    .filter(Boolean)

  if (fileList.length === 0) {
    return
  }

  const paths = fileList
    .map(file => window.$preload.getPathForFile(file))
    .filter(Boolean)

  if (paths.length === 0) {
    return
  }

  const filtered = props.accept.length > 0
    ? filterByAccept(paths, props.accept)
    : paths

  if (filtered.length === 0) {
    return
  }

  emit('files-dropped', { files: filtered })
}

function hasFiles(dataTransfer) {
  if (!dataTransfer) {
    return false
  }

  const types = Array.from(dataTransfer.types || [])

  return types.includes('Files')
}

function filterByAccept(paths, accept) {
  const normalizedAccept = accept.map(ext => ext.toLowerCase())

  return paths.filter((p) => {
    const dotIndex = p.lastIndexOf('.')

    if (dotIndex === -1) {
      return false
    }

    const ext = p.substring(dotIndex).toLowerCase()
    return normalizedAccept.includes(ext)
  })
}

onUnmounted(() => {
  dragCounter.value = 0
})
</script>

<style lang="postcss" scoped>
.drag-overlay-enter-active,
.drag-overlay-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.drag-overlay-enter-from,
.drag-overlay-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
