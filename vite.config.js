import { resolve } from 'node:path'
import useI18n from '@intlify/unplugin-vue-i18n/vite'
import useVue from '@vitejs/plugin-vue'
import useUnoCSS from 'unocss/vite'
import { defineConfig, mergeConfig } from 'vite'

import { notBundle } from 'vite-plugin-electron/plugin'
import useElectron from 'vite-plugin-electron/simple'
import useRenderer from 'vite-plugin-electron-renderer'
import useSvg from 'vite-svg-loader'

import postcssConfig from './postcss.config.js'

import useAutoImports from './src/plugins/auto.js'

const alias = {
  $: resolve('src'),
  $root: resolve(),
  $renderer: resolve('src'),
  $electron: resolve('electron'),
  $control: resolve('control'),
}

function mergeCommon(config, { command = '' } = {}) {
  return mergeConfig(
    {
      resolve: {
        alias,
      },
      plugins: [...(command === 'serve' ? [notBundle()] : [])],
    },
    config,
  )
}

export default function (args) {
  return mergeCommon(
    defineConfig({
      build: {
        rollupOptions: {
          input: {
            main: resolve('index.html'),
            control: resolve('control/index.html'),
          },
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
            vite: mergeCommon({}, args),
          },
          preload: {
            input: 'electron/preload.js',
            vite: mergeCommon({}, args),
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
}
