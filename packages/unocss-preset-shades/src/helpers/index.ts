import Color from 'color'
import type { ColorOptions, ShadesOptions } from '../types'

// Define ColorType as the return type of Color()
type ColorType = ReturnType<typeof Color>

/**
 * Generate colors of different depths based on the base color
 * @param colorValue Base color value (supports hex / rgb / rgba / hsl / cmyk and other common formats)
 */
export function generateShades(
  colorValue: string = '',
  { shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950], baseShade = 500, returnRgb = false }: ShadesOptions = {},
): ColorOptions {
  const baseColor = Color(colorValue)

  const getColor = (color: ColorType) => {
    if (returnRgb) {
      return color.round().rgb().array().join(',')
    }
    return color.hex()
  }

  return shades.reduce(
    (obj, shadeValue) => {
      if (baseShade === shadeValue) {
        obj[shadeValue] = obj.DEFAULT
      }
      else if (shadeValue < baseShade) {
        const weight = 1 - shadeValue / baseShade
        obj[shadeValue] = getColor(baseColor.mix(Color('white'), weight))
      }
      else {
        const weight = (shadeValue - baseShade) / (1000 - baseShade)
        obj[shadeValue] = getColor(baseColor.mix(Color('black'), weight))
      }
      return obj
    },
    { DEFAULT: getColor(baseColor) } as ColorOptions,
  )
}

/**
 * Dynamically update CSS theme color variables (browser only)
 * @param baseColor Base color value (supports hex / rgb / rgba / hsl / cmyk and other common formats)
 * @param colorKey  CSS variable prefix (default 'primary')
 */
export function updateShades(baseColor: string = '', colorKey: string = 'primary') {
  const shadeColors = generateShades(baseColor, { returnRgb: true })

  const setProperty = (key: string, value: string) => document.documentElement.style.setProperty(key, value)

  Object.entries(shadeColors).forEach(([weight, colorValue]) => {
    if (weight === 'DEFAULT') {
      setProperty(`--color-${colorKey}`, colorValue)
    }
    else {
      setProperty(`--color-${colorKey}-${weight}`, colorValue)
    }
  })
}
