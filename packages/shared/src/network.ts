export function isIPWithPort(ip: string): boolean {
  return /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d):(1\d{0,4}|[1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(ip)
}

export function isIpv6(value: string): boolean {
  return /:/.test(value.replace(/^\[|\]$/g, ''))
}
