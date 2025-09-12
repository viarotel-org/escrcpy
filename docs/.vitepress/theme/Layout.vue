<script setup>
import DefaultTheme from 'vitepress/theme'
import { onMounted } from 'vue'

const { Layout } = DefaultTheme

onMounted(() => {
  console.log('addAds')
  window.addAds?.()
})
</script>

<template>
  <Layout class="">
    <template #aside-ads-before>
      <ins
        class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-5328953201873088"
        data-ad-slot="8736397533"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </template>
  </Layout>
</template>

<style lang="postcss"></style>
