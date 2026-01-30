import { ipcxMain } from '@escrcpy/electron-ipcx/main'

import {
  copilotService,
  createChannel,
  createOrGetAgent,
  safeExecute,
} from './helpers/index.js'

import { adbKeyboardApkPath } from '$electron/configs/index.js'

export default {
  name: 'module:copilot:service',
  apply(ctx) {
    ipcxMain.handle(createChannel('execute'), async (_event, task, options = {}) => {
      return safeExecute('execute', () =>
        copilotService.execute(task, options),
      )
    })

    ipcxMain.handle(createChannel('stop'), async (_, deviceId, reason) =>
      safeExecute('stop', () =>
        copilotService.stop(deviceId, reason),
      ),
    )

    ipcxMain.handle(createChannel('destroy'), async (_, deviceId) =>
      safeExecute('destroy', () =>
        copilotService.destroy(deviceId),
      ),
    )

    ipcxMain.handle(createChannel('destroyAll'), async () =>
      safeExecute('destroyAll', () =>
        copilotService.destroyAll(),
      ),
    )

    ipcxMain.handle(createChannel('getSessionByDevice'), async (_, deviceId) => {
      return copilotService.getSessionByDevice(deviceId)
    })

    ipcxMain.handle(createChannel('getActiveSessions'), async () =>
      copilotService.getActiveSessions(),
    )

    ipcxMain.handle(createChannel('checkKeyboard'), async (_, deviceId) =>
      safeExecute('checkKeyboard', async () => {
        const agent = await createOrGetAgent({ deviceId })
        const result = await agent.adb.isKeyboardInstalled()

        // Automatically install if not installed
        if (!result?.success) {
          agent.adb.installKeyboard(adbKeyboardApkPath)
        }

        return result?.success || false
      }),
    )

    ipcxMain.handle(createChannel('installKeyboard'), async (_, deviceId) =>
      safeExecute('installKeyboard', async () => {
        const agent = await createOrGetAgent({ deviceId })
        await agent.adb.installKeyboard(adbKeyboardApkPath)
        return await agent.adb.isKeyboardInstalled()
      }),
    )

    ipcxMain.handle(createChannel('checkModelApi'), async (_, config) =>
      safeExecute('checkModelApi', async () => {
        const agent = await createOrGetAgent({
          baseUrl: config.baseUrl,
          apiKey: config.apiKey,
          model: config.model,
        })
        return await agent.checkModelApi()
      }),
    )

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
        'checkKeyboard',
        'installKeyboard',
        'checkModelApi',
        'setIdleTimeout',
      ]

      methods.forEach((method) => {
        ipcxMain.removeHandler(createChannel(method))
      })
    }
  },
}
