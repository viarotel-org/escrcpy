import type { Preset } from 'unocss'
import { generateShades } from './helpers'
import type { ColorOptions, ColorsMap, LegacyPresetOptions, ShadesOptions } from './types'

export * from './helpers'
export * from './types'

function buildColorEntry(colorKey: string, colorValue: string, options: ShadesOptions) {
  const shades = generateShades(colorValue, { returnRgb: true, ...options })
  const shadeList = Object.entries(shades)

  const cssVars = shadeList.reduce((style, [key, value]) => {
    if (key === 'DEFAULT') {
      style += `--color-${colorKey}: ${value};`
    }
    else {
      style += `--color-${colorKey}-${key}: ${value};`
    }
    return style
  }, '')

  const themeColors = shadeList.reduce((obj: ColorOptions, [key]) => {
    if (key === 'DEFAULT') {
      obj[key as keyof ColorOptions] = `rgb(var(--color-${colorKey}))`
    }
    else {
      obj[key as keyof ColorOptions] = `rgb(var(--color-${colorKey}-${key}))`
    }
    return obj
  }, {} as ColorOptions)

  return { cssVars, themeColors }
}

/** Multi-color API: Pass in a color mapping object */
export function presetShades(colorsMap: ColorsMap): Preset
/** Legacy single-color API: Pass in a base color string (for compatibility) */
export function presetShades(baseColor: string, options?: LegacyPresetOptions): Preset

export function presetShades(colorOrMap: string | ColorsMap = '', legacyOptions: LegacyPresetOptions = {}): Preset {
  if (typeof colorOrMap === 'object') {
    const entries = Object.entries(colorOrMap)

    let allCssVars = ''
    const allThemeColors: Record<string, ColorOptions> = {}

    for (const [colorKey, config] of entries) {
      const { baseColor = '', ...shadesOptions } = config
      const { cssVars, themeColors } = buildColorEntry(colorKey, baseColor, shadesOptions)
      allCssVars += cssVars
      allThemeColors[colorKey] = themeColors
    }

    return {
      name: 'presetShades',
      preflights: [
        {
          getCSS: () => `:root { ${allCssVars} }`,
        },
      ],
      theme: {
        colors: allThemeColors,
      },
    }
  }

  const { primaryKey, baseKey, ...shadesOptions } = legacyOptions
  const colorKey = baseKey ?? primaryKey ?? 'primary'
  const { cssVars, themeColors } = buildColorEntry(colorKey, colorOrMap, shadesOptions)

  return {
    name: 'presetShades',
    preflights: [
      {
        getCSS: () => `:root { ${cssVars} }`,
      },
    ],
    theme: {
      colors: {
        [colorKey]: themeColors,
      },
    },
  }
}
