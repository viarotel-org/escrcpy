export function getErrorMessage(error: any, defaultMessage: string = 'Unknown error') {
  return error instanceof Error ? error.message : defaultMessage
}
