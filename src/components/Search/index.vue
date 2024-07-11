<template>
  <div class="relative z-10">
    <el-button
      class=""
      circle
      size="small"
      :title="`${$t('common.search')}（${shortcutTip}）`"
      @click="openSearchModal"
    >
      <el-icon size="12">
        <ElIconSearch />
      </el-icon>
    </el-button>
  </div>
</template>

<script setup>
import { useMagicKeys, whenever } from '@vueuse/core'

import { useThemeStore } from '$/store/theme/index.js'

const themeStore = useThemeStore()

const activeTab = inject('activeTab')

const shortcutTip = 'Ctrl + F'

watch([() => themeStore.value, () => activeTab.value], () => {
  closeSearchModal()
})

function openSearchModal() {
  window.findInPageModal.open({ isDark: themeStore.isDark })
}

function closeSearchModal() {
  window.findInPageModal.close()
}

const { ctrl_f } = useMagicKeys()

whenever(ctrl_f, () => {
  openSearchModal()
})
</script>

<style lang="postcss"></style>
