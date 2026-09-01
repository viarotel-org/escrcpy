import { app } from 'electron'

/**
 * Sandbox configuration manager options
 */
export interface SandboxManagerOptions {
  /**
   * Process module (for testing)
   */
  processModule?: NodeJS.Process
}

/**
 * Sandbox configuration result
 */
export interface SandboxConfigResult {
  disabled: boolean
  reason: string
}

/**
 * Sandbox configuration manager
 *
 * The Chromium sandbox stays enabled by default on Linux: deb/rpm installs
 * ship a setuid `chrome-sandbox` helper (see `createLinuxAfterInstall` in
 * `desktop/electron-builder.config.js`), and distros with
 * working unprivileged user namespaces use the namespace sandbox instead.
 *
 * IMPORTANT: this must run before `app.whenReady()` — Chromium decides on the
 * sandbox (zygote/SUID helper) during browser startup, so switches appended
 * after the ready event have no effect on it.
 */
export class SandboxManager {
  private process: NodeJS.Process

  /**
   * Constructor
   * @param options - Configuration options
   */
  constructor(options: SandboxManagerOptions = {}) {
    this.process = options.processModule || process
  }

  /**
   * Configure sandbox settings
   * @returns Configuration result
   */
  configureSandbox(): SandboxConfigResult {
    if (this.process.platform !== 'linux') {
      return {
        disabled: false,
        reason: 'Not applicable on non-Linux platforms',
      }
    }

    // Environment overrides take precedence in both directions.
    if (this.process.env.FORCE_NO_SANDBOX === '1') {
      return this.disable('FORCE_NO_SANDBOX=1')
    }

    if (this.process.env.FORCE_SANDBOX === '1') {
      return {
        disabled: false,
        reason: 'FORCE_SANDBOX=1',
      }
    }

    // AppImage and Flatpak cannot rely on the SUID sandbox helper (the setuid
    // bit does not survive the mounted image / sandbox) and unprivileged user
    // namespaces may be restricted (Ubuntu 24.04+), so opt out there.
    if (this.process.env.APPIMAGE || this.process.env.FLATPAK_ID) {
      return this.disable('SUID helper unavailable in AppImage/Flatpak')
    }

    return {
      disabled: false,
      reason: 'Sandbox enabled',
    }
  }

  /**
   * Disable the Chromium sandbox
   */
  private disable(reason: string): SandboxConfigResult {
    app.commandLine.appendSwitch('no-sandbox')
    app.commandLine.appendSwitch('disable-dev-shm-usage')
    return {
      disabled: true,
      reason,
    }
  }
}

/**
 * Configure the Chromium sandbox. Must be called before `app.whenReady()`.
 */
export function configureSandbox(options: SandboxManagerOptions = {}): SandboxConfigResult {
  return new SandboxManager(options).configureSandbox()
}
