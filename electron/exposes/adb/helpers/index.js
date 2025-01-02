import ipRegex from 'ip-regex'

/**
 * Square brackets for IPV6 address
 */
export function ipv6Wrapper(string) {
  return ipRegex.v6().test(string) ? `[${string}]` : string
}
