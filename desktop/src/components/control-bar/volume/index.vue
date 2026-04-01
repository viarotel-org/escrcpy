<template>
  <el-dropdown
    :hide-on-click="false"
    :disabled="disabled"
    @command="handleCommand"
  >
    <slot :trigger="handleTrigger" />

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item of options"
          :key="item.value"
          :command="item.value"
        >
          {{ $t(item.label) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { useDeviceVolume } from '$/hooks/useDeviceVolume/index.js'

const props = defineProps({
  device: {
    type: Object,
    default: () => ({}),
  },
  floating: {
    type: Boolean,
    default: false,
  },
})

const { options, disabled, handleTrigger, handleCommand } = useDeviceVolume({
  devices: computed(() => props.device ? [props.device] : []),
  native: computed(() => props.floating),
})
</script>

<style></style>
