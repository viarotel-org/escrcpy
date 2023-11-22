export function mockAPI({ imitate = {}, delay = 500 } = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: '0000',
        data: imitate,
        success: true,
      })
    }, delay)
  })
}
