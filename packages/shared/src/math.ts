export function preciseAdd(a: number, b: number): number {
  return (Math.round(a * 100) + Math.round(b * 100)) / 100
}
