import { contextBridge } from 'electron'
import exposes from './exposes/index.js'
import './loading/index.js'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

exposes.init(exposeContext)

function exposeContext(key, value) {
  if (process.contextIsolated) {
    try {
      contextBridge.exposeInMainWorld(key, value)
    }
    catch (error) {
      console.error(error)
    }
  }
  else {
    window[key] = value
  }
}
