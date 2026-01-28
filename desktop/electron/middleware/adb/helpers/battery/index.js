import { camelCase } from 'lodash-es'
/**
 * Parse ADB battery dump data into a structured object
 *
 * @param {string} dumpData - Raw battery dump data from ADB
 * @returns {Object} Parsed and normalized battery data
 *
 * // Example usage:
 * const dumpData = fs.readFileSync('battery-dump.txt', 'utf8');
 * const batteryInfo = parseBatteryDump(dumpData);
 * console.log(batteryInfo);
 *
 */
export function parseBatteryDump(dumpData) {
  // Helper to convert string values to appropriate types
  const parseValue = (value) => {
    value = value.trim()

    // Handle booleans
    if (value.toLowerCase() === 'true')
      return true
    if (value.toLowerCase() === 'false')
      return false

    // Handle numbers
    if (!Number.isNaN(Number(value)) && value !== '') {
      return Number(value)
    }

    return value
  }

  const result = {
    raw: {},
    computed: {},
  }

  // Split into lines and process each line
  const lines = dumpData.split('\n').filter(line => line.trim())

  lines.forEach((line) => {
    if (line.includes('Battery Service state:')) {
      return
    }

    // Parse key-value pairs
    const separatorIndex = line.indexOf(':')
    if (separatorIndex === -1)
      return

    const key = line.substring(0, separatorIndex).trim()
    const value = line.substring(separatorIndex + 1).trim()

    // Skip empty key/values
    if (!key || !value)
      return

    // Convert key to camelCase
    const camelKey = camelCase(key)

    // Add to appropriate section
    result.raw[camelKey] = parseValue(value)
  })

  // Add computed values
  result.computed = {
    // Convert temperatures to actual degrees
    temperatureCelsius: result.raw.temperature ? result.raw.temperature / 10 : null,

    // Battery percentage normalized to 0-100
    batteryPercentage: result.raw.level || 0,

    // Charging state as string
    isCharging: !!(result.raw.usbPowered || result.raw.acPowered
      || result.raw.wirelessPowered || result.raw.dockPowered),

    // Voltage in V instead of mV
    voltageV: result.raw.voltage ? result.raw.voltage / 1000 : null,

    // Power source type
    powerSource: result.raw.acPowered
      ? 'AC'
      : result.raw.usbPowered
        ? 'USB'
        : result.raw.wirelessPowered
          ? 'Wireless'
          : result.raw.dockPowered ? 'Dock' : 'Battery',
  }

  return result
}
