import { createMiddleware } from './middleware/index.js'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

createMiddleware()
