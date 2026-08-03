---
name: viarotel
description: "Use when: coding in Viarotel-maintained projects, especially Vue, Electron, monorepo, frontend UI, IPC, state management, composables, i18n, or project-style consistency tasks. Apply Viarotel's personal coding habits: explicit control flow, component autonomy, reuse-first implementation, kebab-case files, clean boundaries, and validation before completion."
argument-hint: "Describe the code change, review, refactor, or debugging task"
---

# Viarotel Coding Preferences

## Skill Objective

Guide AI coding agents to generate code that matches Viarotel's long-term engineering style: explicit, reusable, locally consistent, component-centered, and easy to trace. Prefer established project patterns over new abstractions, keep changes scoped, and validate with the smallest meaningful checks before finishing.

## Trigger Conditions

Use this skill when working on Viarotel projects or when the task involves:

- Vue 2 / Vue 3 components, composables, stores, forms, tables, dialogs, or UI interactions.
- Electron, desktop apps, renderer/main process boundaries, preload bridges, IPC, or long-lived resources.
- Monorepo or package-boundary decisions.
- i18n, user-facing text, frontend styling, UI libraries, or design consistency.
- Refactors, bug fixes, reviews, or generated code that must match existing project style.

If a project also provides a project-specific skill or `AGENTS.md`, load and follow that project guidance first. Use this skill as the personal style layer on top, unless it conflicts with stricter local rules.

## Working Rules

1. Read nearby code before editing. Reuse existing components, hooks, stores, helpers, constants, channels, aliases, styles, and validation commands.
2. Keep scope tight. Do not perform unrelated refactors, broad migrations, dependency churn, or style rewrites.
3. Prefer explicit control flow. A reader should quickly see who calls what, when it happens, and how the result is handled.
4. Keep architecture boundaries clean. UI code should not import backend, main-process, or platform implementation details directly; cross-boundary work must go through the established bridge, API, IPC, or service layer.
5. Long-lived resources need owners and cleanup paths: event listeners, timers, watchers, IPC handlers, processes, streams, subscriptions, and retained callbacks.
6. Surface failures. Avoid silent catches; show user-facing errors through the existing message/dialog/loading system and log domain context where appropriate.
7. Validate before completion with the smallest relevant command first; run broader checks only when the change touches build, packaging, dependencies, shared contracts, or release-sensitive paths.

## Vue Preferences

### Component Autonomy

- Components should own the state and side effects closest to their responsibility, including data loading, dialog state, form state, and local loading/error state.
- Parent components pass initial data and configuration through `props`; avoid making parents orchestrate every child component's internal data lifecycle.
- For parent-to-child behavior such as opening dialogs, refreshing lists, or resetting forms, prefer explicit method calls through refs or exposed methods instead of driving behavior through reactive prop toggles.

### State And Effects

- Avoid `watch` for side effects such as API calls, modal control, and hidden orchestration. Prefer direct methods, computed values, lifecycle hooks, or explicit event handlers.
- Put initialization side effects in `mounted` / `onMounted` when they depend on component lifecycle, DOM, timers, or initial data loading.
- Do not put side-effectful methods in templates. Cache derived values with `computed`.

### Composables

- Composable functions use the `useXxx` naming pattern.
- Return a single `reactive` object from composables so callers use `hook.property` / `hook.method` access and avoid losing reactivity through destructuring.
- Internal composable implementation may use `ref`, `reactive`, or other primitives as appropriate; the external contract should stay stable and object-shaped.

### Component Style

- Prefer Vue 3 Composition API and `<script setup>` for new Vue 3 components, while preserving local style in legacy components when doing small edits.
- Define props and emits in the style already used by the project. Do not introduce TypeScript generic props/emits into JavaScript SFCs.
- Split components by responsibility. Reusable pieces live in shared component locations; feature-private pieces stay near the feature that owns them.

## Code Style

- Prefer named `function xxx() {}` declarations for top-level functions and component methods. Use arrow functions mainly for short callbacks.
- Always use braces for `if`, `else`, loops, and other statement bodies. Avoid one-line `if (x) return` forms.
- Prefer immutable updates for arrays and objects unless the surrounding framework or local pattern clearly expects controlled mutation.
- Use descriptive names; boolean names should read like `isXxx`, `hasXxx`, `canXxx`, or `shouldXxx`.
- Add comments only for business intent, lifecycle constraints, protocol semantics, or non-obvious tradeoffs. Do not narrate obvious code.

## Files, Naming, And Imports

- New directories and plain source files should use kebab-case unless extending an existing public API or local convention that clearly uses another style.
- Prefer component directories with an `index.vue` entry when the component may own subcomponents, local composables, styles, or assets.
- Prefer configured path aliases over deep `../../../` relative paths.
- Do not scatter duplicated strings, event names, channel names, schema shapes, or type contracts. Centralize and reuse existing constants/types.

## UI, Styling, And i18n

- Reuse the project's existing UI library, icon system, styling utilities, tokens, message/dialog/loading APIs, and layout patterns.
- Do not introduce a new UI framework, CSS framework, CSS-in-JS layer, or major dependency unless the task explicitly requires it and the tradeoff is clear.
- Regular styling should use existing classes, utilities, or scoped styles. Inline styles are reserved for dynamic or browser-required values.
- All user-visible strings should go through the project's i18n system when one exists. Keep primary and secondary locales in sync according to local workflow.

## IPC, Services, And Boundaries

- Use request-response IPC/API mechanisms for simple calls and callback-capable mechanisms only when callbacks or retained lifecycles are genuinely needed.
- Register handlers inside the owning service/module lifecycle, not at arbitrary top level. Cleanup handlers and retained resources in the dispose/unmount path.
- Keep bridge/preload layers thin. They expose safe surfaces; business logic belongs in services, modules, stores, hooks, or feature code.
- Shared behavior should move to a shared renderer utility, composable, service, or package rather than being copied between windows/features.

## Anti-Patterns

Avoid these unless a project-specific rule explicitly requires them:

- Using `watch` as a hidden command bus for API requests or UI behavior.
- Destructuring composable return values when that can lose reactive semantics.
- Using `const fn = () => {}` for ordinary top-level/component methods.
- Omitting braces in single-line conditionals.
- Letting parent pages own all child data loading and then passing everything downward.
- Driving child dialog/list/form behavior through reactive flags instead of explicit calls.
- Leaving event bus, IPC, timer, watcher, stream, or subscription cleanup implicit.
- Importing across architectural boundaries or from another feature's private internals.
- Adding hardcoded user-facing Chinese or English strings when i18n exists.
- Introducing new frameworks or dependencies where existing project infrastructure is sufficient.

## Review Checklist

Before marking work complete, verify:

- The implementation reuses nearby project patterns and avoids duplicated infrastructure.
- Control flow is explicit and easy to trace.
- Components own appropriate local state and side effects.
- Boundaries between UI, services, platform code, and packages remain clean.
- Long-lived resources have cleanup.
- User-visible failures are handled and surfaced.
- File names, imports, i18n, styling, and UI components match local conventions.
- The smallest meaningful validation was run, or the reason it could not be run is stated clearly.