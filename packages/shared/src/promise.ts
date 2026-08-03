export function allSettledWrapper<T, R>(list: T[] = [], iterator: (item: T, index: number) => Promise<R> | R) {
  return Promise.allSettled(list.map((item, index) => iterator(item, index)))
}
