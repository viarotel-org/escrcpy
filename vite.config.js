import { resolve } from 'node:path'
import { defineConfig, mergeConfig } from 'vite'
import useElectron from 'vite-plugin-electron'
import useRenderer from 'vite-plugin-electron-renderer'

import useVue from '@vitejs/plugin-vue'
import useEslint from 'vite-plugin-eslint'
import useUnoCSS from 'unocss/vite'
import useSvg from 'vite-svg-loader'

const merge = config =>
  mergeConfig(
    {
      resolve: {
        alias: {
          '@root': resolve(),
          '@electron': resolve('electron'),
        },
      },
      plugins: [],
    },
    config,
  )

// https://vitejs.dev/config/
export default merge(
  defineConfig({
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    plugins: [
      useEslint(),
      useUnoCSS(),
      useSvg(),
      useVue(),
      useElectron([
        {
          entry: 'electron/main.js',
          vite: merge({}),
        },
        {
          entry: 'electron/preload.js',
          onstart(args) {
            args.reload()
          },
          vite: merge({}),
        },
      ]),
      useRenderer(),
    ],
  }),
)
