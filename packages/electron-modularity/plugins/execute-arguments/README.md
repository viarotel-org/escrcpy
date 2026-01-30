# Execute Arguments Plugin

Command-line arguments parser and environment injector plugin for Electron Modularity.

## Features

- 🎯 Parse command-line arguments using minimist
- 🌍 Automatic environment variable injection
- 🔌 Accessible via dependency injection
- ⚙️ Configurable service name and environment prefix
- 🧹 No cleanup needed (pure data transformation)

## Installation

```typescript
import { createElectronApp } from '@escrcpy/electron-modularity'
import { executeArgumentsPlugin } from '@escrcpy/electron-modularity/plugins'

const app = createElectronApp({
  // ... config
})

app.use(executeArgumentsPlugin)
```

## Configuration

```typescript
app.use(executeArgumentsPlugin, {
  serviceName: 'plugin:execute-arguments', // DI service name (default)
  envPrefix: 'EXECUTE_ARG_',                // Environment variable prefix (default)
})
```

## API

### Access Execute Arguments API

```typescript
import type { ExecuteArgumentsPluginAPI } from '@escrcpy/electron-modularity/plugins'

// In another plugin or after app.start()
const argsAPI = app.inject<ExecuteArgumentsPluginAPI>('plugin:execute-arguments')

// Get initial arguments
const args = argsAPI.getArguments()
console.log(args) // { deviceId: 'xxx', appName: 'MyApp', ... }

// Parse new arguments
const newArgs = argsAPI.parseExecuteArguments(['--foo=bar', '--baz'])
console.log(newArgs) // { foo: 'bar', baz: true }

// Inject arguments into environment
argsAPI.injectExecuteArguments({ deviceId: '12345' })
console.log(process.env.EXECUTE_ARG_DEVICE_ID) // '12345'
```

## Command Line Usage

```bash
# Start app with arguments
./app --device-id=12345 --app-name=MyApp --auto-start

# Parsed arguments object:
{
  deviceId: '12345',
  appName: 'MyApp',
  autoStart: true
}

# Environment variables (only non-boolean values):
# EXECUTE_ARG_DEVICE_ID=12345
# EXECUTE_ARG_APP_NAME=MyApp
```

## Environment Variable Naming

The plugin converts kebab-case argument names to SCREAMING_SNAKE_CASE:

| Argument | Environment Variable |
|----------|---------------------|
| `--device-id=xxx` | `EXECUTE_ARG_DEVICE_ID=xxx` |
| `--app-name=MyApp` | `EXECUTE_ARG_APP_NAME=MyApp` |
| `--max-retry-count=5` | `EXECUTE_ARG_MAX_RETRY_COUNT=5` |

## Custom Service Name

You can customize the service name for dependency injection:

```typescript
app.use(executeArgumentsPlugin, {
  serviceName: 'my-app:args'
})

// Access with custom name
const api = app.inject<ExecuteArgumentsPluginAPI>('my-app:args')
```

## Custom Environment Prefix

You can customize the environment variable prefix:

```typescript
app.use(executeArgumentsPlugin, {
  envPrefix: 'MY_APP_ARG_'
})

// Now arguments are prefixed with MY_APP_ARG_
console.log(process.env.MY_APP_ARG_DEVICE_ID)
```

## Use in Second Instance

This plugin is commonly used with the singleton plugin to handle second instance arguments:

```typescript
app.use(singletonPlugin, {
  deps: ['plugin:execute-arguments']
})

// When second instance starts with new arguments,
// singleton plugin can use this API to parse and inject them
```

## License

MIT
