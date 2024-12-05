import { buildResolve } from '$electron/helpers/index.js'

export const logoPath = buildResolve('logo.png')
export const icoLogoPath = buildResolve('logo.ico')
export const icnsLogoPath = buildResolve('logo.icns')

export function getLogoPath() {
  const icon = logoPath
  return icon
}
