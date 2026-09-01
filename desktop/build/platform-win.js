/**
 * Windows packaging: NSIS installer, portable executable and (disabled) APPX.
 * All sub-targets share the same x64 + arm64 matrix.
 */

export const win = {
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
}

export const nsis = {
  artifactName: '${productName}-${version}-win-setup-${arch}.${ext}',
  shortcutName: '${productName}',
  uninstallDisplayName: '${productName}',
  oneClick: false,
  perMachine: false,
  allowToChangeInstallationDirectory: true,
  deleteAppDataOnUninstall: false,
}

export const portable = {
  artifactName: '${productName}-${version}-win-portable-${arch}.${ext}',
  requestExecutionLevel: 'user',
}

export const appx = {
  identityName: 'viarotel.Escrcpy',
  publisher: 'CN=E67CC10B-A1BE-413C-BC3B-6E1137E0742D',
  publisherDisplayName: 'viarotel',
  languages: ['zh-CN', 'en-US', 'zh-TW'],
}
