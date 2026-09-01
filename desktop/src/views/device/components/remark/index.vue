<template>
  <div class="relative flex items-center group">
    <Contenteditable
      :key="contenteditableKey"
      :model-value="modelValue"
      nowrap
      show-edit-button
      select-all-on-focus
      allow-empty
      actions-class="group-hover:inline-flex hidden"
      @confirm="onConfirm"
    />
  </div>
</template>

<script setup>
import Contenteditable from '$/components/contenteditable/index.vue'

const props = defineProps({
  device: {
    type: Object,
    default: () => ({}),
  },
})

const deviceStore = useDeviceStore()

const modelValue = computed(() => props.device.remark || props.device.name)

const contenteditableKey = ref(0)

function onConfirm(value) {
  deviceStore.setRemark(props.device.id, value)

  // If the value is empty, we need to force re-render the Contenteditable component to show the original value (device name) instead of an empty string.
  if (!value) {
    ++contenteditableKey.value
  }
}
</script>

<style></style>
