import { groupBy } from 'lodash-es'

export class DeviceSelectionHelper {
  options = {
    nothrow: false,
    message: true,
  }

  filter(devices, method, options) {
    this.options = {
      ...this.options,
      ...(options || {}),
    }

    if (!method) {
      return devices
    }

    return this[method](devices)
  }

  check(devices) {
    if (!devices.length && !this.options.nothrow) {
      if (this.options.message) {
        ElMessage.warning(window.t('device.selection.error.online'))
      }

      throw new Error(window.t('device.selection.error.online'))
    }
  }

  online(devices) {
    const value = devices.filter(item => ['emulator', 'device'].includes(item.status))

    this.check(value)

    return value
  }

  onlineAndUnique(devices) {
    const onlineDevices = this.online(devices)

    const groupDevices = Object.values(groupBy(onlineDevices, 'serialNo'))

    const value = groupDevices.reduce((arr, group) => {
      if (group.length > 2) {
        const usbDevice = group.find(item => item.serialNo === item.id)
        arr.push(usbDevice || group[0])
      }
      else {
        arr.push(group[0])
      }

      return arr
    }, [])

    this.check(value)

    return value
  }
}

export const deviceSelectionHelper = new DeviceSelectionHelper()
