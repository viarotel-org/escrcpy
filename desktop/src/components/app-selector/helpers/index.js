export function parseUserList(rawText = '') {
  return rawText
    .split(/\r?\n/)
    .map((line) => {
      const match = line.match(/UserInfo\{(\d+):([^:}]+):/)

      if (!match) {
        return null
      }

      return {
        id: Number(match[1]),
        name: match[2].trim(),
      }
    })
    .filter(Boolean)
}

export function parsePackageList(rawText = '') {
  return new Set(
    rawText
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.startsWith('package:'))
      .map(line => line.replace(/^package:/, '').trim())
      .filter(Boolean),
  )
}

export function parseActivityList(rawText = '') {
  return rawText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && line.includes('/'))
    .map((line) => {
      const activity = line.split(/\s+/).find(value => value.includes('/')) || line
      const [packageName] = activity.split('/', 1)

      return {
        packageName,
        activity,
      }
    })
}
