<template>
  <slot :trigger="handleClick" />
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
})

const themeStore = useThemeStore()

watch([() => themeStore.value], () => {
  closeSearchModal()
})

function openSearchModal() {
  window.$preload.search.open({ isDark: themeStore.isDark })
}

const handleClick = openSearchModal

function closeSearchModal() {
  window.$preload.search.close()
}

const { ctrl_f } = useMagicKeys()

whenever(ctrl_f, () => {
  openSearchModal()
})
</script>

<style lang="postcss"></style>
