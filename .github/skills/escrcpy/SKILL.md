---
name: escrcpy
description: "Use when working on Escrcpy/escrcpy-x Electron Vue scrcpy code: architecture, renderer/main IPC, wscrcpy, Element Plus, VueUse, Floating UI, Tango ADB, i18n, UnoCSS, validation."
argument-hint: "Describe the Escrcpy code change, review, or debugging task"
---

# Escrcpy - AI Code Generation Guidelines

## Skill Objective

Automatically constrain AI-assisted code generation for Escrcpy to match the project's existing style, architecture, and conventions. Generated code should prioritize reusing existing modules, aliases, IPC, stores, i18n, UnoCSS, and workspace package boundaries, such that a developer familiar with the project cannot clearly distinguish human-written from AI-generated code.

## 0. Analysis Basis

These rules are grounded in real file reads, not assumptions. Core reference files:

- `AGENTS.md`: monorepo, windows, IPC, i18n, naming, and validation command constraints.
- `develop.md`, `README.md`: project positioning, Electron + Vue + scrcpy stack, and contribution workflow.
- `desktop/vite.config.js`: multi-renderer entry points and alias system.
- `desktop/electron/main.js`: `createElectronApp()` and plugin-based main process via `mainApp.use()`.
- `desktop/unocss.config.js`: UnoCSS preset, icons, shades, typography, and shortcuts.
- `packages/electron-setup/README.md`, `packages/electron-setup/main/*.ts`: plugins, windows, dependency injection, and dispose mechanism.
- `packages/electron-ipcx/README.md`: cross-process function/callback IPC contract.

Key pattern evidence:

| Dimension | Actual Pattern | File & Snippet |
| --- | --- | --- |
| Multi-window entries | `main/control/explorer/copilot/terminal/automation/mirror` are independent Vite inputs | `desktop/vite.config.js`: `rollupOptions.input = { main, control, explorer, copilot, terminal, automation, mirror }` |
| Path aliases | Unified via `$`, `$root`, `$electron`, `$control`, `$explorer`, `$copilot`, `$terminal`, `$automation`, `$mirror` | `desktop/vite.config.js`: `alias = { $: resolve('src'), $electron: resolve('electron'), ... }` |
| Main process plugins | Main entry only assembles plugins/modules/services | `desktop/electron/main.js`: `mainApp.use(mainModule)`, `mainApp.use(wscrcpyService)`, `mainApp.use(mirrorModule)` |
| Module structure | Module `index.js` composes window + service | `desktop/electron/modules/mirror/index.js`: `apply(mainApp) { mainApp.use(window); mainApp.use(service) }` |
| Regular IPC | Register `ipcMain.handle` inside service `apply()`, return cleanup function | `desktop/electron/modules/mirror/service.js`: `ipcMain.handle('mirror-update-rotation', ...)` + `ipcMain.removeHandler(...)` |
| Callback IPC | Use `ipcxMain` / `ipcxRenderer` when renderer callbacks are needed | `desktop/electron/modules/terminal/service.js`: payload includes `onData`, `onExit`, `onError`; `desktop/electron/middleware/terminal/index.js`: `ipcxRenderer.invokeRetained(...)` |
| Preload boundary | All renderer exposure centralized in `createMiddleware()` via `$preload` | `desktop/electron/middleware/index.js`: `contextBridge.exposeInMainWorld('$preload', { adb, scrcpy, terminal, ...electronAPI, ipcxRenderer })` |
| Pinia store | Setup store, state via `ref`, getters via `computed`, actions are plain functions | `desktop/src/store/device/index.js`: `defineStore('app-device', () => { const list = ref([]); async function getList() { ... } return { ... } })` |
| Persistence | `pinia-plugin-persistedstate` available for stores; Electron persistent config via `window.$preload.store` | `desktop/src/store/index.js`: `store.use(persistedState)`; `desktop/src/store/control/index.js`: `window.$preload.store.get/set/onDidChange` |
| Vue components | New desktop components primarily JS SFC + `<script setup>`, props/emits use runtime object/array style | `desktop/src/views/subscribe/components/tab-plans/index.vue`: `const emit = defineEmits(['purchase'])`; `desktop/pages/explorer/App.vue`: `<script setup>` |
| Options API remnants | Older components still use `export default`; new code should prefer `<script setup>` | `desktop/src/views/device/components/mirror-action/index.vue`: `export default { ... }` |
| Styling | UnoCSS utilities + existing Element Plus components; scoped PostCSS + `@apply` when necessary | `desktop/pages/terminal/App.vue`: `class="flex flex-col h-screen"`; scoped style uses `@apply !bg-transparent` |
| i18n | Templates use `$t()`, scripts use `window.t()`, keys are dot-separated hierarchies; `zh-CN` is the primary language | `desktop/src/plugins/vue-i18n/index.js`: `window.t = t`; `scripts/lang-sync.js`: `primary: 'zh-CN'` |
| TypeScript boundary | `packages/wscrcpy` uses TS types, interfaces, JSDoc; desktop main body uses JS/JSDoc | `packages/wscrcpy/shared/types.ts`: `export type DeviceTarget = 'all' \| 'primary' \| string \| string[]`; `desktop/src/store/automation/index.js`: JSDoc comments |
| wscrcpy session | `WscrcpySession` owns main-process scrcpy lifecycle; manager handles per-device queues and ownership | `packages/wscrcpy/service/session.ts`: `export class WscrcpySession`; `service/manager.ts`: `private readonly deviceQueues = new Map(...)` |
| Binary paths | scrcpy/adb/gnirehtet resolved via which config and store fallback | `desktop/electron/configs/which/index.js`: `getScrcpyPath()`, `getAdbPath()`, `whichResolve(...)` |
| Build cache | Turbo disables cache for dev/build; Electron build artifacts should not assume incremental output | `turbo.json`: `build.cache=false`, `dev.cache=false`, `build:electron.outputs=['dist-release/**']` |

### On-Demand Context References

Use `context/**` as local, version-aware reference material before guessing third-party APIs. Load only the document that matches the current task, then reconcile it with existing project code and `desktop/package.json` versions.

| Task Area | Read First | Use When |
| --- | --- | --- |
| Element Plus UI | `context/element-plus.md` | Choosing Element Plus components, props, slots, icons, messages, dialogs, form/table behavior, or confirming component API details. |
| VueUse composables | `context/vue-use.md` | Using or reviewing VueUse helpers, lifecycle utilities, watchers, DOM/event composables, and auto-imported composables. |
| Anchored floating UI | `context/floating-ui.md` | Implementing custom popovers, dropdowns, tooltips, context menus, collision handling, or `autoUpdate` cleanup. |
| ADB / yume-chan / scrcpy protocol | `context/tango-adb.md` | Touching `packages/wscrcpy`, Tango ADB, `@yume-chan/*`, device transport, scrcpy options, stream control, or protocol-level behavior. |

If these docs conflict with nearby repository code, treat repository code as the source of truth and mention the mismatch during review.

---

## 1. Architectural Constraints

The following rules are hard constraints. Violations are considered code quality failures.

### A. Renderer Process Boundaries

- Each renderer window (`main` / `control` / `explorer` / `copilot` / `terminal` / `automation` / `mirror`) is an independent Vite entry. Do not directly import another window's entry or private page resources across window boundaries.
- `desktop/src` is the main window and shared renderer resources; `desktop/pages/<window>` contains window-private resources.
- Renderer code must not directly import Electron main process modules, Node main process services, or `desktop/electron` business implementations.
- Renderer-to-main communication must go through interfaces exposed via `window.$preload`, `window.$preload.ipcRenderer`, or wrapped IPC channels.
- Business capabilities shared across multiple windows should be extracted to `desktop/src/hooks`, `desktop/src/utils`, `desktop/src/components`, or a workspace package. Do not reverse-import from one window directory into another.

### B. IPC Selection Rules

- Simple request-response: use `window.$preload.ipcRenderer.invoke(...)` / `ipcMain.handle(...)`.
- Event notifications: use `window.$preload.ipcRenderer.send/on(...)`, keeping channel names clear and cleanable.
- Passing callbacks/functions across the process boundary: use `ipcxRenderer.invoke` / `ipcxRenderer.invokeRetained` and `ipcxMain.handle` from `@escrcpy/electron-ipcx`.
- All main-process handlers must be registered inside the module/service/plugin `apply()` and must `removeHandler` or release resources in the returned dispose function.
- Do not add ad-hoc global exposures in preload that bypass `createMiddleware()`. Do not leak raw main-process objects to the renderer.

### C. Main Process Extension Rules

- New features must be registered as `@escrcpy/electron-setup` plugins, modules, or services.
- `desktop/electron/main.js` is responsible only for importing and assembling via `mainApp.use(...)`. Business logic does not belong here.
- Window capabilities use `createWindowManager(...)`; window lifecycle logic goes in `hooks`.
- Do not put business logic in preload. Preload is for bridging and middleware exposure only.
- Do not hardcode platform paths. scrcpy, adb, and gnirehtet paths must be resolved through `desktop/electron/configs/which/` and `whichResolve()`.

### D. Package Boundary Rules

- `packages/wscrcpy` maintains core contracts including `WscrcpySession`, `ScrcpyConnectionManager`, `DeviceTarget`, and `SCRCPY_CHANNELS`. The desktop layer must not override or bypass these.
- Shared types from `packages/wscrcpy` must come from `shared/types.ts`; channel names must come from `shared/channels.ts`. Avoid scattering literal strings and interfaces.
- Workspace packages use TypeScript with explicit types; the desktop app body uses JavaScript + JSDoc. Do not mass-migrate desktop to TS, and do not downgrade TS packages to loose JS style.
- Native dependencies and core build dependencies (Electron, sharp, tsdown, TypeScript, Vite) are pinned/overridden centrally in `pnpm-workspace.yaml`. Do not override them in individual packages.

### E. Build and Style Rules

- Turbo disables cache for Electron-related builds. Do not assume build artifacts are incremental or cache-hit.
- Styling uses existing UnoCSS utilities, `@escrcpy/unocss-preset-shades`, UnoCSS icons, Element Plus, and project-local PostCSS. Do not introduce new CSS-in-JS, Tailwind configs, or UI component libraries.
- Element Plus is the existing UI infrastructure and may be reused. Do not introduce Ant Design, Naive UI, shadcn, or other new UI systems.

---

## 2. Code Generation Guidelines

### Vue Component Conventions

```vue
<script setup>
const props = defineProps({
  device: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['success'])

const loading = ref(false)
const title = computed(() => window.t('device.control.title'))

async function handleClick() {
  loading.value = true
  try {
    emit('success')
  }
  finally {
    loading.value = false
  }
}
</script>
```

- New desktop SFCs default to Vue 3 Composition API + `<script setup>`.
- Desktop `.vue` files primarily use JavaScript SFC style. `defineProps({ ... })` and `defineEmits([...])` use runtime object/array syntax. Do not write `defineProps<{ ... }>()` in JS SFCs.
- `ref`, `computed`, `watch`, `nextTick`, Pinia stores, VueUse, and router are typically auto-imported and do not require manual imports, sourced from `desktop/src/plugins/internal.js`.
- Use `$t('key')` in templates and `window.t('key')` in scripts. Do not assume bare `t()` is auto-imported.
- Split components by responsibility. Reusable components go in `components/<feature>/index.vue`; window-private components go in `desktop/pages/<window>/components`.
- Minor edits to existing Options API components may retain their style. New components should use `<script setup>`.

### Pinia Store Conventions

```javascript
export const useXxxStore = defineStore('app-xxx', () => {
  const list = ref([])
  const loading = ref(false)

  const hasItems = computed(() => list.value.length > 0)

  async function refresh() {
    loading.value = true
    try {
      list.value = await window.$preload.someApi.getList()
      return list.value
    }
    finally {
      loading.value = false
    }
  }

  return {
    list,
    loading,
    hasItems,
    refresh,
  }
})
```

- Use setup stores: `defineStore('app-domain', () => { ... })`.
- State via `ref`; derived values via `computed`; actions are plain or async functions.
- Persistent business state may use `pinia-plugin-persistedstate`'s `persist` config. Electron config, device config, and window-shared persistent data go through `window.$preload.store`.
- When syncing with `electron-store`, follow the `get/set/onDidChange` pattern and update local refs in watchers.
- When updating arrays or objects, prefer creating new arrays/objects to maintain the immutable update style found in existing stores.

### IPC Communication Conventions

```javascript
// renderer: simple request-response
const files = await window.$preload.ipcRenderer.invoke('show-open-dialog', {
  properties: ['openFile'],
})

// renderer: callback-friendly retained IPC
const { promise, dispose } = window.$preload.ipcxRenderer.invokeRetained('terminal:create-session', {
  type: 'device',
  instanceId,
  onData: chunk => terminal.write(chunk),
  onExit: code => handleExit(code),
})

const result = await promise
dispose()
```

```javascript
// main: register inside service apply(), cleanup on dispose
export default {
  name: 'module:example:service',
  apply() {
    ipcMain.handle('example:load', async (_event, payload) => {
      return loadExample(payload)
    })

    return () => {
      ipcMain.removeHandler('example:load')
    }
  },
}
```

- Channel naming should follow existing domain prefix conventions: `mirror-*`, `terminal:*`, `scrcpy:*`, `show-*`, etc. wscrcpy must reuse `SCRCPY_CHANNELS`.
- Return values should follow existing project formats: simple handlers may return data directly; complex services may return `{ success, error }` or `{ ok, error }`, but be consistent within a domain.
- When using `invokeRetained` for renderer callback lifecycles, the caller must save and call `dispose()`.

### Main Process Module / Service Conventions

```javascript
import window from './window.js'
import service from './service.js'

export default {
  name: 'module:feature',
  apply(mainApp) {
    mainApp.use(window)
    mainApp.use(service)
  },
}
```

```javascript
import { createWindowManager } from '@escrcpy/electron-setup/main'

export default {
  name: 'module:feature:window',
  apply() {
    createWindowManager('pages/feature', {
      singleton: false,
      browserWindow: {},
      hooks: {
        beforeClose(win, context) {
          // release per-window resources here
        },
      },
    })
  },
}
```

- `index.js` composes sub-plugins; `window.js` manages windows; `service.js` manages IPC and background services.
- Plugin names follow the pattern `module:<name>`, `module:<name>:window`, `module:<name>:service`, or `service:<name>`.
- When `apply()` returns a function, that function is the dispose handler. It must clean up IPC handlers, sessions, watchers, processes, and event listeners.

### Path Alias Conventions

```javascript
// renderer shared
import AppHeader from '$/components/app-header/index.vue'
import { sleep } from '$/utils/index.js'

// root metadata
import { name as packageName } from '$root/package.json'

// main process only
import { getAdbPath } from '$electron/configs/index.js'

// window-private resource
import { ApiModelEnum } from '$copilot/dicts/api.js'
```

- `$` / `$renderer` points to `desktop/src` for shared renderer code.
- `$root` points to the `desktop` package root, not the monorepo root. Confirm the target before reaching for cross-layer package metadata.
- `$electron` is for the Electron main/preload/middleware side only.
- `$control`, `$explorer`, `$copilot`, `$terminal`, `$automation`, `$mirror` are for the corresponding window's private resources or configurations that window explicitly owns.
- Avoid deep `../../../` relative paths. Prefer Vite aliases.

### i18n Conventions

```javascript
// template
{{ $t('device.control.file.manager.upload') }}

// script
ElMessage.success(window.t('common.success'))
ElMessage.error(window.t('device.control.file.manager.upload.error', { error: error.message }))
```

- All user-visible strings must go through locale. Do not add hardcoded Chinese or English UI strings.
- Keys use dot-separated hierarchies organized by domain: `device.control.file.manager.*`, `automation.step.*`, `common.*`.
- `desktop/electron/resources/extra/common/locales/zh-CN.json` is the primary language file. At minimum, `en-US.json` must be kept in sync.
- After modifying locale files, run `pnpm lang-sync` to maintain key order and completeness across all language files.

### UnoCSS / UI Conventions

```html
<div class="flex items-center gap-2 px-2 py-1 rounded-full bg-white dark:bg-gray-800">
  <el-button text icon="Refresh" circle :title="$t('device.refresh.name')" />
</div>
```

- Prefer UnoCSS utilities: `flex`, `size-full`, `min-h-0`, `space-x-*`, `text-primary-*`, `dark:*`, icon preset classes like `i-mdi-*`.
- Scoped `style lang="postcss"` with `@apply` may be used to override Element Plus or xterm local styles.
- Use existing Element Plus components and project plugins. Do not introduce third-party UI systems.
- Inline `style` is only for dynamic values or browser-required values (e.g. `touch-action: none;`). Use classes for regular styles.

### Async and Error Handling Conventions

```javascript
async function doSomething() {
  try {
    const result = await someAsyncOp()
    return result
  }
  catch (error) {
    console.error('[Feature]', error)
    ElMessage.error(window.t('common.failed'))
    throw error
  }
}
```

- UI interactions should use `async/await` + `try/catch/finally` to manage loading state.
- Main process services should catch errors with domain-prefixed logging and return a domain-consistent error structure or re-throw.
- Silent catches are not permitted. User-visible failures must be surfaced via `ElMessage`, `ElMessageBox`, or the existing message/loading mechanism.
- wscrcpy connection lifecycle must be serialized, following the `enqueueDeviceOp` / `enqueue` pattern to prevent concurrent start/stop/restart collisions.
- Special rule for scrcpy middleware thenables: do not resolve with the scrcpy process object. That object is wrapped with `Object.assign(..., { then })`, so resolving with it will trigger Promise adoption and may cause hangs. Resolve with plain data or `undefined`.

### TypeScript / JSDoc Conventions

- `desktop/` uses JS + JSDoc as the primary style. Complex functions, stores, and payloads may use JSDoc to document intent and parameters.
- `packages/wscrcpy`, `packages/electron-setup`, and `packages/electron-ipcx` use TypeScript types, interfaces, type aliases, and exported contracts.
- When adding new wscrcpy capabilities, update `shared/types.ts` / `shared/channels.ts` first, then update the service, hook, and component surface.
- Do not add widespread strict TS assertions or `.ts` migrations to desktop unless the task explicitly requires it and the impact is controlled.

---

## 3. Best Practices

### Reuse-First Principle

1. Before generating any new code, search `desktop/src`, `desktop/pages/<window>`, `desktop/electron`, and `packages` for similar existing implementations.
2. For hooks/composables, check `desktop/src/hooks`, window-private `hooks`, and `packages/wscrcpy/hooks` first.
3. For utilities, check `desktop/src/utils`, `desktop/electron/helpers`, and `packages/wscrcpy/shared` first.
4. For IPC channels and wscrcpy types, reuse constants and shared types. Do not copy strings and interfaces.
5. For UI interactions, reuse Element Plus, project plugins, and existing loading/message/dialog patterns.
6. When a task depends on third-party API details, read the matching `context/**` document before implementing; do not invent API shape from memory.

### Modular Design Principles

1. New main-process features are implemented as plugin/module/service with an `apply()` lifecycle.
2. Renderer logic is split by window responsibility. Do not implement control/explorer/terminal/mirror private logic inside the main window.
3. Extract shared business logic to `desktop/src` or a workspace package. Do not copy-paste repeated logic across windows.
4. Long-lived resources (processes, sessions, watchers, IPC listeners) must have a clear owner and cleanup path.
5. Windows/Linux/macOS branching should be centralized in helpers/configs/window hooks, not scattered across UI templates.

### Performance Guidelines

1. Large lists, file trees, terminals, and mirror streams must avoid unnecessary deep-reactive objects and template side effects.
2. Cache expensive computations with `computed`. Do not call methods with side effects in templates.
3. Multi-device operations should use concurrency limits or queues, following existing patterns with `p-limit`, `deviceQueues`, and `Promise.allSettled`.
4. wscrcpy video/audio/control streams must respect session ownership. Stop sessions owned by a window when that window is destroyed.
5. Audio stream handling should be conservative: on Windows, `clipboardAutosync` may affect stability in audio + control scenarios. Do not change the default strategy casually.

### Documentation and Comment Conventions

1. Comments explain business intent, lifecycle constraints, or protocol semantics — not line-by-line code narration.
2. Public IPC channels, preload surface, and wscrcpy public controllers should have JSDoc or centralized constant comments.
3. Use JSDoc for complex desktop JS; use the type system for package-level contracts in TS packages.
4. When modifying user-facing documentation or locale keys, check whether `README*.md`, `docs/`, or locale files also need updating.

---

## 4. Anti-Patterns

The following patterns should be actively avoided in Escrcpy:

```text
❌ Importing Electron main process modules directly in renderer
❌ Directly importing another window's private resources from one independent window directory
❌ Adding ad-hoc global bridges outside preload, or exposing raw APIs not organized through middleware
❌ Registering ipcMain.handle at the top level or outside a module, without removeHandler
❌ Hardcoding platform paths like /usr/local/bin/adb or scrcpy.exe
❌ Adding new Vue Options API components as the default approach
❌ Writing TypeScript generic props/emits in desktop JS SFCs
❌ Introducing new CSS frameworks, CSS-in-JS, or UI component libraries
❌ Adding user-visible hardcoded Chinese or English strings
❌ Bypassing Pinia actions or store methods to directly mutate shared persistent state
❌ Bypassing packages/wscrcpy contracts: WscrcpySession, DeviceTarget, SCRCPY_CHANNELS
❌ Passing the scrcpy process object to a Promise resolve or deferred resolve
❌ Mass-migrating desktop to strict TS
❌ Overriding workspace-pinned dependencies (Electron, sharp, Vite, TypeScript, etc.) in individual packages
❌ Naming new directories or plain files in camelCase/PascalCase, unless extending an existing public API file with an established naming pattern
```

---

## 5. Code Review Checklist

After AI generates code, verify each item before committing:

### Architecture

- [ ] Renderer/main process boundaries are clean with no cross-boundary imports?
- [ ] New windows or main process capabilities properly wired via Vite input, module, service, or window manager?
- [ ] IPC uses the correct mechanism: plain invoke, event send/on, or ipcx callback?
- [ ] IPC handlers registered inside `apply()` and cleaned up in dispose?
- [ ] Binary paths resolved through `desktop/electron/configs/which` or resources helper?
- [ ] wscrcpy changes respect session ownership, DeviceTarget, and SCRCPY_CHANNELS?

### Code Style

- [ ] New desktop Vue components use `<script setup>` + Composition API?
- [ ] Desktop JS SFCs use runtime `defineProps({})` / `defineEmits([])`?
- [ ] No unnecessary `import { ref, computed } from 'vue'` (desktop auto-import typically handles this)?
- [ ] Paths use correct aliases, avoiding deep relative paths?
- [ ] File/directory names follow kebab-case, or have a clear existing API naming exception?
- [ ] No silent catches, bare debug console logs, or failures without user feedback?

### Engineering Standards

- [ ] New i18n keys synced to at least `zh-CN.json` and `en-US.json`?
- [ ] `pnpm lang-sync` run after locale changes?
- [ ] Minimum meaningful validation run: `pnpm lint`, package-level typecheck, or relevant build?
- [ ] Electron main/preload/Vite/dependency/release changes verified with `pnpm build`?
- [ ] wscrcpy changes verified with `pnpm exec tsc -p packages/wscrcpy/tsconfig.json --pretty false`?

### Reuse

- [ ] No reimplementation of existing hooks, stores, helpers, IPC channels, or wscrcpy types?
- [ ] Element Plus, UnoCSS preset, and project message/loading/dialog patterns reused?
- [ ] Multi-device, file transfer, terminal, and scrcpy stream logic reusing existing queue, callback, and cleanup patterns?
- [ ] Relevant `context/**` docs consulted for Element Plus, VueUse, Floating UI, or Tango ADB API details when those areas changed?

---

## 6. Agent Workflow

When an agent receives a development task for Escrcpy, follow this standard workflow:

```text
STEP 1 — Understand the Task
  ├── Read AGENTS.md and this file; confirm scope: desktop/src, desktop/pages, desktop/electron, packages
  ├── If third-party APIs are involved, load the matching local context doc from context/**
  ├── Identify target window: main/control/explorer/copilot/terminal/automation/mirror
  ├── Determine whether this is renderer, preload, main-process module/service, or workspace package
  └── Determine if i18n, IPC, binary paths, wscrcpy session, or dependency versions are involved

STEP 2 — Explore Existing Code
  ├── Search relevant directories for reusable components, hooks, stores, helpers, channels, and types
  ├── Read the current implementation of affected modules — do not generate from memory
  ├── Cross-check local context docs against nearby project usage and package versions
  ├── For cross-process communication, confirm domain channel naming and cleanup patterns
  └── For UI, confirm existing Element Plus + UnoCSS visual patterns

STEP 3 — Implement
  ├── Strictly follow the Code Generation Guidelines
  ├── Reuse existing infrastructure; do not reinvent the wheel
  ├── For i18n changes, sync zh-CN + en-US and run lang-sync
  ├── Wire new main-process capabilities as module/service/plugin
  └── For wscrcpy additions, update shared contract first, then service/hook/component

STEP 4 — Self-Review
  ├── Go through the Review Checklist item by item
  ├── Proactively flag any compromise that deviates from existing patterns
  └── Do not touch unrelated dirty worktree; do not revert user changes

STEP 5 — Validate
  ├── Regular renderer/desktop changes → pnpm lint
  ├── wscrcpy changes → pnpm exec tsc -p packages/wscrcpy/tsconfig.json --pretty false
  ├── i18n changes → pnpm lang-sync
  ├── Electron main/preload/Vite/dependency changes → pnpm build
  └── Packaging/release → pnpm build:win | pnpm build:mac | pnpm build:linux
```

---

## 7. Skill Evolution Notes

### Conditions That Trigger an Update

- A new renderer window entry is added or `desktop/vite.config.js` inputs/aliases change.
- A new workspace package is introduced or package boundaries shift.
- UnoCSS preset, Element Plus plugins, or global style strategy changes.
- Major version upgrades to Electron, Vue, Vite, Pinia, UnoCSS, or scrcpy/yume-chan.
- Auto-import symbols, global plugins, or preload surface is added or removed.
- New IPC channel naming conventions or wscrcpy channel constants are established.
- New cross-team code style consensus is reached or old patterns are deprecated.

### Update Process

Re-run the analysis process for this file: read architecture files, sample store/views/modules/wscrcpy, compare architectural changes in git diff, update the relevant sections, and update the `last_analyzed` commit hash.

### Conflicting Style Notes

- 2026-05-28: Desktop contains a mix of legacy Options API components and `<script setup>`. New components use `<script setup>`; minor edits to old components may maintain local consistency.
- 2026-05-28: Desktop plain files/directories follow kebab-case. `packages/wscrcpy` existing public hook files like `useWscrcpyConnection.ts` use camel/PascalCase API naming. New desktop files continue kebab-case; extensions to wscrcpy public hooks may follow that package's existing export naming.
- 2026-05-28: Template suggestions showing `defineProps<{ ... }>()` do not match current desktop JS SFC conventions. Desktop uses runtime props/emits; TypeScript generics belong in `.ts` packages or explicitly typed TS SFCs.