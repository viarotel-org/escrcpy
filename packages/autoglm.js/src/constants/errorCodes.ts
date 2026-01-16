export enum ErrorCode {
  /** unknown error */
  UNKNOWN_ERROR,
  /** adb not installed */
  ADB_NOT_INSTALLED,
  /** adb device not connected */
  ADB_DEVICE_UNCONNECTED,
  /** adb keyboard not installed */
  ADB_KEYBOARD_UNINSTALLED,
  /** model api check failed */
  MODEL_API_CHECK_FAILED,
}
