export const CONNECTION_TYPE = {
  USB: 'usb',
  TCPIP: 'tcpip',
} as const

export type ConnectionType = (typeof CONNECTION_TYPE)[keyof typeof CONNECTION_TYPE]
