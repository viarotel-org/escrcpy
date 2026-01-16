export function getFinishMessage(result: any): string {
  const actionMessage = result?.action?._metadata === 'finish' ? (result.action as any).message : undefined
  return result?.message || actionMessage || result?.thinking || 'Task completed'
}
