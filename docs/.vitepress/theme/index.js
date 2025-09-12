// https://vitepress.dev/guide/custom-theme
import './gtag/index.js'
import Layout from './Layout.vue'

import './rainbow.css'
import './vars.css'
import './overrides.css'

/** @type {import('vitepress').Theme} */
export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // ...
  },
}
