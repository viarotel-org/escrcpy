<template>
  <div class="relative z-10">
    <el-button
      class=""
      circle
      size="small"
      :title="$t('common.search')"
      @click="openPageModal"
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
  closePageModal()
})

window.electron.ipcRenderer.on('focus-on-search', (event, ret) => {
  openPageModal()
})

function openPageModal() {
  window.findInPageModal.open({ isDark: themeStore.isDark })
}

function closePageModal() {
  window.findInPageModal.close()
}
</script>

<style lang="postcss"></style>
