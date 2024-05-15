import { resolve } from 'node:path'
import { defineConfig, mergeConfig } from 'vite'
import useElectron from 'vite-plugin-electron/simple'
import useRenderer from 'vite-plugin-electron-renderer'
import { notBundle } from 'vite-plugin-electron/plugin'

import useVue from '@vitejs/plugin-vue'
import useUnoCSS from 'unocss/vite'
import useSvg from 'vite-svg-loader'
import useI18n from '@intlify/unplugin-vue-i18n/vite'

import postcssConfig from './postcss.config.js'

import useAutoImports from './src/plugins/auto.js'

const merge = (config, { command = '' } = {}) =>
  mergeConfig(
    {
      resolve: {
        alias: {
          $root: resolve(),
          $electron: resolve('electron'),
          $renderer: resolve('src'),
        },
      },
      plugins: [...(command === 'serve' ? [notBundle()] : [])],
    },
    config,
  )

export default args =>
  merge(
    defineConfig({
      build: {
        rollupOptions: {
          input: {
            main: resolve('index.html'),
            copilot: resolve('copilot/index.html'),
          },
        },
      },
      resolve: {
        alias: {
          $: resolve('src'),
          $copilot: resolve('copilot'),
          $electron: resolve('electron'),
        },
      },
      plugins: [
        useUnoCSS(),
        useSvg(),
        useVue(),
        useI18n({
          include: [resolve('src/locales/languages/**')],
        }),
        useElectron({
          main: {
            entry: 'electron/main.js',
            vite: merge({}, args),
          },
          preload: {
            input: 'electron/preload.js',
            vite: merge({}, args),
          },
        }),
        useRenderer(),
        ...useAutoImports(),
      ],
      css: {
        postcss: postcssConfig,
      },
    }),
  )
