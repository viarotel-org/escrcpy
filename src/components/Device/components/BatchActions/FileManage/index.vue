<template>
  <el-dropdown :hide-on-click="false" :disabled="loading">
    <div class="">
      <slot :loading="loading" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handlePush(devices)">
          <span class="" title="/sdcard/Download/">
            {{ $t('device.control.file.push') }}
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { useFileActions } from '$/composables/useFileActions/index.js'

const props = defineProps({
  devices: {
    type: Object,
    default: () => null,
  },
})

const { loading, send: handlePush } = useFileActions()
</script>

<style></style>
