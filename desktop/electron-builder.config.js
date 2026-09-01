import { resolveElectronMirror } from './build/electron-mirror.js'
import { asarUnpack as nativeModuleAsarUnpack, files as nativeModuleFiles } from './build/native-modules.js'
import { appx, nsis, portable, win } from './build/platform-win.js'
import { mac } from './build/platform-mac.js'
import { deb, flatpak, linux, rpm } from './build/platform-linux.js'

/** @type {import('electron-builder').Configuration} */
export default {
  productName: 'Escrcpy',
  appId: 'org.viarotel.escrcpy',

  directories: {
    output: 'dist-release',
    buildResources: 'electron/resources/build',
  },

  files: nativeModuleFiles,

  asar: true,

  asarUnpack: nativeModuleAsarUnpack,

  extraResources: [
    {
      from: '../packages/madb/dist',
      to: 'extra/common/madb',
      filter: ['index.mjs'],
    },
  ],

  win,
  nsis,
  portable,
  appx,

  mac,

  linux,
  flatpak,
  deb,
  rpm,

  npmRebuild: true,

  publish: {
    provider: 'github',
    owner: 'viarotel-org',
    repo: 'escrcpy',
    updaterCacheDirName: 'escrcpy-updater',
  },

  electronDownload: {
    mirror: resolveElectronMirror(),
  },
}
