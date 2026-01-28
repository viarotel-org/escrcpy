export class FindInPageManager {
  constructor(webContents) {
    this.webContents = webContents
    this.text = ''
  }

  update({ webContents } = {}) {
    this.webContents = webContents
  }

  async start({ text, args = {} } = {}) {
    this.text = text

    this.webContents.on('found-in-page', (event, result) => {
      console.log('found-in-page.result', result)
    })

    return this.webContents.findInPage(this.text, { findNext: false, ...args })
  }

  async next({ ...args } = {}) {
    return this.webContents.findInPage(this.text, {
      forward: true,
      findNext: true,
      ...args,
    })
  }

  async prev({ ...args } = {}) {
    return this.webContents.findInPage(this.text, {
      forward: false,
      findNext: true,
      ...args,
    })
  }

  async stop(action = 'clearSelection') {
    return this.webContents.stopFindInPage(action)
  }
}
