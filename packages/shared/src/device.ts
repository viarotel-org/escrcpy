export function parseDeviceId(value = ''): { host: string, port: number } {
  if (!value.trim())
    return { host: '', port: 5555 }
  const input = value.trim()
  const match = input.match(/^\[([^\]]+)\](?::(\d+))?$/) ?? input.match(/^(.+?)(?::(\d+))?$/)
  if (!match)
    return { host: input, port: 5555 }
  const host = input.startsWith('[') ? `[${match[1]}]` : match[1]
  const candidate = match[2] ? Number.parseInt(match[2], 10) : 5555
  return { host, port: candidate > 0 && candidate <= 65535 ? candidate : 5555 }
}

export function normalizeDeviceHost(host = ''): string {
  return String(host).trim().replace(/^\[(.*)\]$/, '$1').toLowerCase()
}

export function createDeviceAddressKey(host: string, port = 5555): string {
  const normalized = normalizeDeviceHost(host)
  return normalized ? `${normalized}:${Number(port) || 5555}` : ''
}
