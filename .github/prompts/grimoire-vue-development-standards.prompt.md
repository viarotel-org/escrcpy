---
title: Vue Development Standards
description: A reusable Vue coding standard emphasizing autonomous business components, imperative component APIs, structured hooks, and maintainable TypeScript style.
category: coding
tags: [vue, frontend, architecture, composition-api, typescript, conventions]
keywords: [Vue, component autonomy, imperative refs, reactive hooks, TypeScript, coding standards, watch]
aliases: [vue-coding-standards, personal-vue-guidelines]
use_cases: [Define Vue project conventions, Review Vue component architecture, Guide refactoring of business components, Standardize Composition API hooks]
created: 2026-05-05T00:00:00+08:00
version: 1.0
source: "/grimoire"
related: []
applicable_models: []
---

# Vue Development Standards

## 1. Summary

Use these standards when designing, writing, reviewing, or refactoring Vue code.

Applicable scenarios include Vue 2, Vue 3, Composition API, `<script setup>`, admin systems, H5 pages, business components, dialogs, drawers, tables, forms, uploaders, selectors, and other common frontend engineering scenarios.

The core style emphasizes:

- Autonomous business components
- Imperative interaction for action-oriented components
- Encapsulated component state
- Explicit business workflows
- Object-style hooks
- Named business functions
- Clear TypeScript boundaries

## 2. Governing Philosophy

The goal is not to minimize line count. The goal is to build a stable frontend organization style based on component autonomy, parent-level scheduling, explicit workflows, object-style hooks, named functions, consistent type boundaries, and extensible documentation.

## 3. Primary Goals

- Favor autonomous business components that own their state, requests, and workflows.
- Let parent components coordinate page-level actions while child components execute concrete business behavior.
- Prefer explicit imperative method calls for action-oriented components instead of excessive prop-driven side effects.
- Keep state transitions visible, named, and traceable.
- Keep hooks object-oriented, reactive, stable, and non-destructured.
- Prefer named business functions and consistent TypeScript boundaries.

## 4. Component Architecture Rules

### 4.1 Business Components Own Business Behavior

Business components should contain their own business logic, internal state, API requests, and interaction behavior whenever possible.

Parent components should not over-manage child internals such as `visible`, `loading`, `list`, `pagination`, `formData`, or `selectedRows`, unless the child is purely presentational.

### 4.2 Parent Components Coordinate Entry Points

Parent components should handle scheduling and entry points, such as button clicks, route parameter reading, and deciding which business entry to invoke.

Child components should execute concrete behavior, such as opening dialogs, loading data, submitting forms, refreshing tables, and resetting state.

### 4.3 Prefer Imperative APIs for Action-Oriented Components

For dialogs, drawers, forms, tables, uploaders, and selectors, prefer exposing methods through `$refs`, `ref`, or `defineExpose`, such as:

- `open()`
- `close()`
- `reload()`
- `submit()`

Avoid driving child side effects through many props plus `watch`. Do not use prop changes as the primary trigger for opening dialogs, loading details, resetting forms, or refreshing data.

### 4.4 Use Props for Stable Context

Props are acceptable for stable context and configuration, such as:

- `tenantId`
- `projectId`
- `readonly`
- `mode`

### 4.5 Use Emits for Result Notification

Emits should notify results, such as:

- `success`
- `close`
- `selected`

Emits should not force the parent to complete the child component's internal workflow when that workflow belongs to the child.

## 5. State Management Rules

- Component internal state should be maintained by the component itself.
- Related state should usually be grouped in a single `reactive` object instead of scattered across many isolated `ref` declarations.
- Complex state changes should be expressed through named functions, not large inline assignments in templates or event handlers.
- State changes should happen in explicit methods instead of being hidden behind excessive `watch`, implicit side effects, or over-coupled reactive chains.
- Asynchronous requests inside components or hooks must explicitly maintain `loading` and use `try / finally` to restore it.

## 6. Lifecycle Rules

- Lifecycle hooks should only handle component initialization, resource registration, and cleanup.
- Do not use lifecycle hooks as overloaded business process entry points.
- Complex business logic should be extracted into named methods, and lifecycle hooks may call those methods.
- Behavior triggered by external user or page actions should be invoked through explicit methods rather than lifecycle hooks or prop changes.

## 7. Hook Design Rules

### 7.1 Naming

Hooks must be named with the `useXxx` pattern, where the name expresses a stable business or shared capability.

Hook instances should use business names such as `dialog`, `table`, or `form`. Do not add a `Ref` suffix to hook return objects.

### 7.2 Scope

Hooks should encapsulate reusable, relatively stable state and behavior. Do not create hooks merely to split temporary implementation steps.

### 7.3 Return Shape

Hook return values must be unified reactive objects.

External usage should read clearly as:

```ts
dialog.open()
table.reload()
form.submit()
```

Hook return values must be used as complete objects and must not be destructured.

### 7.4 Internal Structure

Inside hooks, define `state` and `methods` separately, then merge them into one reactive object for return.

## 8. Code Style Rules

### 8.1 Function Style

Prefer `function xxx() {}` declarations for ordinary functions, business functions, component methods, event handlers, API workflow methods, and hook internal methods.

Use arrow functions only for short-lived local callbacks, such as array methods, lifecycle callbacks, event callbacks, and Promise callbacks.

### 8.2 Control Flow

All `if` statements must use full braces, even for single-line guard clauses.

Guard clauses are allowed and encouraged when they reduce nesting, but they must use full blocks.

### 8.3 Naming

- Event handler functions should use the `handleXxx` naming pattern.
- Component instance refs should use the `xxxRef` suffix, such as `userDialogRef` and `userTableRef`.
- Hook return objects should not use the `Ref` suffix.

## 9. API Naming Rules

API method names should express data operation semantics clearly.

| Operation                              | Naming Pattern |
| -------------------------------------- | -------------- |
| Pagination, lists, conditional queries | `queryXxx`     |
| Details, single-record retrieval       | `getXxx`       |
| Creation                               | `createXxx`    |
| Update                                 | `updateXxx`    |
| Deletion                               | `removeXxx`    |
| Shared create/edit save action         | `saveXxx`      |
| Submit-style action                    | `submitXxx`    |
| Export                                 | `exportXxx`    |
| Import                                 | `importXxx`    |

Avoid generic names such as:

- `fetchData`
- `getData`
- `requestList`
- `doSubmit`
- `handleApi`
- `request`
- `handleRequest`

## 10. TypeScript Rules

- Avoid meaningless `any`. If `any` is truly necessary, keep it explicit, bounded, and local.
- API methods must explicitly declare request parameter types and response data types.
- Prefer `interface` for business entities, API parameters, and API response structures.
- Use `type` when it is more appropriate for unions, literal types, and utility type composition.
- Component `props` and `emits` must be explicitly typed.
- Methods exposed through `defineExpose` must declare parameter types because they are part of the component's external API.

## 11. Watch Usage

### 11.1 Anti-Patterns

Reject the following patterns:

- Uncontrolled use of `watch` for ordinary business workflows.
- Prop changes used as side-effect triggers for opening, initializing, loading, or resetting behavior.
- Destructuring hook return values.
- Declaring primary business methods as arrow functions.
- Single-line `if (condition) return` without braces.
- Parent components managing all internal state of non-presentational child components.
- Overly generic API method names that do not reveal business intent.

### 11.2 Allowed Exceptions

`watch` is acceptable when handling:

- Route parameter changes.
- Uncontrollable external reactive state.
- Third-party component or library state.
- Genuinely derived reactive side effects.
- Cross-boundary reactions that cannot be clearly expressed through method calls.

## 12. Recommended Patterns

### 12.1 Parent Invokes Child Imperative API

```vue
<template>
  <UserDialog ref="userDialogRef" :tenant-id="tenantId" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UserDialog from './UserDialog.vue'

const userDialogRef = ref<InstanceType<typeof UserDialog>>()

function handleCreate() {
  userDialogRef.value?.open()
}

function handleEdit(userId: string) {
  userDialogRef.value?.open(userId)
}
</script>
```

### 12.2 Child Owns Dialog Workflow

```ts
const state = reactive({
  visible: false,
  loading: false,
  formData: {},
})

async function open(userId?: string) {
  state.visible = true

  if (userId) {
    await fetchDetail(userId)
  }
}

async function fetchDetail(userId: string) {
  state.loading = true

  try {
    const data = await getUserDetail(userId)
    state.formData = data
  } finally {
    state.loading = false
  }
}

defineExpose({
  open,
})
```

### 12.3 Object-Style Hook

```ts
export function useTable() {
  const state = reactive({
    loading: false,
    list: [] as UserItem[],
    pageNum: 1,
    pageSize: 10,
    total: 0,
  })

  const methods = {
    reload,
    reset,
    handlePageChange,
  }

  async function reload() {
    state.loading = true

    try {
      const res = await queryUserPage({
        pageNum: state.pageNum,
        pageSize: state.pageSize,
      })

      state.list = res.list
      state.total = res.total
    } finally {
      state.loading = false
    }
  }

  function reset() {
    state.pageNum = 1
    reload()
  }

  function handlePageChange(pageNum: number) {
    state.pageNum = pageNum
    reload()
  }

  return reactive({
    ...toRefs(state),
    ...methods,
  })
}
```

## 13. Rule Extension Template

When adding a new rule, use the following structure:

````md
### x.x Rule Title

- Rule

  Describe what should be done.

- Reason

  Explain the engineering reason behind the rule.

- Recommended

```ts
// Recommended example
```

- Anti-pattern

```ts
// Not recommended example
```
````

## 14. Reusable Prompt Template

Use this lightweight template when applying the standards to a specific project or review target.

```md
Act as a senior Vue engineer and apply the Vue Development Standards when designing, writing, reviewing, or refactoring {{project_scope}} code.

Scope: {{vue_versions_and_scenarios}}.

Apply the standards especially to:
- Autonomous business components
- Imperative APIs for dialogs, drawers, forms, tables, uploaders, and selectors
- Explicit state transitions
- Object-style hooks
- Named business functions
- Consistent API naming
- Explicit TypeScript boundaries

Project-specific substitutions:
- command_components: {{command_components}}
- context_props: {{context_props}}
- result_events: {{result_events}}
- hook_instance_names: {{hook_instance_names}}
- component_ref_names: {{component_ref_names}}
- generic_api_names_to_avoid: {{generic_api_names_to_avoid}}
- watch_exceptions: {{watch_exceptions}}
```

## 15. Template Inputs

| Placeholder                      | Description                                                                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `{{project_scope}}`              | The Vue project, codebase, feature, component set, or review target to which the standards apply.                                   |
| `{{vue_versions_and_scenarios}}` | Vue versions, API styles, platforms, and business scenarios covered by the standards.                                               |
| `{{command_components}}`         | Action-oriented components that should expose imperative methods, such as dialogs, drawers, tables, forms, uploaders, or selectors. |
| `{{context_props}}`              | Stable props used as component context or configuration.                                                                            |
| `{{result_events}}`              | Events used to notify completed results back to parent components.                                                                  |
| `{{hook_instance_names}}`        | Example business names for hook return objects.                                                                                     |
| `{{component_ref_names}}`        | Example component instance ref names using the `xxxRef` suffix.                                                                     |
| `{{generic_api_names_to_avoid}}` | Ambiguous API method names that should be rejected in the target codebase.                                                          |
| `{{watch_exceptions}}`           | Valid exceptions where `watch` is acceptable.                                                                                       |

## 16. Usage Notes

- Reuse this document as a coding, review, or refactoring standard for Vue business applications that prefer component autonomy and explicit method calls.
- Apply the standards most strictly to action-oriented business components.
- Pure presentational components may still be prop-driven.
- Treat `watch`, `any`, prop-triggered side effects, destructured hooks, and parent-managed child internals as exceptions that require clear justification.