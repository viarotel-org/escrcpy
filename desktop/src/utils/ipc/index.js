import { nanoid } from 'nanoid'

export function ipcRendererHelper() {
  let context = {
    channel: `ipcRendererHelper:${nanoid()}`,

    once(callback) {
      window.electron.ipcRenderer.once(this.channel, (...args) => {
        callback(...args)
        context = void 0
      })
    },

    on(callback) {
      const listener = (...args) => {
        callback(...args)
      }

      this.ipcRenderer.removeAllListeners(this.channel, listener)

      window.electron.ipcRenderer.on(this.channel, listener)
    },
  }

  return context
}
