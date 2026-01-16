import { expect, it } from 'vitest'
import { ADBAutoInstaller } from '@/adb/installer'

it.skip('auto install adb', async () => {
  const installer = new ADBAutoInstaller()
  const installed = await installer.check()
  if (!installed) {
    await installer.install()
    const installed = await installer.check()
    expect(installed).toBe(true)
  }
})
