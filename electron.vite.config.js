import { resolve } from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import useEslint from 'vite-plugin-eslint'
import useUnoCSS from 'unocss/vite'
import postcssConfig from '@viarotel-org/postcss-config'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@root': resolve('./'),
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    resolve: {
      alias: {
        '@resources': resolve('resources'),
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        '@root': resolve('./'),
        '@renderer': resolve('src/renderer/src'),
      },
    },
    plugins: [useEslint(), vue(), useUnoCSS()],
    css: {
      postcss: postcssConfig(),
    },
  },
})
