export interface ShadesOptions {
  /** Color shade levels to generate (default: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]) */
  shades?: number[]
  /** The shade level that maps to the base color (default: 500) */
  baseShade?: number
  /** Return colors as RGB channel values instead of hex (default: false) */
  returnRgb?: boolean
}

export interface ColorOptions {
  [key: number]: string
  DEFAULT: string
}

export interface ColorConfig extends ShadesOptions {
  /** Base color value (supports hex / rgb / rgba / hsl / cmyk and other common formats) */
  baseColor?: string
}

export type ColorsMap = Record<string, ColorConfig>

export interface LegacyPresetOptions extends ShadesOptions {
  /** @deprecated Please use baseKey instead */
  primaryKey?: string
  /** CSS variable and theme color key prefix (default: 'primary') */
  baseKey?: string
}
