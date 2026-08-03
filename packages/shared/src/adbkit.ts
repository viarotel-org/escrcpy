export function getAdbUtil(adbkit: any): any {
  const Adb = adbkit.Adb ?? adbkit.default ?? adbkit
  return Adb.util
}
