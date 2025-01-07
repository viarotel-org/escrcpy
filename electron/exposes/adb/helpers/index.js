import ipRegex from 'ip-regex'

/**
 * Determine whether it is an ipv6 address
 */
export function isIpv6(string) {
  return ipRegex.v6().test(string)
}

/**
 * Square brackets for IPV6 address
 */
export function ipv6Wrapper(string) {
  return isIpv6(string) ? `[${string}]` : string
}
