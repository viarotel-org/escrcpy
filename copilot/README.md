# Escrcpy Copilot 集成规范

## 概述

本文档定义了 Auto-GLM（以下简称 copilot）在 Escrcpy 中的完整集成规范。Copilot 为 Escrcpy 提供基于自然语言的 Android 设备智能操作能力，通过 GLM 视觉语言模型理解屏幕内容并自动执行用户指令。

### 技术架构

- **可执行文件位置**: `electron/resources/extra/{platform}/copilot` (已通过 PyInstaller 打包)
- **支持平台**: macOS (x64/arm64), Linux (x64/arm64), Windows (x64)
- **依赖**: ADB 环境变量注入 (参考 `electron/exposes/gnirehtet/index.js`)
- **参考文档**: `copilot/AutoGLM.md`

### 集成原则

1. **命名统一性**: 所有模块统一使用 `copilot` 命名
2. **架构一致性**: 遵循 Escrcpy 多窗口架构模式 (`control`/`explorer` 模块)
3. **配置持久化**: 使用 electron-store 管理用户配置
4. **进程安全性**: 使用 ProcessManager 管理外部进程生命周期
5. **跨平台兼容**: 处理路径引号和可执行权限

---

## 一、配置层 (electron-store)

### 1.1 配置结构

在 `electron/helpers/store.js` 管理的 `config.json` 中新增 `copilot` 配置：

```json
{
  "copilot": {
    "baseUrl": "https://open.bigmodel.cn/api/paas/v4",
    "apiKey": "",
    "model": "autoglm-phone",
    "prompts": [
      "打开微信",
      "打开支付宝扫码支付",
      "打开抖音并点赞第一个视频"
    ],
    "maxSteps": 50,
    "lang": "cn",
    "quiet": false
  }
}
```

### 1.2 配置字段说明

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `baseUrl` | String | 是 | - | GLM API 端点地址 |
| `apiKey` | String | 是 | - | API 认证密钥 (存储时需加密) |
| `model` | String | 否 | GLM-4V-Plus | 模型名称 |
| `prompts` | Array | 否 | [] | 常用指令快捷列表 |
| `maxSteps` | Number | 否 | 50 | 单次任务最大执行步数 |
| `lang` | String | 否 | cn | 系统提示语言 (cn/en) |
| `quiet` | Boolean | 否 | false | 是否静默模式 |

### 1.3 访问方式

- **主进程**: `appStore.get('copilot.baseUrl')`
- **渲染进程**: `window.appStore.get('copilot')`
- **配置更新**: `window.appStore.set('copilot.prompts', newArray)`

---

## 二、主进程层 (Electron Expose)

### 2.1 模块位置

```
electron/exposes/copilot/
├── index.js           # 主入口，暴露 window.copilot API
├── helper.js          # CLI 参数构建、输出解析等工具函数
└── README.md          # 模块使用文档
```

### 2.2 核心实现要求

#### 2.2.1 进程管理模式

遵循 Escrcpy 标准进程管理模式：

```javascript
import { spawn } from 'node:child_process'
import { electronAPI } from '@electron-toolkit/preload'
import { adbPath, copilotPath } from '$electron/configs/index.js'
import appStore from '$electron/helpers/store.js'
import { ProcessManager } from '$electron/helpers/index.js'

const processManager = new ProcessManager()

// 监听应用退出事件，自动清理进程
electronAPI.ipcRenderer.on('quit-before', () => {
  processManager.kill()
})
```

#### 2.2.2 环境变量注入

**关键要求**: 必须注入 ADB 环境变量（参考 `electron/exposes/gnirehtet/index.js:36`）

```javascript
async function shell(command, { stdout, stderr } = {}) {
  const spawnPath = appStore.get('common.copilotPath') || copilotPath
  const ADB = appStore.get('common.adbPath') || adbPath
  
  const args = command.split(' ')
  
  const copilotProcess = spawn(`"${spawnPath}"`, args, {
    env: { ...process.env, ADB },  // ⚠️ 必须注入 ADB 路径
    shell: true,
    encoding: 'utf8',
  })
  
  processManager.add(copilotProcess)
  // ... 后续处理
}
```

#### 2.2.3 暴露的 API 方法

```javascript
export default {
  // 执行任务
  execute(task, options = {}) { /* ... */ },
  
  // 设备管理
  listDevices() { /* ... */ },
  connect(address) { /* ... */ },
  disconnect(address) { /* ... */ },
  enableTcpip(deviceId, port) { /* ... */ },
  
  // 应用列表
  listApps() { /* ... */ },
  
  // 获取配置
  getConfig() { return appStore.get('copilot') },
  
  // 停止当前任务
  stop() { /* ... */ },
}
```

#### 2.2.4 参数构建规范

使用 helper 函数构建 CLI 参数：

```javascript
// copilot/helper.js
export function buildCopilotArgs(task, options = {}) {
  const config = appStore.get('copilot') || {}
  const args = []
  
  // 必选参数
  if (config.baseUrl) args.push('--base-url', config.baseUrl)
  if (config.apiKey) args.push('--apikey', config.apiKey)
  if (config.model) args.push('--model', config.model)
  
  // 可选参数
  if (options.deviceId) args.push('--device-id', options.deviceId)
  if (options.maxSteps) args.push('--max-steps', options.maxSteps)
  if (options.quiet) args.push('--quiet')
  if (config.lang) args.push('--lang', config.lang)
  
  // 任务指令
  if (task) args.push(task)
  
  return args.join(' ')
}
```

### 2.3 错误处理

- **配置缺失**: 检查 `baseUrl` 和 `apiKey`，返回友好错误提示
- **ADB 连接失败**: 捕获设备不可用错误
- **进程异常**: 监听 stderr 并解析错误信息
- **超时控制**: 设置任务执行超时限制

### 2.4 注册暴露

在 `electron/exposes/index.js` 中注册：

```javascript
import copilot from './copilot/index.js'
expose('copilot', copilot)
```

---

## 三、渲染进程层 (Copilot 窗口模块)

### 3.1 模块架构

遵循 Escrcpy 多窗口模块标准结构 (参考 `control`/`explorer`)：

```
copilot/
├── index.html              # 窗口入口 HTML
├── index.js                # Vue 应用入口
├── App.vue                 # 根组件
├── components/             # 模块私有组件
│   ├── ChatPanel/         # 聊天交互面板
│   ├── PromptManager/     # 快捷指令管理
│   ├── ConfigDialog/      # 配置对话框
│   └── TaskStatus/        # 任务状态显示
├── electron/
│   ├── main.js            # 主进程窗口管理
│   ├── events/            # 窗口事件处理
│   │   └── index.js
│   └── helpers/           # 窗口初始化工具
│       └── index.js
└── README.md              # 模块文档
```

### 3.2 窗口管理 (electron/main.js)

#### 3.2.1 窗口生命周期

```javascript
// copilot/electron/main.js
import { ipcMain } from 'electron'
import { initCopilotWindow } from './helpers/index.js'
import { isWindowDestroyed } from '$electron/helpers/index.js'
import * as events from './events/index.js'

export default (mainWindow) => {
  // 使用 Map 存储每个设备的 copilot 窗口
  const copilotWindows = new Map()

  ipcMain.handle('open-copilot-window', (event, data) => {
    const { devices = [], mode = 'single' } = data
    const windowKey = mode === 'batch' 
      ? 'batch' 
      : devices[0]?.id

    let copilotWindow = copilotWindows.get(windowKey)

    if (!isWindowDestroyed(copilotWindow)) {
      copilotWindow.show()
      copilotWindow.focus()
      return false
    }

    copilotWindow = initCopilotWindow(mainWindow, data)
    events.install(copilotWindow)
    copilotWindows.set(windowKey, copilotWindow)

    copilotWindow.on('closed', () => {
      copilotWindows.delete(windowKey)
      copilotWindow = void 0
    })

    copilotWindow.show()
    return true
  })

  ipcMain.handle('close-copilot-window', (event, data) => {
    const windowKey = data?.mode === 'batch' ? 'batch' : data?.deviceId
    const copilotWindow = copilotWindows.get(windowKey)

    if (isWindowDestroyed(copilotWindow)) {
      return false
    }

    copilotWindow.close()
    return true
  })
}
```

#### 3.2.2 窗口初始化 (helpers/index.js)

参考 `explorer/electron/helpers/index.js` 实现：

```javascript
// copilot/electron/helpers/index.js
```

### 3.3 Vite 配置集成

在 `vite.config.js` 中添加 copilot 入口：

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        control: resolve(__dirname, 'control/index.html'),
        explorer: resolve(__dirname, 'explorer/index.html'),
        copilot: resolve(__dirname, 'copilot/index.html'), // 新增
      },
    },
  },
})
```

### 3.4 主进程注册

在 `electron/main.js` 中注册 copilot 模块：

```javascript
import copilot from './copilot/electron/main.js'

app.whenReady().then(() => {
  const mainWindow = createWindow()
  copilot(mainWindow) // 注册 copilot 窗口管理
})
```

---

## 四、界面交互层集成

### 4.1 设备列表集成

在 `src/pages/device/index.vue` 的设备操作区添加 Copilot 按钮：

```vue
<template>
  <el-button 
    type="primary" 
    :icon="Robot"
    @click="handleOpenCopilot(device)"
  >
    Copilot
  </el-button>
</template>

<script setup>
import { Robot } from '@element-plus/icons-vue'

const handleOpenCopilot = async (device) => {
  await window.electron.ipcRenderer.invoke('open-copilot-window', {
    devices: [device],
    mode: 'single'
  })
}
</script>
```

### 4.2 批量操作集成

在 `src/pages/device/components/BatchActions/Copilot` 中：

参考 src/pages/device/components/BatchActions 下的其他模块进行实现

### 4.3 模式切换支持

Copilot 窗口需根据 `mode` 参数适配不同场景：

| 模式 | devices 长度 | 行为说明 |
|------|--------------|----------|
| `single` | 1 | 单设备交互，显示设备名称 |
| `batch` | ≥2 | 批量操作，显示设备列表 |

---

## 五、聊天界面实现

### 5.1 依赖引入

⚠️ **重要**: 仅在 `copilot/` 模块内引入 `@tdesign-vue-next/chat@alpha`，避免污染主应用：

```json
// package.json (仅开发依赖)
{
  "devDependencies": {
    "@tdesign-vue-next/chat": "alpha"
  }
}
```

### 5.2 聊天组件结构

```vue
<!-- copilot/components/ChatPanel/index.vue -->
<template>
  <t-chatbot
    v-model="messages"
    :config="chatConfig"
    @submit="handleSubmit"
  >
    <!-- 快捷指令插槽 -->
    <template #sender-footer-prefix>
      <div class="prompt-shortcuts">
        <t-tag
          v-for="prompt in prompts"
          :key="prompt"
          theme="primary"
          variant="outline"
          @click="handlePromptClick(prompt)"
        >
          {{ prompt }}
        </t-tag>
        <t-button size="small" @click="showPromptManager">
          管理提示词
        </t-button>
      </div>
    </template>
  </t-chatbot>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Chatbot as TChatbot } from '@tdesign-vue-next/chat'

const props = defineProps({
  devices: { type: Array, required: true },
  mode: { type: String, default: 'single' }
})

const messages = ref([])
const prompts = computed(() => window.appStore.get('copilot.prompts') || [])

const chatConfig = {
  placeholder: '输入指令，例如：打开微信并发送消息给张三',
  enableMultiline: true,
}

const handleSubmit = async (message) => {
  messages.value.push({
    role: 'user',
    content: message.text,
    timestamp: Date.now()
  })

  try {
    const result = await window.copilot.execute(message.text, {
      deviceId: props.devices[0]?.id,
      mode: props.mode
    })

    messages.value.push({
      role: 'assistant',
      content: result.output,
      timestamp: Date.now()
    })
  } catch (error) {
    messages.value.push({
      role: 'system',
      content: `执行失败: ${error.message}`,
      timestamp: Date.now()
    })
  }
}

const handlePromptClick = (prompt) => {
  handleSubmit({ text: prompt })
}
</script>
```

### 5.3 提示词管理

支持用户新增/编辑/删除常用提示词：

参考 8. 产品体验设计要求 中的设计规范，进行实现：

```vue
<!-- copilot/components/PromptManager/index.vue -->
```

---

## 8. 产品体验设计要求

从专业产品经理视角进行交互流程设计，从专业 UI/UX 设计师视角设计界面视觉：

1. UI 风格需与当前 Escrcpy 整体保持一致。
2. 尝试突破传统“对话式聊天”界面，探索更适合自然语言手机操作的创新交互形式。
3. 输出形式需具有可读性、任务可追踪性、操作状态清晰。

---

## 9. 聊天界面开发规范（TDesign）

使用 `@tdesign-vue-next/chat@alpha` 实现聊天界面：

* 基于 `<t-chatbot />`。
* 在组件的 `#sender-footer-prefix` 区域读取 `copilot.prompts` 作为常用提示语快捷按钮。
* 支持用户新增自定义 Prompt，并将新增内容自动持久化存入 `copilot.prompts`。
* 若 Prompt 内容较长，则需通过独立表单页面管理其标题与内容。

---

## 10. 计划任务支持

将 Copilot 能力纳入现有的计划任务系统，实现智能化调度与批量执行能力：

1. 支持用户通过自然语言配置计划任务，可从 `copilot.prompts` 预设项中选择，也可直接输入自定义指令。
2. 支持计划任务在单设备模式与批量设备模式下执行，确保在不同规模的设备管理场景下均具备可扩展性与一致性。

涉及文件：

* `src/components/TaskDialog/index.vue`
* `src/components/TaskListDialog/index.vue`
* `src/pages/device/components/BatchActions/Tasks/index.vue`


## 11. 新增 copilot 配置管理界面（baseUrl / apiKey / model）

为便于用户自主配置和切换不同的 Auto-GLM 服务环境，需要在前端实现一个独立的 copilot 配置界面。相关要求如下：

### 11.1 配置项范围

界面须支持以下字段的完整可视化管理，并持久化存储至 electron-store 的 `copilot` 配置中：

```json
{
  "copilot": {
    "prompts": [...],
    "baseUrl": "",
    "apiKey": "",
    "model": ""
  }
}
```

字段说明：

| 字段      | 说明            | 要求                                 |
| ------- | ------------- | ---------------------------------- |
| baseUrl | API 访问地址      | 支持用户自定义，并实时校验格式（HTTP/HTTPS）        |
| apiKey  | Auto-GLM 调用凭证 | 输入框需支持敏感字段隐藏显示切换                   |
| model   | 模型名称          | 提供可选列表（如 GLM-130B-Chat），并允许用户自定义输入 |

---

### 11.2 入口位置

需要提供以下入口以提升可发现性：

1. **在 copilot 主界面顶部右侧提供“配置”图标按钮**

前端交互路径应统一使用 `copilot/settings.vue` 或同名模块。

---

### 11.3 页面结构要求

配置界面需包含以下核心区域：

1. **基础连接配置区**

   * baseUrl（文本输入框）
   * apiKey（密码输入框 + 显示切换）
   * model（可输入可选择的下拉框）

2. **保存/重置/恢复默认操作**

   * 保存后写入 electron-store
   * 提供恢复默认配置按钮

3. **错误提示机制**

   * baseUrl 为空或非法格式时禁止保存
   * apiKey 为空时允许保存但在调用时需要提示

---

### 11.4 使用场景影响

1. copilot 前端聊天界面、批量任务界面调用 copilot 时必须从 electron-store 实时读取配置；
2. 保存配置后不需要刷新应用，应立即生效；
3. 若用户未配置或配置为空，应在第一次打开 copilot 时提示用户前往配置界面。

功能要求：

1. 用户可选择已有 `copilot.prompts` 提示词。
2. 用户也可输入新的提示词并自动保存。
3. 支持单设备和批量设备的计划任务。


注意事项: 

1. 仅在 ./copilot 中引入 @tdesign-vue-next/chat@alpha 依赖。

---

## 11. copilot CLI 信息参考

当前 copilot 可执行文件的帮助信息如下（供开发封装参考）：

```
usage: copilot [-h] [--base-url BASE_URL] [--model MODEL] [--apikey APIKEY] [--max-steps MAX_STEPS] [--device-id DEVICE_ID] [--connect ADDRESS] [--disconnect [ADDRESS]] [--list-devices] [--enable-tcpip [PORT]]
               [--quiet] [--list-apps] [--lang {cn,en}]
               [task]

Phone Agent - AI-powered phone automation

positional arguments:
  task                  Task to execute (interactive mode if not provided)

options:
  -h, --help            show this help message and exit
  --base-url BASE_URL   Model API base URL
  --model MODEL         Model name
  --apikey APIKEY       API key for model authentication
  --max-steps MAX_STEPS
                        Maximum steps per task
  --device-id, -d DEVICE_ID
                        ADB device ID
  --connect, -c ADDRESS
                        Connect to remote device (e.g., 192.168.1.100:5555)
  --disconnect [ADDRESS]
                        Disconnect from remote device (or 'all' to disconnect all)
  --list-devices        List connected devices and exit
  --enable-tcpip [PORT]
                        Enable TCP/IP debugging on USB device (default port: 5555)
  --quiet, -q           Suppress verbose output
  --list-apps           List supported apps and exit
  --lang {cn,en}        Language for system prompt (cn or en, default: cn)

Examples:
    # Run with default settings
    python main.py

    # Specify model endpoint
    python main.py --base-url http://localhost:8000/v1

    # Use API key for authentication
    python main.py --apikey sk-xxxxx

    # Run with specific device
    python main.py --device-id emulator-5554

    # Connect to remote device
    python main.py --connect 192.168.1.100:5555

    # List connected devices
    python main.py --list-devices

    # Enable TCP/IP on USB device and get connection info
    python main.py --enable-tcpip

    # List supported apps
    python main.py --list-apps
```

---

## 附录 A: CLI 参数完整说明

### A.1 基础参数

| 参数 | 简写 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `--base-url` | - | String | 是 | GLM API 端点地址 |
| `--apikey` | - | String | 是 | API 认证密钥 |
| `--model` | - | String | 否 | 模型名称 |
| `--max-steps` | - | Number | 否 | 单次任务最大执行步数 (默认 50) |
| `--quiet` | `-q` | Boolean | 否 | 静默模式，减少输出 |
| `--lang` | - | String | 否 | 系统提示语言 (cn/en) |

### A.2 设备管理参数

| 参数 | 简写 | 类型 | 说明 |
|------|------|------|------|
| `--device-id` | `-d` | String | 指定设备 ID |
| `--connect` | `-c` | String | 连接远程设备 (IP:端口) |
| `--disconnect` | - | String | 断开设备连接 ('all' 断开所有) |
| `--list-devices` | - | Boolean | 列出已连接设备 |
| `--enable-tcpip` | - | Number | 启用 TCP/IP 调试 (默认端口 5555) |

### A.3 功能查询参数

| 参数 | 说明 | 返回值 |
|------|------|--------|
| `--list-apps` | 列出支持的应用 | JSON 数组 |
| `--help` | 显示帮助信息 | 帮助文本 |

---

## 附录 B: 关键技术决策

### B.1 为什么使用 Map 存储窗口？

```javascript
const copilotWindows = new Map()
```

- **原因**: 支持单设备和批量设备同时打开多个 copilot 窗口
- **Key 设计**: 单设备模式用 `deviceId`，批量模式用 `'batch'`
- **优势**: 避免重复创建窗口，提升性能

### B.2 为什么必须注入 ADB 环境变量？

copilot 底层通过 Python 调用 ADB 命令，但 Node.js spawn 的子进程默认不继承完整 PATH。

**解决方案**:
```javascript
spawn(`"${spawnPath}"`, args, {
  env: { ...process.env, ADB: adbPath },  // 显式传递 ADB 路径
  shell: true,
})
```

**参考**: `electron/exposes/gnirehtet/index.js:36`

### B.3 为什么使用 ProcessManager？

- **自动清理**: 应用退出时自动杀死所有子进程
- **统一管理**: 避免僵尸进程和资源泄漏
- **错误恢复**: 支持批量重启和状态查询

### B.4 为什么仅在 copilot 模块引入 TDesign Chat？

- **减小主应用体积**: TDesign Chat 是 alpha 版本，体积较大
- **模块隔离**: 避免依赖冲突和版本管理问题
- **按需加载**: 仅当打开 copilot 窗口时才加载相关资源

---

## 附录 C: 常见问题排查

### C.1 copilot 可执行文件无法启动

**症状**: 进程启动失败或立即退出

**排查步骤**:
1. 检查文件权限: `chmod +x electron/resources/extra/{os}/copilot`
2. 检查路径引号: 确保使用 `"${spawnPath}"` 包裹路径
3. 检查 ADB 环境变量是否正确注入
4. 查看 stderr 输出的错误信息

### C.2 设备连接失败

**症状**: `--device-id` 指定的设备无法连接

**排查步骤**:
1. 运行 `adb devices` 确认设备已连接
2. 检查 ADB 环境变量路径是否正确
3. 尝试手动运行 `copilot --list-devices`
4. 检查设备是否启用 USB 调试

### C.3 API 调用失败

**症状**: 任务执行时报 API 认证错误

**排查步骤**:
1. 检查 `baseUrl` 格式是否正确
2. 验证 `apiKey` 是否有效
3. 检查网络连接和防火墙设置
4. 确认模型名称是否匹配

### C.4 窗口无法打开

**症状**: 点击 Copilot 按钮无反应

**排查步骤**:
1. 检查 `copilot/electron/main.js` 是否在 `electron/main.js` 中注册
2. 检查 Vite 配置是否包含 copilot 入口
3. 查看开发者工具 Console 是否有错误
4. 确认 IPC 通道名称是否匹配

---

## 附录 D: 最佳实践

### D.1 代码组织

```
✅ 推荐
copilot/
├── components/          # 组件按功能分类
│   ├── ChatPanel/
│   ├── ConfigDialog/
│   └── TaskStatus/
├── electron/           # 主进程逻辑独立
│   ├── main.js
│   ├── events/
│   └── helpers/
└── utils/              # 工具函数

❌ 避免
copilot/
├── chat.vue            # 所有功能堆在一个文件
└── config.vue
```

### D.2 错误处理

```javascript
// ✅ 推荐：提供友好的用户提示
try {
  const result = await window.copilot.execute(task)
} catch (error) {
  if (error.code === 'CONFIG_MISSING') {
    ElMessageBox.confirm('未配置 API Key，是否前往配置？', '提示', {
      confirmButtonText: '去配置',
      cancelButtonText: '取消'
    }).then(() => configDialog.show())
  } else {
    ElMessage.error(`执行失败: ${error.message}`)
  }
}

// ❌ 避免：直接抛出原始错误
const result = await window.copilot.execute(task) // 未捕获异常
```

### D.3 配置读取

```javascript
// ✅ 推荐：使用默认值和类型检查
const config = {
  maxSteps: 50,
  lang: 'cn',
  ...(window.appStore.get('copilot') || {})
}

// ❌ 避免：未处理 undefined 情况
const maxSteps = window.appStore.get('copilot.maxSteps') // 可能为 undefined
```

### D.4 进程管理

```javascript
// ✅ 推荐：统一使用 ProcessManager
const process = spawn(...)
processManager.add(process)

// ❌ 避免：手动管理进程
const process = spawn(...)
// 无清理机制，可能产生僵尸进程
```

---

## 附录 E: 参考资源

### E.1 项目内部文档

- `copilot/AutoGLM.md` - Auto-GLM 原始文档
- `.github/copilot-instructions.md` - Escrcpy AI 编码助手指南
- `electron/exposes/gnirehtet/index.js` - 进程管理参考实现
- `control/electron/main.js` - 多窗口架构参考
- `explorer/electron/main.js` - Map 存储窗口模式参考

### E.2 外部依赖文档

- [TDesign Chat 组件](https://tdesign.tencent.com/vue-next/components/chat)
- [Element Plus](https://element-plus.org/zh-CN/)
- [Electron IPC](https://www.electronjs.org/docs/latest/api/ipc-main)
- [Node.js child_process](https://nodejs.org/api/child_process.html)

### E.3 相关技术

- [ADB 官方文档](https://developer.android.com/tools/adb)
- [GLM API 文档](https://open.bigmodel.cn/dev/api)
- [Vue 3 Composition API](https://cn.vuejs.org/guide/introduction.html)

---

## 结语

本文档提供了 Copilot 在 Escrcpy 中的完整集成规范。请严格遵循本文档中的架构设计、命名规范、错误处理和最佳实践，确保代码质量和可维护性。

**关键原则**:
1. 遵循 Escrcpy 现有架构模式
2. 重用项目内成功的实现方案
3. 保持代码简洁和模块化
4. 提供友好的用户体验
5. 确保跨平台兼容性

如有疑问，请参考附录中的参考资源或查看项目内类似功能的实现。