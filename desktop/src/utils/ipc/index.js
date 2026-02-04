import { nanoid } from 'nanoid'

export function ipcRendererHelper() {
  let context = {
    channel: `ipcRendererHelper:${nanoid()}`,

    once(callback) {
      window.$preload.ipcRenderer.once(this.channel, (...args) => {
        callback(...args)
        context = void 0
      })
    },

    on(callback) {
      const listener = (...args) => {
        callback(...args)
      }

      this.ipcRenderer.removeAllListeners(this.channel, listener)

      window.$preload.ipcRenderer.on(this.channel, listener)
    },
  }

  return context
}
