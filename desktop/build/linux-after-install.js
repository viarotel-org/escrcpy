import { createRequire } from 'node:module'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * Generate the Linux after-install script from electron-builder's own
 * `after-install.tpl` at build time instead of keeping a hand-synced copy in
 * the repo. The upstream template is internal and does drift between
 * releases, so copying it (and re-diffing on every electron-builder upgrade)
 * is a maintenance trap. Generating from the *installed* version's template
 * means upstream changes are absorbed automatically and only the Escrcpy
 * customization below is ever maintained.
 */
export function createLinuxAfterInstall() {
  const require = createRequire(import.meta.url)
  const templatePath = require.resolve('app-builder-lib/templates/linux/after-install.tpl')
  const template = readFileSync(templatePath, 'utf8')

  // Upstream drift detector: if the template ever stops managing the SUID
  // helper, our appended fix is probably no longer meaningful (or the
  // problem was fixed upstream) and deserves a manual review.
  if (!template.includes('chrome-sandbox')) {
    console.warn(`[escrcpy] Upstream ${templatePath} no longer mentions chrome-sandbox, please review the Linux after-install workaround.`)
  }

  // Append (rather than patch) the fix: it runs last, so it overrides
  // whatever mode the template's user-namespace probe set earlier. This keeps
  // working even if upstream rewrites the probe entirely.
  const script = `${template}
# --- Escrcpy customization ---
# Always install the SUID sandbox helper with the mode Chromium requires.
# Upstream strips the setuid bit when its \`unshare --user\` probe succeeds,
# but that probe false-positives on Ubuntu 24.04+: AppArmor allows creating a
# user namespace yet denies CAP_SYS_ADMIN inside it, which is exactly what
# Chromium's namespace sandbox needs. When user namespaces fully work the SUID
# helper is simply unused, so 4755 is always safe. Remove this block once
# upstream fixes the probe.
chmod 4755 '/opt/\${sanitizedProductName}/chrome-sandbox' || true
`

  // Kept in node_modules/.cache: generated, never committed.
  const outputPath = fileURLToPath(new URL('../node_modules/.cache/escrcpy/after-install.sh', import.meta.url))
  mkdirSync(fileURLToPath(new URL('../node_modules/.cache/escrcpy/', import.meta.url)), { recursive: true })
  writeFileSync(outputPath, script)
  return outputPath
}
