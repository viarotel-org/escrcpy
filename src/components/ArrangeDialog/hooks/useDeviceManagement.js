import { ref } from 'vue'
import { useDeviceStore } from '$/store/device/index.js'
/**
 * Device management composable
 * Handles loading and managing device data
 */
export function useDeviceManagement() {
  const deviceStore = useDeviceStore()
  const allDevices = ref([])

  const loadDevices = () => {
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
