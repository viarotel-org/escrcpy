const commandMap = {
  'volume-up': 'input keyevent 24',
  'volume-down': 'input keyevent 25',
  'volume-mute': 'input keyevent 164',
}

const optionList = [
  {
    label: 'device.control.volume-up.name',
    value: 'volume-up',
  },
  {
    label: 'device.control.volume-down.name',
    value: 'volume-down',
  },
  {
    label: 'device.control.volume-mute.name',
    value: 'volume-mute',
  },
]

export function useDeviceVolume({ devices, native } = {}) {
  const normalizedDevices = computed(() => {
    const value = unref(devices)
    const list = Array.isArray(value)
      ? value
      : value
        ? [value]
        : []

    return list.filter(Boolean)
  })

  const deviceIds = computed(() => normalizedDevices.value
    .map(device => device?.id || device)
    .filter(Boolean))

  const options = computed(() => optionList)

  const disabled = computed(() => {
    if (unref(native)) {
      return true
    }

    if (!deviceIds.value.length) {
      return true
    }

    return normalizedDevices.value.some((device) => {
      const status = device?.status
      return status && ['unauthorized', 'offline'].includes(status)
    })
  })

  function handleTrigger() {
    if (!unref(native)) {
      return false
    }

    const channel = 'changeVolume'

    window.$preload.ipcRenderer.once(channel, (event, data) => {
      handleCommand(data)
    })

    window.$preload.ipcRenderer.invoke('open-system-menu', {
      channel,
      options: toRaw(options.value),
    })
  }

  async function handleCommand(value) {
    const command = commandMap[value]
    if (!command || !deviceIds.value.length) {
      return false
    }

    try {
      await Promise.all(deviceIds.value.map(deviceId => window.$preload.adb.deviceShell(deviceId, command)))
    }
    catch (error) {
      console.error('Failed to send volume command:', error.message || error)
    }
  }

  return {
    options,
    disabled,
    handleTrigger,
    handleCommand,
  }
}

export default useDeviceVolume
