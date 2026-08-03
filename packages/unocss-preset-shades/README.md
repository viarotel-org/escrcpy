# unocss-preset-shades

🎨 一个 UnoCSS 预设，根据指定的基准色自动生成由浅至深的完整色阶，并注入 CSS 变量与主题颜色配置。

🎨 A UnoCSS preset that automatically generates a full range of shades from light to dark based on a specified base color, injecting CSS variables and theme color configurations.

[![npm version](https://img.shields.io/npm/v/@escrcpy/unocss-preset-shades)](https://www.npmjs.com/package/@escrcpy/unocss-preset-shades)
[![license](https://img.shields.io/npm/l/@escrcpy/unocss-preset-shades)](./LICENSE)

## 特性

- ✅ 支持单色和多色同时配置
- ✅ 色值格式兼容 hex / rgb / rgba / hsl / cmyk 等主流格式
- ✅ 自动注入 CSS 自定义属性（变量），支持动态换肤
- ✅ 增加 `page` 选择器，原生兼容 UniApp 小程序
- ✅ 提供 `generateShades` / `updateShades` 工具函数供高级使用
- ✅ 完整 TypeScript 类型支持

## 安装

```shell
npm install @escrcpy/unocss-preset-shades
# 或
pnpm add @escrcpy/unocss-preset-shades
```

## 基础用法

### 单色配置

传入一个基准色字符串，配合可选的配置项，生成以 `primary` 为前缀的色阶变量。

```ts
// unocss.config.ts
import { presetShades } from '@escrcpy/unocss-preset-shades'

export default {
  presets: [
    presetShades('#028D71', {
      baseKey: 'primary', // CSS 变量与主题色键名前缀，默认 'primary'
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      baseShade: 500, // 与基准色对应的色阶级别，默认 500
    }),
  ],
}
```

### 多色配置（推荐）

传入一个颜色映射对象，同时配置多种主题色。

```ts
// unocss.config.ts
import { presetShades } from '@escrcpy/unocss-preset-shades'

export default {
  presets: [
    presetShades({
      primary: { baseColor: '#028D71' },
      success: { baseColor: '#22c55e' },
      warning: { baseColor: '#f59e0b' },
      danger: { baseColor: '#ef4444' },
    }),
  ],
}
```

## 配置项

### `ShadesOptions`

| 属性        | 类型       | 默认值                                                   | 说明                       |
| ----------- | ---------- | -------------------------------------------------------- | -------------------------- |
| `shades`    | `number[]` | `[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]` | 生成的色阶级别列表         |
| `baseShade` | `number`   | `500`                                                    | 对应基准色的色阶级别       |
| `returnRgb` | `boolean`  | `false`                                                  | 返回 RGB 通道值而非 HEX 值 |

### `LegacyPresetOptions`（单色 API 额外选项）

| 属性         | 类型     | 默认值      | 说明                             |
| ------------ | -------- | ----------- | -------------------------------- |
| `baseKey`    | `string` | `'primary'` | CSS 变量与主题色配置的键名前缀   |
| `primaryKey` | `string` | —           | ⚠️ 已弃用，请使用 `baseKey` 代替 |

### `ColorConfig`（多色 API 每项配置）

继承 `ShadesOptions` 的全部属性，额外包含：

| 属性        | 类型     | 说明                                                  |
| ----------- | -------- | ----------------------------------------------------- |
| `baseColor` | `string` | 基准色值（支持 hex / rgb / rgba / hsl / cmyk 等格式） |

## 输出说明

以 `presetShades('#028D71')` 为例，预设将自动完成以下注入：

### CSS 变量（注入到 `:root, page`）

```css
/* 增加 page 选择器以支持 UniApp 小程序 */
:root,
page {
  --color-primary-50: 230, 244, 241;
  --color-primary-100: 204, 232, 227;
  --color-primary-200: 154, 209, 198;
  --color-primary-300: 103, 187, 170;
  --color-primary-400: 53, 164, 141;
  --color-primary-500: 2, 141, 113;
  --color-primary-600: 2, 113, 90;
  --color-primary-700: 1, 85, 68;
  --color-primary-800: 1, 56, 45;
  --color-primary-900: 0, 28, 23;
  --color-primary-950: 0, 14, 11;
  --color-primary: 2, 141, 113;
}
```

### UnoCSS 主题颜色

```ts
const config = {
  theme: {
    colors: {
      primary: {
        DEFAULT: 'rgba(var(--color-primary), <alpha-value>)',
        50: 'rgba(var(--color-primary-50), <alpha-value>)',
        100: 'rgba(var(--color-primary-100), <alpha-value>)',
        200: 'rgba(var(--color-primary-200), <alpha-value>)',
        300: 'rgba(var(--color-primary-300), <alpha-value>)',
        400: 'rgba(var(--color-primary-400), <alpha-value>)',
        500: 'rgba(var(--color-primary-500), <alpha-value>)',
        600: 'rgba(var(--color-primary-600), <alpha-value>)',
        700: 'rgba(var(--color-primary-700), <alpha-value>)',
        800: 'rgba(var(--color-primary-800), <alpha-value>)',
        900: 'rgba(var(--color-primary-900), <alpha-value>)',
        950: 'rgba(var(--color-primary-950), <alpha-value>)',
      },
    },
  },
}
```

得益于 `<alpha-value>` 占位符，可在 Tailwind / UnoCSS 工具类中直接使用不透明度修饰符，例如 `bg-primary/50`、`text-primary-700/80`。

## 工具函数

### `generateShades(colorValue, options?)`

根据基准色生成色阶数据对象。

```ts
import { generateShades } from '@escrcpy/unocss-preset-shades'

const shades = generateShades('#028D71', {
  returnRgb: true,
  baseShade: 500,
})

// 返回值示例：
// {
//   DEFAULT: '2,141,113',
//   50:  '230,244,241',
//   100: '204,232,227',
//   200: '154,209,198',
//   300: '103,187,170',
//   400: '53,164,141',
//   500: '2,141,113',
//   600: '2,113,90',
//   700: '1,85,68',
//   800: '1,56,45',
//   900: '0,28,23',
//   950: '0,14,11',
// }
```

### `updateShades(baseColor, colorKey?)`

动态更新 `:root` 上的 CSS 颜色变量，适用于运行时动态换肤场景（仅浏览器环境）。

```ts
import { updateShades } from '@escrcpy/unocss-preset-shades'

// 将 primary 色组变量替换为新颜色
updateShades('#1a73e8', 'primary')
```

> ⚠️ 该方法依赖 `document.documentElement`，不支持小程序环境。

## TypeScript 类型

所有类型均从主入口统一导出：

```ts
import type {
  ColorConfig,
  ColorOptions,
  ColorsMap,
  LegacyPresetOptions,
  ShadesOptions,
} from '@escrcpy/unocss-preset-shades'
```
