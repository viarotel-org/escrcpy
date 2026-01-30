# Sandbox Plugin

Chromium sandbox configuration plugin for Electron Modularity.

## Features

- 🐧 Linux-specific sandbox management
- 🔒 Compatibility-first approach (default: disabled on Linux)
- 🌍 Environment variable control
- ⚡ Very early loading (order: -100)
- 📊 Detailed configuration result reporting
- ⚙️ Configurable event names

## Installation

```typescript
import { createElectronApp } from '@escrcpy/electron-modularity'
import { sandboxPlugin } from '@escrcpy/electron-modularity/plugins'

const app = createElectronApp({
  // ... config
})

app.use(sandboxPlugin)
```

## Configuration

```typescript
app.use(sandboxPlugin, {
  serviceName: 'service:sandbox',           // DI service name (default)
  configuredEventName: 'sandbox:configured', // Success event (default)
  errorEventName: 'sandbox:config-error',   // Error event (default)
})
```

## Platform Behavior

### Linux
- **Default**: Sandbox **disabled** for compatibility
- Applies `--no-sandbox` and `--disable-dev-shm-usage` flags
- Can be overridden with environment variables

### macOS / Windows
- Plugin skips configuration (not applicable)
- Returns immediately with `disabled: false`

## Environment Variables

Control sandbox behavior with these environment variables:

```bash
# Force enable sandbox (security-first)
FORCE_SANDBOX=1 ./app

# Force disable sandbox (compatibility-first)
FORCE_NO_SANDBOX=1 ./app
```

**Priority:**
1. `FORCE_NO_SANDBOX=1` (highest priority)
2. `FORCE_SANDBOX=1`
3. Default (disabled on Linux)

## Events

### sandbox:configured

Emitted when sandbox configuration succeeds.

```typescript
app.on('sandbox:configured', (result) => {
  console.log('Sandbox configured:', result)
  /*
  {
    disabled: true,
    reason: 'Default Linux compatibility mode',
    checks: { defaultDisabled: true },
    duration: 2
  }
  */
})
```

### sandbox:config-error

Emitted when configuration fails.

```typescript
app.on('sandbox:config-error', (error) => {
  console.error('Sandbox configuration error:', error)
})
```

## Configuration Result

The plugin returns a configuration result object:

```typescript
interface SandboxConfigResult {
  disabled: boolean       // Whether sandbox was disabled
  reason: string         // Reason for the decision
  checks?: {             // Check results
    platform?: string
    forceEnable?: boolean
    forceDisable?: boolean
    defaultDisabled?: boolean
  }
  duration?: number      // Configuration time in ms
  error?: boolean        // Whether an error occurred
}
```

## Load Order

This plugin uses `order: -100` to ensure **very early loading**.

**Why?**
- Chromium command-line switches must be set **before** `app.ready`
- The plugin needs to run before most other initialization

**Load sequence:**
```
1. sandbox plugin (order: -100) ← Runs first
2. singleton plugin (order: -50)
3. Other plugins (order: 0 or higher)
```

## Custom Service Name

```typescript
app.use(sandboxPlugin, {
  serviceName: 'my-app:sandbox'
})

// The plugin doesn't expose an API, but the name is traceable in DI
```

## Custom Event Names

```typescript
app.use(sandboxPlugin, {
  configuredEventName: 'my-app:sandbox-ready',
  errorEventName: 'my-app:sandbox-error',
})

app.on('my-app:sandbox-ready', (result) => {
  // ...
})
```

## Testing

For testing purposes, you can inject a custom process module:

```typescript
const mockProcess = {
  platform: 'linux',
  env: { FORCE_NO_SANDBOX: '1' }
}

app.use(sandboxPlugin, {
  processModule: mockProcess as any
})
```

## Security Considerations

**Disabling the sandbox reduces security:**
- Only disable when necessary for compatibility
- Use `FORCE_SANDBOX=1` in production if possible
- Monitor for security advisories

**When to enable sandbox:**
- Production environments with proper system configuration
- When distributing to end users with modern Linux distros

**When to disable sandbox:**
- Development environments
- Older Linux distributions
- Systems without proper kernel support

## Troubleshooting

### Error: "Running as root without --no-sandbox is not supported"

This is expected when running as root. The plugin will automatically disable sandbox.

### Sandbox still enabled after plugin

Make sure the plugin loads **before** `app.ready`:
- Plugin order should be `-100` or lower
- No other code should call `app.whenReady()` before plugin loads

### Configuration not applied

Check the event listener:
```typescript
app.on('sandbox:configured', (result) => {
  console.log('Applied:', result)
})
```

## License

MIT
