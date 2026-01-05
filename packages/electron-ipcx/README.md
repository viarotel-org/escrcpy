# @escrcpy/electron-ipcx

Function-friendly IPC helpers for Electron that mirror `ipcRenderer.invoke` / `ipcMain.handle` while allowing functions to cross the boundary via proxy channels.

## How it works
- Renderer scans invoke arguments, lifts functions into descriptors, and registers temporary `ipcRenderer.on` listeners keyed by generated channels.
- Sanitized args plus the function descriptors travel through `ipcRenderer.invoke` unchanged for the caller.
- Main reconstructs proxies that call back to the renderer through `event.sender.send(channel, ...)`, triggering the original renderer callbacks.
- Listeners auto-dispose after the invoke settles; a retained mode exposes manual disposal.

### Data structures
- **FunctionDescriptor**: `{ label, index, segments, channel }` where `index` is a readable path like `args[0].cb` and `segments` is the path array used to rehydrate functions.
- **InvokeEnvelope**: `{ args: unknown[]; fns: FunctionDescriptor[] }` sent across IPC.

### Lifecycle
- Auto mode (default): renderer listeners are removed in `finally` once the invoke resolves/rejects.
- Retained mode: `invokeRetained` returns `{ promise, dispose }`; caller decides when to clean up.
- Descriptors carry unique channel names to avoid collisions across concurrent invokes.

## API
- `ipcxRenderer.invoke(channel, ...args): Promise<T>` — drop-in replacement with function support.
- `ipcxRenderer.invokeRetained(channel, ...args): { promise, dispose }` — manual lifecycle.
- `ipcxMain.handle(channel, listener)` — mirrors `ipcMain.handle`; listener receives original args with proxy callbacks hydrated.

## Usage
```ts
// renderer
import { ipcxRenderer } from '@escrcpy/electron-ipcx/renderer'

await ipcxRenderer.invoke('files:read', {
  path: '/tmp/demo',
  onChunk: (chunk: Uint8Array) => console.log(chunk.length),
})

// manual disposal
const { promise, dispose } = ipcxRenderer.invokeRetained('task:start', {
  onProgress: (pct: number) => console.log(pct),
})
await promise
dispose()
```

```ts
// main
import { ipcxMain } from '@escrcpy/electron-ipcx/main'

ipcxMain.handle('files:read', async (_event, payload: { path: string; onChunk: (chunk: Uint8Array) => void }) => {
  // call like a normal function; renderer receives the chunks
  payload.onChunk(new Uint8Array([1, 2, 3]))
  return 'done'
})
```

## Error handling & safety
- Payload validation guards malformed envelopes; errors reject the invoke promise.
- Renderer callback errors are logged without breaking the invoke chain.
- Sender absence in main throws a typed `InvalidPayloadError` to signal broken sessions.

## Build & test
- `pnpm build` — bundle via tsdown (dual entry main/renderer, dts emitted)
- `pnpm test` — vitest unit tests
- `pnpm release` — version bump via bumpp (aligned with repository release flow)
