<script setup>
import DefaultTheme from 'vitepress/theme'
import { nextTick, watch } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()

const { Layout } = DefaultTheme

async function addAds() {
  await nextTick()
  try {
    // @ts-expect-error Google Ads
    ;(adsbygoogle = window.adsbygoogle || []).push({})
  }
  catch (e) {
    console.warn('adsbygoogle error:', e)
  }
}

watch(() => page.value.relativePath, addAds, {
  immediate: true,
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
