# @escrcpy/adbx

Injected adbkit capability layer for Escrcpy. Create it with
`createAdbx({ adb, yadbPath })`; it never creates an adbkit client itself.

Feature APIs prefer yadb when its binary is available and otherwise use the
standard ADB equivalent. Clipboard, drag, and pinch deliberately report that
yadb is required because Android ADB has no equivalent operation.
