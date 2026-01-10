<template>
  <div ref="containerRef">
    <slot />
  </div>
</template>

<script setup>
import { createSwapy } from 'swapy'

const props = defineProps({
  enabled: {
    type: Boolean,
    default: true,
  },
  config: {
    type: Object,
    default: () => ({}),
  },
  onBeforeSwap: {
    type: Function,
    default: void 0,
  },
})

const emit = defineEmits(['swap', 'swap-start', 'swap-end'])

const containerRef = ref()
const swapyInstance = shallowRef(null)

provide('swapyInstance', () => swapyInstance)
provide('swapyContainer', containerRef)

// Watch enabled changes
watch(() => props.enabled, (newEnabled) => {
  if (swapyInstance.value) {
    swapyInstance.value.enable(newEnabled)
  }
})

// Watch config changes and reinitialize
watch(() => props.config, () => {
  destroySwapy()
  initSwapy()
}, { deep: true })

onMounted(initSwapy)
onUnmounted(destroySwapy)

async function initSwapy() {
  await nextTick()

  if (!containerRef.value)
    return

  try {
    swapyInstance.value = createSwapy(containerRef.value, props.config)

    swapyInstance.value.onSwapStart(event => emit('swap-start', event))

    swapyInstance.value.onSwap(event => emit('swap', event))

    swapyInstance.value.onSwapEnd(event => emit('swap-end', event))

    swapyInstance.value.onBeforeSwap((event) => {
      if (props.onBeforeSwap) {
        return props.onBeforeSwap(event)
      }

      return true
    })

    // Set enabled state
    swapyInstance.value.enable(props.enabled)
  }
  catch (error) {
    console.error('Failed to initialize Swapy:', error)
  }
}

function destroySwapy() {
  if (swapyInstance.value) {
    swapyInstance.value.destroy()
    swapyInstance.value = null
  }
}

defineExpose({
  getInstance: () => swapyInstance,
  update: () => swapyInstance.value?.update(),
  getSlotItemMap: () => swapyInstance.value?.slotItemMap(),
  enable: enabled => swapyInstance.value?.enable(enabled),
})
</script>
