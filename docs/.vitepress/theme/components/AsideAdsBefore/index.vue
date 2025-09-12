<script setup>
import { useData } from 'vitepress'
import { computed, nextTick, watch } from 'vue'

const { page } = useData()

const relativePath = computed(() => page.value.relativePath)

watch(relativePath, addAds, {
  immediate: true,
})

async function addAds() {
  await nextTick()

  try {
    // @ts-expect-error Google Ads
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    console.log('adsbygoogle loaded')
  }
  catch (e) {
    console.warn('adsbygoogle error:', e)
  }
}
</script>

<template>
  <div style="margin-top: 72px;">
    <ins
      :key="relativePath"
      class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-5328953201873088"
      data-ad-slot="9903011682"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  </div>
</template>
