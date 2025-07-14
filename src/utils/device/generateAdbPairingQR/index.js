import * as qrCode from 'qrcode'
import { primaryColor } from '$/configs/index.js'

/**
 * Generates a QR code data URL for ADB wireless pairing
 * @param options Configuration options
 * @returns Promise containing the QR code data URL
 */
export async function generateAdbPairingQR(options = {}) {
  // Generate random password (default 6 digits)
  const passwordLength = options.passwordLength || 6
  const minValue = 10 ** (passwordLength - 1)
  const maxValue = 10 ** passwordLength - 1
  const password = Math.floor(Math.random() * (maxValue - minValue) + minValue).toString()

  // Format the ADB pairing text
  const pairingText = `WIFI:T:ADB;S:ADBQR-connectPhoneOverWifi;P:${password};;`

  const themeStore = useThemeStore()

  // Generate QR code
  const dataUrl = await qrCode.toDataURL(pairingText, {
    type: 'image/webp',
    rendererOpts: { quality: 1 },
    color: themeStore.isDark
      ? {
          dark: '#000000',
          light: primaryColor,
        }
      : {
          dark: primaryColor,
          light: '#ffffff',
        },
    margin: 0,
  })

  return {
    dataUrl,
    password, // Return password so it can be displayed to user
  }
}

export default generateAdbPairingQR
