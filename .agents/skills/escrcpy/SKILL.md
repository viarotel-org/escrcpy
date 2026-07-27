```markdown
# escrcpy Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `escrcpy` JavaScript codebase. You'll learn how to structure files, write imports/exports, follow commit message styles, and understand the project's approach to testing. This guide is ideal for contributors seeking consistency and clarity in their workflow.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `deviceManager.js`, `videoStreamHandler.js`

### Import Style
- Use **absolute imports** for modules.
  - Example:
    ```javascript
    import { startStream } from 'videoStreamHandler';
    ```

### Export Style
- Use **named exports**.
  - Example:
    ```javascript
    // In deviceManager.js
    export function connectDevice() { ... }
    export function disconnectDevice() { ... }
    ```

### Commit Messages
- Freeform commit messages, typically ~39 characters.
- No enforced prefix or type.
  - Example:  
    ```
    Fix device reconnection issue on timeout
    ```

## Workflows

### Adding a New Feature
**Trigger:** When you want to implement a new feature.
**Command:** `/add-feature`

1. Create a new file using camelCase naming.
2. Write your feature code using absolute imports and named exports.
3. Add or update relevant test files (`*.test.*`).
4. Commit your changes with a clear, concise message.
5. Open a pull request for review.

### Fixing a Bug
**Trigger:** When you need to fix a bug.
**Command:** `/fix-bug`

1. Locate the relevant file(s) using camelCase naming.
2. Apply your fix, ensuring you use absolute imports and named exports.
3. Update or add tests to cover the bug fix.
4. Commit with a descriptive message about the fix.
5. Submit a pull request.

### Running Tests
**Trigger:** Before merging or after making changes.
**Command:** `/run-tests`

1. Identify test files matching the `*.test.*` pattern.
2. Use the project's test runner (framework unknown; check project docs or scripts).
3. Review test output and fix any failing tests.
4. Re-run tests until all pass.

## Testing Patterns

- Test files follow the `*.test.*` naming convention (e.g., `deviceManager.test.js`).
- The specific testing framework is unknown—refer to project scripts or documentation for details.
- Place tests alongside or near the code they validate.

**Example:**
```javascript
// deviceManager.test.js
import { connectDevice } from 'deviceManager';

test('should connect device successfully', () => {
  expect(connectDevice()).toBe(true);
});
```

## Commands
| Command      | Purpose                                  |
|--------------|------------------------------------------|
| /add-feature | Start the process to add a new feature   |
| /fix-bug     | Begin a bug fix workflow                 |
| /run-tests   | Run all project tests                    |
```
