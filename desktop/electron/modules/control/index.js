import window from './window.js'
import service from './service.js'

export default {
  name: 'module:control',
  apply(ctx) {
    ctx.use(window)
    ctx.use(service)
  },
}
