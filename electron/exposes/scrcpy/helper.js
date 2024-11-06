import appStore from '$electron/helpers/store.js'
import { replaceIP } from '$renderer/utils/index.js'

/**
 * Parse scrcpy app list output into structured data
 * @param {string} rawText - Raw text output from scrcpy --list-apps command
 * @returns {Array<{
 *   name: string,
 *   packageName: string,
 *   isSystemApp: boolean
 * }>} Array of parsed app objects
 */
export function parseScrcpyAppList(rawText) {
  try {
    // Split by lines and filter out non-app lines
    const lines = rawText.split('\n').filter((line) => {
      const trimmed = line.trim()
      return trimmed.startsWith('*') || trimmed.startsWith('-')
    })

    return lines.map((line) => {
      // Remove leading * or - and trim
      const cleanLine = line.trim().replace(/^[*\-]\s+/, '')

      // Extract app name and package name using a more precise regex
      // Matches any characters up to the last [ followed by package name and ]
      const match = cleanLine.match(/^([^[]+)\[([^\]]+)\]$/)

      if (!match) {
        return null
      }

      const [, name, packageName] = match

      return {
        name: name.trim(),
        packageName: packageName.trim(),
        isSystemApp: line.trim().startsWith('*'),
      }
    }).filter(item => item !== null)
  }
  catch (error) {
    console.error('Error parsing scrcpy app list:', error)
    return []
  }
}

/**
 * Get the --display-overlay value
 * @param {*} serial
 * @returns {string}
 */
export function getDisplayOverlay(serial) {
  const value = appStore.get(`scrcpy.${replaceIP(serial)}.--display-overlay`)
    || appStore.get('scrcpy.global.--display-overlay')
    || ''
  return value
}
