<script setup>
import { computed, nextTick, watch } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()

const relativePath = computed(() => page.value.relativePath)

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

watch(relativePath, addAds, {
  immediate: true,
})
</script>

<template>
  <div style="margin-top: 72px;">
    <ins
      :key="relativePath"
      class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-5328953201873088"
      data-ad-slot="8736397533"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  </div>
</template>
