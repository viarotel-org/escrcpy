/**
 * macOS packaging: unsigned development builds (dmg + zip) for x64 and arm64.
 */

export const mac = {
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
  entitlements: 'electron/resources/build/entitlements.mac.plist',
  entitlementsInherit: 'electron/resources/build/entitlements.mac.plist',
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
}
