import { resolve } from 'node:path'
import useVueRouter from 'unplugin-vue-router/vite'
import useVue from '@vitejs/plugin-vue'
import useVueJsx from '@vitejs/plugin-vue-jsx'
import useUnoCSS from 'unocss/vite'
import { defineConfig, mergeConfig } from 'vite'

import useElectron from 'vite-plugin-electron/simple'
import useRenderer from 'vite-plugin-electron-renderer'

import postcssConfig from './postcss.config.js'

import useAutoImports from './src/plugins/auto.js'

const alias = {
  $: resolve('src'),
  $root: resolve(),
  $docs: resolve('docs'),
  $renderer: resolve('src'),
  $electron: resolve('electron'),
  $control: resolve('entries/control'),
  $explorer: resolve('entries/explorer'),
  $copilot: resolve('entries/copilot'),
  $terminal: resolve('entries/terminal'),
}

function mergeCommon(config, { command = '' } = {}) {
  return mergeConfig(
    {
      resolve: {
        alias,
      },
      build: {
        rollupOptions: {
          external: [
            'sharp',
            'i18next-fs-backend',
          ],
        },
      },
    },
    config,
  )
}

export default function (args) {
  return mergeCommon(
    defineConfig({
      server: {
        port: 1535,
      },
      build: {
        rollupOptions: {
          input: {
            main: resolve('index.html'),
            control: resolve('entries/control/index.html'),
            explorer: resolve('entries/explorer/index.html'),
            copilot: resolve('entries/copilot/index.html'),
            terminal: resolve('entries/terminal/index.html'),
          },
        },
      },
      plugins: [
        useUnoCSS(),
        useVueRouter({
          exclude: ['src/pages/**/components'],
        }),
        useVue(),
        useVueJsx(),
        useElectron({
          main: {
            entry: 'electron/main.js',
            vite: mergeCommon({}, args),
            onstart(args) {
              args.startup()
            },
          },
          preload: {
            input: 'electron/preload.js',
            vite: mergeCommon({}, args),
            onstart(args) {
              args.reload()
            },
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
