<template>
  <div
    :class="[
      {
        'pl-20': $platform.is('macos') && !controlProps.custom,
        'pr-[calc(70px+3.6vw)]': $platform.is('windows', 'linux') || controlProps.custom,
      },
    ]"
    class="app-region-drag flex items-center pt-2"
  >
    <div v-if="title || deviceName || $slots['device-name']" class="flex-none  flex items-center gap-4 overflow-hidden">
      <div v-if="title" class="text-sm font-semibold select-none pl-1 -mt-px max-w-96 truncate" :title="title">
        {{ title }}
      </div>

      <slot name="device-name">
        <el-tag v-if="deviceName" type="primary">
          <div class="flex items-center gap-2">
            {{ deviceName }}
          </div>
        </el-tag>
      </slot>
    </div>

    <div class="flex-1 min-w-0">
      <slot name="default"></slot>
    </div>

    <div v-if="$slots.right" class="flex-none">
      <slot name="right"></slot>
    </div>

    <AppControls
      v-if="$platform.is('windows', 'linux') || controlProps.custom"
      v-bind="{
        background: controlProps.background,
      }"
    />
  </div>
</template>

<script setup>
import AppControls from '$/components/app-controls/index.vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  deviceName: {
    type: String,
    default: '',
  },
  controlProps: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<style>
</style>
