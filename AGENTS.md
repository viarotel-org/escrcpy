# AGENTS

Escrcpy is a pnpm + Turborepo monorepo for an Electron GUI around Android mirroring/control with scrcpy. Keep this file focused on agent-critical facts; link existing docs instead of copying them. For the broader overview, start with [develop.md](../develop.md).

## Architecture

- [desktop/](../desktop/) is the Electron app. The main process is plugin-based via `@escrcpy/electron-setup`; the entry point is [desktop/electron/main.js](../desktop/electron/main.js).
- Renderer windows are separate Vite entries in [desktop/vite.config.js](../desktop/vite.config.js): `main`, `control`, `explorer`, `copilot`, `terminal`, `automation`, and `mirror`.
- Window modules live under [desktop/electron/modules/](../desktop/electron/modules/). Register main-process features as modules/services instead of adding logic to the preload script.
- [packages/electron-setup/](../packages/electron-setup/) provides app/plugin/window management primitives. [packages/electron-ipcx/README.md](../packages/electron-ipcx/README.md) documents IPC with renderer callbacks.
- [packages/wscrcpy/](../packages/wscrcpy/) contains scrcpy session/client logic. Preserve its `WscrcpySession` model and `DeviceTarget = 'all' | 'primary' | string | string[]` contract.
- [packages/adbx/](../packages/adbx/) is an injected adbkit capability layer; it prefers yadb when available and falls back to standard ADB.
- [packages/shared/](../packages/shared/) contains platform-neutral utilities shared across workspace packages.
- [packages/unocss-preset-shades/](../packages/unocss-preset-shades/) is an UnoCSS preset that generates color shades from a base color.

## Commands

- Install: `corepack enable pnpm && pnpm install`.
- Dev: `pnpm dev` starts Turbo-managed app development; the desktop Vite server uses port `1535`.
- Lint: `pnpm lint` or `pnpm lint:fix`.
- Build: `pnpm build`; platform variants are `pnpm build:win`, `pnpm build:mac`, and `pnpm build:linux`.
- Docs: `pnpm docs:dev`, `pnpm docs:build`, `pnpm docs:preview`.
- i18n sync: `pnpm lang-sync` after editing locale keys in `desktop/electron/resources/extra/common/locales/*.json`.
- Electron install repair: `pnpm electron-fix` when Electron reports an incomplete install.
- wscrcpy type check: `pnpm exec tsc -p packages/wscrcpy/tsconfig.json --pretty false`.

There is no repo-wide test script today. For changes, run the smallest meaningful verification first, then `pnpm lint`; use `pnpm build` for packaging, Electron main-process, Vite config, dependency, or release-sensitive changes.

## Frontend Patterns

- Vue code uses Vue 3 Composition API with `<script setup>` and auto-imported Vue, VueUse, Pinia, router, `definePage`, and `t` globals from [desktop/src/plugins/internal.js](../desktop/src/plugins/internal.js) and [eslint.config.js](../eslint.config.js).
- Use existing aliases from [desktop/vite.config.js](../desktop/vite.config.js): `$`, `$root`, `$docs`, `$renderer`, `$electron`, `$control`, `$explorer`, `$copilot`, `$terminal`, `$automation`, and `$mirror`.
- File-based routes live in [desktop/src/views/](../desktop/src/views/) and exclude nested `components` folders.
- Pinia stores live in [desktop/src/store/](../desktop/src/store/), with persisted state and `window.$preload.store` for electron-store integration. See [desktop/src/store/device/index.js](../desktop/src/store/device/index.js) for the main pattern.
- Styling uses UnoCSS utilities and project presets from [desktop/uno.config.js](../desktop/uno.config.js). Prefer local utility/style patterns over introducing new UI systems.

## Electron And IPC

- Use regular `ipcRenderer.invoke` / `ipcMain.handle` for simple request-response channels.
- Use `ipcxRenderer.invoke` and `ipcxMain.handle` from `@escrcpy/electron-ipcx` when callbacks or functions must cross the renderer-main boundary.
- Keep preload exposure minimal and routed through existing middleware; renderer code should use `window.$preload` surfaces rather than importing Electron main-process modules.
- External binary paths for scrcpy, adb, and gnirehtet are resolved through [desktop/electron/configs/which/](../desktop/electron/configs/which/) with electron-store/user-path fallbacks. Do not hardcode platform paths.

## i18n

- Locale JSON is stored in `desktop/electron/resources/extra/common/locales/*.json`; `zh-CN` is the primary language for sync.
- Main-process i18n uses `i18next-fs-backend`, exposes helpers through preload, and renderer translation uses the global `t` helper.
- After adding or renaming translation keys, run `pnpm lang-sync` and check both Chinese and English strings.

## Gotchas

- In `desktop/electron/middleware/scrcpy`, never resolve a ready Promise with the scrcpy process object directly. It is thenable-like and Promise resolution can adopt it, causing `resolveOnReady` to hang; resolve with plain data or `undefined`.
- Turbo disables caching for Electron packaging in [turbo.json](../turbo.json). Do not assume packaging output is incremental or cache-backed.
- Native dependencies such as `sharp`, Electron, Vite, tsdown, and TypeScript are pinned/overridden in [pnpm-workspace.yaml](../pnpm-workspace.yaml); change them deliberately.
- Audio in wscrcpy is intentionally opt-in by default. On Windows, audio plus control should default `clipboardAutosync` to `false` because clipboard device messages can destabilize the controller while streams keep running.
- The desktop app is mostly JavaScript/JSDoc, while workspace packages may be TypeScript. Do not add broad strict TS assumptions to the desktop renderer/main app.
- Use kebab-case for new directories and files.

## Documentation Links

- [develop.md](../develop.md) - developer setup, architecture, and contribution basics.
- [README.md](../README.md), [README-CN.md](../README-CN.md), and [README-RU.md](../README-RU.md) - user-facing project overview.
- [packages/electron-setup/README.md](../packages/electron-setup/README.md) - Electron plugin/window framework.
- [packages/electron-ipcx/README.md](../packages/electron-ipcx/README.md) - function-friendly IPC contract.
- [docs/en/](../docs/en/) and [docs/zhHans/](../docs/zhHans/) - VitePress product documentation.
