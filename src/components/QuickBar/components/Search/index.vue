<template>
  <div class="" @click="handleClick">
    <slot />
  </div>
</template>

<script setup>
const themeStore = useThemeStore()

const activeTab = inject('activeTab')

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
