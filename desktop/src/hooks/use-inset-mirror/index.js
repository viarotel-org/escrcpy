import { fitDimensions } from 'fit-dimensions'
import * as mirrorConfigs from '$mirror/configs/index.js'

const DEFAULT_SCREEN = { width: 1080, height: 1920 }

export function useInsetMirror() {
  const deviceStore = useDeviceStore()
  const preferenceStore = usePreferenceStore()

  function normalizeDevices(input) {
    return [input]
      .flat()
      .filter(Boolean)
      .map((item) => {
        const deviceId = item?.id ?? item
        const stored = deviceStore.list.find(d => d.id === deviceId) ?? {}
        return {
          ...stored,
          ...(typeof item === 'object' ? item : {}),
          id: deviceId,
        }
      })
      .filter(item => item.id)
  }

  async function resolveScreenSize(device) {
    const width = device?.screenWidth ?? DEFAULT_SCREEN.width
    const height = device?.screenHeight ?? DEFAULT_SCREEN.height
    const landscape = false

    return { width, height, isLandscape: landscape }
  }

  async function resolveDisplay(fallbackSize) {
    const display = await window.$preload.ipcRenderer?.invoke('get-primary-display') ?? {}
    return {
      workArea: display.workArea ?? { width: fallbackSize.width, height: fallbackSize.height },
      scaleFactor: display.scaleFactor ?? 1,
      titleBarHeight: display.titleBarHeight ?? 0,
    }
  }

  function resolveWindowRect({ anchorCfg, screen, fitSize, display }) {
    const { scaleFactor, titleBarHeight } = display

    let cfgWidth = Number(anchorCfg['--window-width']) || 0
    let cfgHeight = Number(anchorCfg['--window-height']) || 0

    if (screen.isLandscape && cfgWidth && cfgHeight) {
      const cfgIsPortrait = cfgHeight > cfgWidth
      if (cfgIsPortrait) {
        ;[cfgWidth, cfgHeight] = [cfgHeight, cfgWidth]
      }
    }

    const windowWidth = cfgWidth || fitSize.width
    const windowHeight = cfgHeight || fitSize.height

    let windowX = fitSize.x
    let windowY = 36 * scaleFactor

    if (typeof anchorCfg['--window-x'] === 'number') {
      windowX = anchorCfg['--window-x']
    }

    if (typeof anchorCfg['--window-y'] === 'number') {
      windowY = anchorCfg['--window-y'] + titleBarHeight - mirrorConfigs.headerHeight
    }

    return {
      windowWidth,
      windowHeight,
      windowX: windowX - mirrorConfigs.windowBorder,
      windowY: windowY - mirrorConfigs.windowBorder,
    }
  }

  async function open(input) {
    const devices = normalizeDevices(input)

    if (!devices.length) {
      return false
    }

    const anchorDevice = devices[0]
    const scrcpyStore = window.$preload.store.get('scrcpy') ?? {}
    const anchorCfg = scrcpyStore[anchorDevice.id] ?? {}

    const screen = await resolveScreenSize(anchorDevice)
    const display = await resolveDisplay(screen)

    const offsetHeight = 48 * display.scaleFactor
    const fitSize = await fitDimensions(
      screen.width,
      screen.height,
      display.workArea.width,
      display.workArea.height - offsetHeight,
    )

    const { windowWidth, windowHeight, windowX, windowY } = resolveWindowRect({
      anchorCfg,
      screen,
      fitSize,
      display,
    })

    window.$preload.win.open('pages/mirror', {
      devices: devices.map(({ id, remark, model }) => ({ id, remark, model })),
      instanceId: devices.map(d => d.id).join(','),
      screenWidth: screen.width,
      screenHeight: screen.height,
      aspectRatio: screen.width / screen.height,
      windowWidth,
      windowHeight,
      windowX,
      windowY,
      command: preferenceStore.scrcpyParameter(anchorDevice.id),
    })

    return true
  }

  return {
    open,
    normalizeDevices,
  }
}

export default useInsetMirror
