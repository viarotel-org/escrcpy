# Copilot Expose API

本模块为渲染进程提供 Copilot 相关 API，用于与 Copilot 可执行文件通信。

## API 列表

### 任务执行

#### `window.copilot.execute(task, options)`

执行 AI 任务指令。

**参数：**
- `task` (string): 任务指令，如 "打开微信"
- `options` (object):
  - `deviceId` (string|string[]): 设备ID，批量时传入数组
  - `mode` (string): 模式，'single' 或 'batch'
  - `onOutput` (function): 实时输出回调
  - `onError` (function): 错误输出回调
  - `maxSteps` (number): 最大执行步数
  - `quiet` (boolean): 静默模式
  - `timeout` (number): 超时时间（毫秒）

**返回值：** `Promise<{output: string, exitCode: number}>`

#### `window.copilot.stop()`

停止当前正在执行的任务。

### 设备管理

#### `window.copilot.listDevices()`

列出已连接的设备。

**返回值：** `Promise<Array<{id: string, name: string}>>`

#### `window.copilot.connect(address)`

连接远程设备。

**参数：**
- `address` (string): 设备地址，格式为 `IP:端口`

#### `window.copilot.disconnect(address)`

断开设备连接。

**参数：**
- `address` (string): 设备地址，传 'all' 断开所有设备

#### `window.copilot.enableTcpip(deviceId, port)`

启用 TCP/IP 调试。

**参数：**
- `deviceId` (string): 设备ID
- `port` (number): 端口号，默认 5555

### 应用管理

#### `window.copilot.listApps()`

列出支持的应用列表。

**返回值：** `Promise<string[]>`

### 配置管理

#### `window.copilot.getConfig()`

获取 Copilot 配置。

**返回值：** 配置对象

#### `window.copilot.setConfig(key, value)`

设置 Copilot 配置。

**参数：**
- `key` (string): 配置键，如 'apiKey'，传空则替换整个配置
- `value` (any): 配置值

#### `window.copilot.getDefaultConfig()`

获取默认配置。

### 工具函数

#### `window.copilot.getHelp()`

获取 CLI 帮助信息。

#### `window.copilot.formatError(type, message)`

格式化错误信息。

**参数：**
- `type` (string): 错误类型 (CONFIG_MISSING, ADB_CONNECTION_FAILED, PROCESS_ERROR, TIMEOUT)
- `message` (string): 错误消息

**返回值：** `{code: string, message: string}`

## 使用示例

```javascript
// 执行任务
const result = await window.copilot.execute('打开微信', {
  deviceId: 'device123',
  onOutput: (output) => console.log(output),
})

// 获取设备列表
const devices = await window.copilot.listDevices()

// 获取配置
const config = window.copilot.getConfig()

// 更新 API Key
window.copilot.setConfig('apiKey', 'your-api-key')

// 停止任务
window.copilot.stop()
```
