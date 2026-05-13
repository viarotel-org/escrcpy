import { resolve } from 'node:path'
import useVueRouter from 'unplugin-vue-router/vite'
import useVue from '@vitejs/plugin-vue'
import useVueJsx from '@vitejs/plugin-vue-jsx'
import useUnoCSS from 'unocss/vite'
import { defineConfig, mergeConfig } from 'vite'

import useElectron from 'vite-plugin-electron/simple'
import useRenderer from 'vite-plugin-electron-renderer'

import postcssConfig from './postcss.config.js'

import useInternalPlugins from './src/plugins/internal.js'

const alias = {
  $: resolve('src'),
  $root: resolve(),
  $docs: resolve('docs'),
  $renderer: resolve('src'),
  $electron: resolve('electron'),
  $control: resolve('pages/control'),
  $explorer: resolve('pages/explorer'),
  $terminal: resolve('pages/terminal')
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
            '@lydell/node-pty',
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
            control: resolve('pages/control/index.html'),
            explorer: resolve('pages/explorer/index.html'),
            terminal: resolve('pages/terminal/index.html'),
          },
        },
      },
      plugins: [
        useUnoCSS(),
        useVueRouter({
          routesFolder: 'src/views',
          exclude: ['src/views/**/components'],
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
        ...useInternalPlugins(),
      ],
      css: {
        postcss: postcssConfig,
      },
    }),
  )
}
