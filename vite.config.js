import { resolve } from 'node:path'
import { defineConfig, mergeConfig } from 'vite'
import useElectron from 'vite-plugin-electron'
import useRenderer from 'vite-plugin-electron-renderer'
import { notBundle } from 'vite-plugin-electron/plugin'

import useVue from '@vitejs/plugin-vue'
import useEslint from 'vite-plugin-eslint'
import useUnoCSS from 'unocss/vite'
import useSvg from 'vite-svg-loader'
import useI18n from '@intlify/unplugin-vue-i18n/vite'

import postcssConfig from './postcss.config.mjs'

const merge = (config, { command = '' } = {}) =>
  mergeConfig(
    {
      resolve: {
        alias: {
          '@root': resolve(),
          '@electron': resolve('electron'),
          '@renderer': resolve('src'),
        },
      },
      plugins: [...(command === 'serve' ? [notBundle()] : [])],
    },
    config,
  )

// https://vitejs.dev/config/
export default params =>
  merge(
    defineConfig({
      build: {
        rollupOptions: {
          input: {
            main: resolve(__dirname, 'index.html'),
            server: resolve(__dirname, 'server/index.html'),
          },
        },
      },
      resolve: {
        alias: {
          '@': resolve('src'),
          '@electron': resolve('electron'),
        },
      },
      plugins: [
        useEslint(),
        useUnoCSS(),
        useSvg(),
        useVue(),
        useI18n({
          include: [resolve(__dirname, './src/locales/languages/**')],
        }),
        useElectron([
          {
            entry: 'electron/main.js',
            vite: merge({}, params),
          },
          {
            entry: 'electron/preload.js',
            onstart(args) {
              args.reload()
            },
            vite: merge({}, params),
          },
        ]),
        useRenderer(),
      ],
      css: {
        postcss: postcssConfig,
      },
    }),
  )
