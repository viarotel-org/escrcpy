/** @type {import('electron-builder').Configuration} */
export default {
  productName: 'Escrcpy',
  appId: 'org.viarotel.escrcpy',

  directories: {
    output: 'dist-release',
    buildResources: 'electron/resources/build',
  },

  files: [
    'dist',
    'dist-electron',
    '!**/node_modules/@img/sharp-*/**/*',
    '**/node_modules/@img/sharp-*${platform}-${arch}/**/*',
    '!**/node_modules/@lydell/node-pty-*/**/*',
    '**/node_modules/@lydell/node-pty-*${platform}-${arch}/**/*',
  ],

  asar: true,

  asarUnpack: [
    '**/node_modules/sharp/**/*',
    '**/node_modules/@img/**/*',
    '**/node_modules/@lydell/**/*',
  ],

  win: {
    icon: 'logo.ico',
    target: [
      { target: 'nsis', arch: ['x64', 'arm64'] },
      { target: 'zip', arch: ['x64', 'arm64'] },
      { target: 'portable', arch: ['x64', 'arm64'] },
      // { target: 'appx', arch: ['x64', 'arm64'] },
    ],
    artifactName: '${productName}-${version}-win-${arch}.${ext}',
    extraResources: {
      from: 'electron/resources/extra',
      to: 'extra',
      filter: ['common', 'win', 'win-${arch}'],
    },
  },

  nsis: {
    artifactName: '${productName}-${version}-win-setup-${arch}.${ext}',
    shortcutName: '${productName}',
    uninstallDisplayName: '${productName}',
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false,
  },

  portable: {
    artifactName: '${productName}-${version}-win-portable-${arch}.${ext}',
    requestExecutionLevel: 'user',
  },

  appx: {
    identityName: 'viarotel.Escrcpy',
    publisher: 'CN=E67CC10B-A1BE-413C-BC3B-6E1137E0742D',
    publisherDisplayName: 'viarotel',
    languages: ['zh-CN', 'en-US', 'zh-TW'],
  },

  mac: {
    icon: 'logo.icns',
    target: [
      { target: 'dmg', arch: ['x64', 'arm64'] },
      { target: 'zip', arch: ['x64', 'arm64'] },
    ],
    artifactName: '${productName}-${version}-mac-${arch}.${ext}',
    extraResources: {
      from: 'electron/resources/extra',
      to: 'extra',
      filter: ['common', 'mac', 'mac-${arch}'],
    },
    x64ArchFiles: 'Contents/Resources/extra/**/*',
    entitlementsInherit: 'entitlements.mac.plist',
    extendInfo: {
      NSDocumentsFolderUsageDescription:
        'Application requests access to the user\'s Documents folder.',
      NSDownloadsFolderUsageDescription:
        'Application requests access to the user\'s Downloads folder.',
    },
    type: 'development',
    notarize: false,
    darkModeSupport: true,
    hardenedRuntime: false,
  },

  linux: {
    icon: 'logo.icns',
    maintainer: 'viarotel@qq.com',
    category: 'Utility',
    target: [
      { target: 'AppImage', arch: ['x64', 'arm64'] },
      { target: 'deb', arch: ['x64', 'arm64'] },
      { target: 'flatpak', arch: ['x64', 'arm64'] },
    ],
    artifactName: '${productName}-${version}-linux-${arch}.${ext}',
    extraResources: {
      from: 'electron/resources/extra',
      to: 'extra',
      filter: ['common', 'linux', 'linux-${arch}'],
    },
  },

  flatpak: {
    runtime: 'org.freedesktop.Platform',
    runtimeVersion: '23.08',
    sdk: 'org.freedesktop.Sdk',
    base: 'org.electronjs.Electron2.BaseApp',
    baseVersion: '23.08',
    finishArgs: [
      '--share=network',
      '--share=ipc',
      '--socket=x11',
      '--socket=wayland',
      '--socket=pulseaudio',
      '--device=all',
      '--filesystem=home',
      '--filesystem=xdg-download',
      '--talk-name=org.freedesktop.Notifications',
      '--talk-name=org.kde.StatusNotifierWatcher',
      '--system-talk-name=org.freedesktop.UDisks2',
    ],
  },

  npmRebuild: true,

  publish: {
    provider: 'github',
    owner: 'viarotel-org',
    repo: 'escrcpy',
    updaterCacheDirName: 'escrcpy-updater',
  },
}
