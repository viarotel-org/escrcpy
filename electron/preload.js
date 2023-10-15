import plugins from './plugins/index.js'
import { exposeContext } from './helpers/index.js'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

plugins.install(exposeContext)
