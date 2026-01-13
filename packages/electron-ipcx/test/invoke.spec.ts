import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ipcxMain } from '../main'
import { ipcxRenderer } from '../renderer'

const rendererListeners = new Map<string, Set<(...args: unknown[]) => void>>()
const ipcMainHandlers = new Map<string, (...args: unknown[]) => unknown>()

vi.mock('electron', () => {
  const sender = {
    send: vi.fn((channel: string, ...args: unknown[]) => {
      const listeners = rendererListeners.get(channel)
      if (!listeners)
        return
      listeners.forEach(listener => listener({}, ...args))
    }),
  }

  const ipcRenderer = {
    invoke: vi.fn(async (channel: string, payload: unknown) => {
      const handler = ipcMainHandlers.get(channel)
      if (!handler)
        throw new Error(`No handler for channel ${channel}`)
      return handler({ sender }, payload)
    }),
    on: vi.fn((channel: string, listener: (...args: unknown[]) => void) => {
      const listeners = rendererListeners.get(channel) ?? new Set()
      listeners.add(listener)
      rendererListeners.set(channel, listeners)
    }),
    removeListener: vi.fn((channel: string, listener: (...args: unknown[]) => void) => {
      const listeners = rendererListeners.get(channel)
      if (!listeners)
        return
      listeners.delete(listener)
      if (!listeners.size)
        rendererListeners.delete(channel)
    }),
  }

  const ipcMain = {
    handle: vi.fn((channel: string, handler: (...args: unknown[]) => unknown) => {
      ipcMainHandlers.set(channel, handler)
    }),
  }

  return { ipcRenderer, ipcMain }
})

beforeEach(() => {
  rendererListeners.clear()
  ipcMainHandlers.clear()
})

describe('ipcx invoke', () => {
  it('proxies function arguments and auto disposes', async () => {
    const callback = vi.fn()

    ipcxMain.handle('test-channel', (_event, payload: { cb: (...args: unknown[]) => void }) => {
      payload.cb('ok')
      return 'done'
    })

    const result = await ipcxRenderer.invoke<string>('test-channel', { cb: callback })

    expect(result).toBe('done')
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('ok')
    expect(rendererListeners.size).toBe(0)
  })

  it('supports manual disposal', async () => {
    const callback = vi.fn()

    ipcxMain.handle('retain-channel', (_event, payload: { cb: (...args: unknown[]) => void }) => {
      payload.cb('persist')
      return 'kept'
    })

    const { promise, dispose } = ipcxRenderer.invokeRetained<string>('retain-channel', { cb: callback })

    const result = await promise
    expect(result).toBe('kept')
    expect(callback).toHaveBeenCalledWith('persist')
    expect(rendererListeners.size).toBe(1)

    dispose()
    expect(rendererListeners.size).toBe(0)
  })
})
