import appStore from '$electron/helpers/store.js'

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
  if (typeof rawText !== 'string') {
    throw new TypeError('scrcpy content must be a string')
  }

  return rawText
    .split('\n')
    .filter(line => line.startsWith(' * ') || line.startsWith(' - '))
    .map((line) => {
      const isSystemApp = line.startsWith(' * ')
      // Remove prefix and trim
      const content = line.substring(3).trim()
      // Find last space to separate name and package
      const lastSpaceIndex = content.lastIndexOf(' ')

      return {
        name: content.substring(0, lastSpaceIndex).trim(),
        packageName: content.substring(lastSpaceIndex + 1).trim(),
        isSystemApp,
      }
    })
}

/**
 * Get the --display-overlay value
 * @param {*} serial
 * @returns {string}
 */
export function getDisplayOverlay(serial) {
  const value = appStore.get('scrcpy')?.[serial]?.['--display-overlay']
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

/**
 * Gets a list of available display ids
 * @param {*} text
 * @returns
 */
export function parseDisplayIds(text) {
  if (!text || typeof text !== 'string') {
    return []
  }

  try {
    const displayIdPattern = /--display-id=(\d+)/g

    const matches = Array.from(text.matchAll(displayIdPattern))

    const displayIds = matches.map(match => Number.parseInt(match[1], 10))

    const uniqueDisplayIds = [...new Set(displayIds)].filter(id => !Number.isNaN(id))

    return uniqueDisplayIds.sort((a, b) => a - b)
  }
  catch (error) {
    console.error('Error parsing display IDs:', error)
    return []
  }
}
