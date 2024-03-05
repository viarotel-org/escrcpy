import { presetWind, defineConfig } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'
import { presetShades } from '@viarotel-org/unocss-preset-shades'

const presetMain = presetWind()

const presets = [presetMain, presetShades('#028d71')]

export default defineConfig({
  // @ts-ignore
  presets,
  transformers: [transformerDirectives()],
  theme: {
    boxShadow: {
      el: 'var(--el-box-shadow)',
      'el-light': 'var(--el-box-shadow-light)',
      'el-lighter': 'var(--el-box-shadow-lighter)',
      'el-dark': 'var(--el-box-shadow-dark)',
    },
  },
  shortcuts: {
    'inset-0': 'top-0 bottom-0 left-0 right-0',
    'inset-center':
      'top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2',
    'inset-left-center': 'left-1/2 transform -translate-x-1/2',
    'inset-top-center': 'top-1/2 transform -translate-y-1/2',
  },
})
