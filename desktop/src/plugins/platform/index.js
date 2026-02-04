import { isPlatform } from '$/utils/index.js'

export default {
  install(app) {
    app.config.globalProperties.$platform = {
      is: isPlatform,
    }
  },
}
