export function resolveMainWindow(appContext) {
  const injected = appContext?.inject?.('modules:main')

  if (injected) {
    return Promise.resolve(injected)
  }

  return new Promise((resolve) => {
    if (!appContext?.once) {
      resolve(undefined)
      return
    }

    appContext.once('window:main:ready', (win) => {
      resolve(win)
    })
  })
}
