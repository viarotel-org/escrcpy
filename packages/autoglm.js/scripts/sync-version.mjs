import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import adbKeyboardPackageJson from '@autoglm.js/adb-keyboard/package.json' with { type: 'json' }
import platformToolsPackageJson from '@autoglm.js/platform-tools-darwin/package.json' with { type: 'json' }
import consola from 'consola'
import packageJson from './../package.json' with { type: 'json' }

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJsonPath = join(__dirname, '..', 'package.json')

const version = platformToolsPackageJson.version

// 同步adb-keyboard包的版本

Object.keys(packageJson.optionalDependencies).forEach((dep) => {
  packageJson.optionalDependencies[dep] = version
})
packageJson.optionalDependencies['@autoglm.js/adb-keyboard'] = adbKeyboardPackageJson.version

writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

consola.success('Version synced successfully:', version)
