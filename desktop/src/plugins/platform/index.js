import { isPlatform } from '$/utils/index.js'

export default {
  install(app) {
    window.$platform = {
      is: isPlatform,
    }
    app.config.globalProperties.$platform = window.$platform
  },
}
