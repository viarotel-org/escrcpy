import Swapy from './components/Swapy/index.vue'
import SwapyItem from './components/SwapyItem/index.vue'

export default {
  install(app) {
    app.component('Swapy', Swapy)
    app.component('SwapyItem', SwapyItem)
  },
}
