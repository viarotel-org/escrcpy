export class ImmersiveTitleBar {
  win

  get settings() {
    return {
      ...(['win32', 'linux'].includes(process.platform)
        ? {
            frame: false,
          }
        : {
            titleBarStyle: 'hidden',
          }),
    }
  }

  register(win) {
    this.win = win
  }
}
