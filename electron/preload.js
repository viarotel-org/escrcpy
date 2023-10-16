import exposes from './exposes/index.js'
import { exposeContext } from './helpers/index.js'
import './loading/index.js'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

exposes.init(exposeContext)
