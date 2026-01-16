import { isLinux, isMacOS, isWindows } from 'std-env'

export function getSystem() {
  if (isMacOS) {
    return 'macOS'
  }
  else if (isLinux) {
    return 'linux'
  }
  else if (isWindows) {
    return 'windows'
  }
  else {
    return 'windows'
  }
}
