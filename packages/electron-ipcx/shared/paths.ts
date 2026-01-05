import { get, set } from 'es-toolkit/compat'

const pathToken = /(\w+)|(\[(\d+)\])/g

function isNumeric(segment: string | number): boolean {
  return typeof segment === 'number' || /^\d+$/.test(String(segment))
}

export function formatPath(segments: Array<string | number>): string {
  return segments
    .map((segment, index) => {
      if (index === 0) return String(segment)
      return isNumeric(segment) ? `[${segment}]` : `.${segment}`
    })
    .join('')
}

export function parsePath(index: string): Array<string | number> {
  const tokens: Array<string | number> = []
  let match: RegExpExecArray | null
  while ((match = pathToken.exec(index)) !== null) {
    if (match[1]) tokens.push(match[1])
    else if (match[3]) tokens.push(Number(match[3]))
  }
  return tokens
}

export function getByPath(target: unknown, segments: Array<string | number>): unknown {
  return get(target, segments)
}

export function setByPath(target: unknown, segments: Array<string | number>, value: unknown): void {
  set(target as object, segments, value)
}
