<template>
  <div class="relative z-10">
    <el-button
      class=""
      circle
      size="small"
      :title="`${$t('common.search')}（Command/Ctrl + F）`"
      @click="openSearchModal"
    >
      <el-icon size="12">
        <ElIconSearch />
      </el-icon>
    </el-button>
  </div>
</template>

<script setup>
import { useThemeStore } from '$/store/theme/index.js'

const themeStore = useThemeStore()

const activeTab = inject('activeTab')

watch([() => themeStore.value, () => activeTab.value], () => {
  closeSearchModal()
})

window.electron.ipcRenderer.on('focus-on-search', (event, ret) => {
  openSearchModal()
})

function openSearchModal() {
  window.findInPageModal.open({ isDark: themeStore.isDark })
}

function closeSearchModal() {
  window.findInPageModal.close()
}
</script>

<style lang="postcss"></style>
