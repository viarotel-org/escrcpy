import { ipcxMain } from '@escrcpy/electron-ipcx/main'

import {
  copilotService,
  createChannel,
  createOrGetAgent,
} from './helpers/index.js'

export default {
  name: 'module:copilot:service',
  apply(mainApp) {
    ipcxMain.handle(createChannel('execute'), async (_event, task, options = {}) => {
      return copilotService.execute(task, options)
    })

    ipcxMain.handle(createChannel('stop'), async (_, deviceId, reason) => {
      return copilotService.stop(deviceId, reason)
    })

    ipcxMain.handle(createChannel('destroy'), async (_, deviceId) => {
      return copilotService.destroy(deviceId)
    })

    ipcxMain.handle(createChannel('destroyAll'), async () => {
      return copilotService.destroyAll()
    })

    ipcxMain.handle(createChannel('getSessionByDevice'), async (_, deviceId) => {
      return copilotService.getSessionByDevice(deviceId)
    })

    ipcxMain.handle(createChannel('getActiveSessions'), async () => {
      return copilotService.getActiveSessions()
    })

    ipcxMain.handle(createChannel('checkModelApi'), async (_, config) => {
      const agent = await createOrGetAgent({
        baseUrl: config.baseUrl,
        apiKey: config.apiKey,
        model: config.model,
      })

      return await agent.checkModelApi()
    })

    ipcxMain.handle(createChannel('setIdleTimeout'), async (_, timeout) => {
      copilotService.setIdleTimeout(timeout)
      return true
    })

    return () => {
      const methods = [
        'execute',
        'stop',
        'destroy',
        'destroyAll',
        'getSessionByDevice',
        'getActiveSessions',
        'checkModelApi',
        'setIdleTimeout',
      ]

      methods.forEach((method) => {
        ipcxMain.removeHandler(createChannel(method))
      })
    }
  },
}
