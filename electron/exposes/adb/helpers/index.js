import ipRegex from 'ip-regex'

/**
 * Determine whether it is an ipv6 address
 */
export function isIpv6(string) {
  return ipRegex.v6().test(string)
}
