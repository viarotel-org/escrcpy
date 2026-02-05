import { registry } from './registry.js'
import { LocalTerminalProvider } from './local.js'
import { DeviceTerminalProvider } from './device.js'

export { BaseTerminalProvider } from './base.js'
export { DeviceTerminalProvider } from './device.js'
export { LocalTerminalProvider } from './local.js'
export { ProviderRegistry, registry } from './registry.js'

registry.register('local', LocalTerminalProvider)
registry.register('device', DeviceTerminalProvider)
