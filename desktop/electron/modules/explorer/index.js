import window from './window.js'
import service from './service.js'

export default {
  name: 'module:explorer',
  order: 100,
  apply(ctx) {
    ctx.use(window)
    ctx.use(service)
  },
}
