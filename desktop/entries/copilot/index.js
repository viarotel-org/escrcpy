import TdesignNextChat from '$/plugins/tdesign-next-chat/index.js'
import bootstrap from '$/bootstrap/index.js'

import App from './App.vue'

bootstrap(App, {
  install(app) {
    app.use(TdesignNextChat)
  },
})
