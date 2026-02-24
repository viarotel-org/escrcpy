<template>
  <div
    :class="[
      {
        'pl-20': $platform.is('macos'),
        'pr-[calc(100px+3.6vw)]': $platform.is('windows') || $platform.is('linux'),
      },
    ]"
    class="app-region-drag flex items-center pt-2"
  >
    <div v-if="title || deviceName" class="flex-none  flex items-center gap-4 overflow-hidden">
      <div v-if="title" class="text-sm font-semibold select-none pl-1 -mt-px max-w-36 truncate" :title="title">
        {{ title }}
      </div>

      <el-tag v-if="deviceName" type="primary">
        <div class="flex items-center gap-2">
          <div class="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          {{ deviceName }}
        </div>
      </el-tag>
    </div>

    <div class="flex-1 min-w-0">
      <slot name="default"></slot>
    </div>

    <div v-if="$slots.right" class="flex-none">
      <slot name="right"></slot>
    </div>

    <AppControls v-if="$platform.is('windows') || $platform.is('linux')" />
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
})
</script>

<style>
</style>
