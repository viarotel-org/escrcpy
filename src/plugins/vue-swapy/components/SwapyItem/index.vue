<template>
  <div
    :data-swapy-slot="slotId"
    class="swapy-slot"
  >
    <div
      :data-swapy-item="itemId"
      class="swapy-item"
    >
      <template v-if="$slots.handle">
        <div data-swapy-handle class="swapy-handle">
          <slot name="handle" />
        </div>
      </template>
      <template v-if="$slots['no-drag']">
        <div data-swapy-no-drag class="swapy-no-drag">
          <slot name="no-drag" />
        </div>
      </template>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { inject, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  slotId: {
    type: String,
    default: '',
  },
  itemId: {
    type: String,
    default: '',
  },
})

const getSwapyInstance = inject('swapyInstance')
// const containerRef = inject('swapyContainer')

const updateSwapy = async () => {
  await nextTick()

  const instance = getSwapyInstance?.()

  if (instance?.value) {
    instance.value.update()
  }
}

onMounted(updateSwapy)
onUnmounted(updateSwapy)
</script>

<style>
.swapy-slot {
}

.swapy-item {
}

.swapy-handle {
  cursor: grab;
}

.swapy-handle:active {
  cursor: grabbing;
}

.swapy-no-drag {
  cursor: default;
}
</style>
