import { useDeviceStore } from '$/store/device/index.js'
/**
 * Device management composable
 * Handles loading and managing device data
 */
export function useDeviceManagement() {
  const deviceStore = useDeviceStore()
  const allDevices = ref([])

  async function loadDevices() {
    try {
      await deviceStore.getList()
    }
    catch (error) {
      console.error('Failed to load devices:', error)
      return false
    }

    const devices = deviceStore.list
    allDevices.value = devices.map(item => ({
      ...item,
      name: deviceStore.getLabel(item),
    }))
  }

  return {
    allDevices,
    loadDevices,
  }
}
