<script client>
document.addEventListener('DOMContentLoaded', () => {
  addAds()
})

function addAds() {
  try {
    // @ts-expect-error Google Ads
    ;(adsbygoogle = window.adsbygoogle || []).push({})
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
      class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-5328953201873088"
      data-ad-slot="9903011682"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  </div>
</template>
