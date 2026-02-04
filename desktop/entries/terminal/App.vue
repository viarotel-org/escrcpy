<template>
  <el-config-provider :locale="locale" :size="size">
    <div class="">
      {{ currentDevice.name }}
    </div>
    <WindowControls v-if="$platform.is('windows') || $platform.is('linux')" />
  </el-config-provider>
</template>

<script setup>
import WindowControls from '$/components/window-controls/index.vue'

const { queryParams: currentDevice, locale, size } = useWindowStateSync()

onMounted(() => {})
</script>

<style lang="postcss">
</style>
