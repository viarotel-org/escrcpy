<template>
  <div class="" @click="handleClick">
    <slot />
  </div>
</template>

<script setup>
import { useThemeStore } from '$/store/theme/index.js'

import { useMagicKeys, whenever } from '@vueuse/core'

const themeStore = useThemeStore()

const activeTab = inject('activeTab')

const shortcutTip = 'Ctrl + F'

watch([() => themeStore.value, () => activeTab.value], () => {
  closeSearchModal()
})

function openSearchModal() {
  window.findInPageModal.open({ isDark: themeStore.isDark })
}

const handleClick = openSearchModal

function closeSearchModal() {
  window.findInPageModal.close()
}

const { ctrl_f } = useMagicKeys()

whenever(ctrl_f, () => {
  openSearchModal()
})
</script>

<style lang="postcss"></style>
