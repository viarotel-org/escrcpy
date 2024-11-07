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

/**
 * Parse scrcpy codec output into structured data
 * @param {*} rawText
 * @returns
 */
export function parseScrcpyCodecList(rawText) {
  try {
    const result = {
      video: [],
      audio: [],
    }

    const lines = rawText.split('\n')

    for (const line of lines) {
      const trimmedLine = line.trim()

      if (!trimmedLine || !trimmedLine.startsWith('--')) {
        continue
      }

      const pairs = trimmedLine.match(/--[\w-]+=[\w.-]+/g)
      if (!pairs || pairs.length < 2)
        continue

      const info = pairs.reduce((acc, pair) => {
        const [key, value] = pair.substring(2).split('=')
        acc[key] = value
        return acc
      }, {})

      if (info['video-codec'] && info['video-encoder']) {
        result.video.push({
          type: 'video',
          codec: info['video-codec'],
          encoder: info['video-encoder'],
        })
      }
      else if (info['audio-codec'] && info['audio-encoder']) {
        result.audio.push({
          type: 'audio',
          codec: info['audio-codec'],
          encoder: info['audio-encoder'],
        })
      }
    }

    if (result.video.length === 0 && result.audio.length === 0) {
      throw new Error('No valid codec information found in the log content')
    }

    return result
  }
  catch (error) {
    console.error('Error parsing codec information:', error)
    return {
      video: [],
      audio: [],
      error: error.message,
    }
  }
}
