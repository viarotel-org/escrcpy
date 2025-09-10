// 加载 Google Analytics 分析工具

const GoogleAnalyticsId = 'G-24PQ0ZF4RG'
if (!import.meta.env.SSR) {
  (async () => {
    const { install, gtag } = await import('ga-gtag').catch(e =>
      console.error(e))

    install(GoogleAnalyticsId)
    gtag('js', new Date())
    gtag('config', GoogleAnalyticsId)
  })()
}
