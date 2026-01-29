import { sandboxManager } from './helper.js'

export default {
  name: 'service:sandbox',
  order: -100,
  async apply(app) {
    try {
      const result = await sandboxManager.configureSandbox()
      app?.emit?.('sandbox:configured', result)
      return result
    }
    catch (error) {
      console.error('[plugin:sandbox-config] Failed to configure sandbox:', error)
      app?.emit?.('sandbox:config-error', error)
      throw error
    }
  },
}
