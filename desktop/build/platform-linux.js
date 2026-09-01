import { createLinuxAfterInstall } from './linux-after-install.js'

// Generated at config-load time from electron-builder's own after-install
// template with the chrome-sandbox SUID fix appended (see linux-after-install.js).
const afterInstall = createLinuxAfterInstall()

/**
 * Linux packaging: AppImage, deb and flatpak for x64 and arm64.
 *
 * deb/rpm share FpmTarget, so both point at the same generated after-install
 * script: electron-builder's default strips the setuid bit from
 * chrome-sandbox when its user-namespace probe false-positives on Ubuntu
 * 24.04+, while the generated script keeps the official install logic
 * (alternatives, mime, desktop, AppArmor) verbatim and forces mode 4755.
 */

export const linux = {
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
}

export const flatpak = {
  runtime: 'org.freedesktop.Platform',
  runtimeVersion: '25.08',
  sdk: 'org.freedesktop.Sdk',
  base: 'org.electronjs.Electron2.BaseApp',
  baseVersion: '25.08',
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
}

export const deb = {
  afterInstall,
}

export const rpm = {
  afterInstall,
}
