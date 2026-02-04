<template>
  <el-config-provider :locale="locale" :size="getSize">
    <div class=""></div>
    <WindowControls v-if="isPlatform('windows') || isPlatform('linux')" />
  </el-config-provider>
</template>

<script setup>
import WindowControls from '$/components/window-controls/index.vue'

const { queryParams: currentDevice, locale, getSize } = useWindowStateSync()

onMounted(() => {})
</script>

<style lang="postcss">
</style>
