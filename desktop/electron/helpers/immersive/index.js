export class ImmersiveTitleBar {
  win

  get settings() {
    const value = {}

    const platform = import.meta.env.VITE_SIMULATION_PLATFORM ?? process.platform

    if (['win32', 'linux'].includes(platform)) {
      value.frame = false
    }

    if (['darwin'].includes(platform)) {
      value.titleBarStyle = 'hiddenInset'
    }

    return value
  }

  register(win) {
    this.win = win
  }
}
