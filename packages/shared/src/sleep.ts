export function sleep(time = 500): Promise<boolean> {
  return new Promise(resolve => setTimeout(() => resolve(true), time))
}
