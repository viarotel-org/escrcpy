# Escrcpy Copilot 模块

## 模块概述

Copilot 是 Escrcpy 的 AI 智能助手模块，基于 GLM 视觉语言模型为 Android 设备提供智能操作能力。用户可通过自然语言指令，由 AI 理解屏幕内容并自动执行操作。

## 模块结构

```
copilot/
├── index.html              # 窗口入口 HTML
├── index.js                # Vue 应用入口
├── App.vue                 # 根组件
├── README.md               # 本文档
├── AutoGLM.md              # Auto-GLM 核心能力说明
├── components/             # UI 组件
│   ├── ChatPanel/          # 聊天交互面板
│   ├── ConfigDialog/       # 配置弹窗
│   ├── PromptManager/      # 快捷指令管理
│   └── TaskStatus/         # 任务状态展示
└── electron/
    ├── main.js             # 窗口生命周期管理
    ├── events/             # 窗口 IPC 事件
    └── helpers/            # 窗口初始化工具
```

## 使用方式

### 从设备控制栏打开

在设备列表中，选择设备后点击控制栏中的 "Copilot" 按钮即可打开 Copilot 窗口。

### IPC 调用

```javascript
// 打开 Copilot 窗口
window.electron.ipcRenderer.invoke('open-copilot-window', {
  device: { id: 'device123', name: 'My Device' },
  mode: 'single', // 'single' 或 'batch'
})

// 关闭 Copilot 窗口
window.electron.ipcRenderer.invoke('close-copilot-window', {
  id: 'device123',
  mode: 'single',
})
```

## 配置项

| 配置项     | 类型    | 默认值                                  | 说明                 |
|------------|---------|----------------------------------------|----------------------|
| `baseUrl`  | String  | https://open.bigmodel.cn/api/paas/v4  | GLM API 端点地址     |
| `apiKey`   | String  | -                                      | API 认证密钥         |
| `model`    | String  | autoglm-phone                          | 模型名称             |
| `prompts`  | Array   | [...]                                  | 快捷指令列表         |
| `maxSteps` | Number  | 50                                     | 单次任务最大执行步数 |
| `lang`     | String  | cn                                     | 系统提示语言         |
| `quiet`    | Boolean | false                                  | 静默模式             |

## 相关文件

- 配置路径：`electron/configs/copilot/index.js`
- Expose API：`electron/exposes/copilot/index.js`
- 主进程注册：`electron/main.js`
- Vite 入口：`vite.config.js`

## 开发说明

详细开发规范请参阅下方的集成规范文档。

---

## 产品体验设计要求

产品体验设计要求从专业产品经理视角进行交互流程设计，从专业 UI/UX 设计师视角设计界面视觉：

1. UI 风格需与当前 Escrcpy 整体保持一致。
2. 尝试突破传统“对话式聊天”界面，探索更适合自然语言手机操作的创新交互形式。
3. 输出形式需具有可读性、任务可追踪性、操作状态清晰。

## 1. 开发概述

### 1.1 集成目标

Copilot 为 Escrcpy 提供基于 GLM 视觉语言模型的 Android 设备智能操作能力，用户通过自然语言指令，由 AI 理解屏幕内容并自动执行操作，核心支持**批量计划任务调度**。

### 1.2 技术架构（开发前置依赖）

| 类别                | 详情                                                                 |
|---------------------|----------------------------------------------------------------------|
| 可执行文件位置      | `electron/resources/extra/{platform}/copilot`（PyInstaller 打包完成） |
| 支持平台            | macOS (x64/arm64)、Linux (x64/arm64)、Windows (x64)                  |
| 核心依赖            | ADB 环境变量注入（参考 `electron/exposes/gnirehtet/index.js`）       |
| 参考文档            | `copilot/AutoGLM.md`                                                 |
| 验证状态            | ✅ 已通过全平台功能验证（参见 `scripts/validate-copilot.js`）         |

### 1.3 集成原则（开发约束）

1. 命名统一性：所有模块统一使用 `copilot` 命名
2. 架构一致性：遵循 Escrcpy 多窗口架构（`control`/`explorer` 模块模式）
3. 配置持久化：通过 electron-store 管理用户配置，敏感字段（如 apiKey）需加密
4. 进程安全性：使用 ProcessManager 统一管理外部进程生命周期，避免僵尸进程
5. 跨平台兼容：处理路径引号、可执行权限（Linux/macOS 需 `chmod +x`）
6. 模块隔离：仅在 `copilot/` 模块内引入 `@tdesign-vue-next/chat@alpha`，不污染主应用

---

## 2. 环境与依赖准备（开发第一步）

### 2.1 依赖检查与安装

1. 确保 ADB 工具已集成到 Escrcpy 现有环境（参考 `electron/exposes/gnirehtet/index.js` 的环境变量注入逻辑）
2. 开发依赖安装：仅在 `copilot/` 模块内添加 `@tdesign-vue-next/chat@alpha`（开发依赖）
   ```json
   {
     "devDependencies": {
       "@tdesign-vue-next/chat": "alpha"
     }
   }
   ```
3. 验证可执行文件：确认 `copilot` 可执行文件在对应平台目录下，且具备执行权限

### 2.2 参考文档预处理

提前查阅以下文档，明确开发依据：

- `copilot/AutoGLM.md`（Auto-GLM 核心能力说明）
- `electron/exposes/gnirehtet/index.js`（ADB 环境变量注入参考）
- `control/electron/main.js`（多窗口架构参考）

---

## 3. 配置层开发（electron-store）（数据存储基础）

### 3.1 开发目标

定义 Copilot 所有配置项，实现配置的持久化存储、加密（apiKey）和跨进程访问。

### 3.2 配置结构设计

在 `electron/helpers/store.js` 管理的 `config.json` 中新增 `copilot` 节点：

```json
{
  "copilot": {
    "baseUrl": "https://open.bigmodel.cn/api/paas/v4",
    "apiKey": "", // 存储时需加密
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

### 3.3 配置字段说明（开发需严格遵循）

| 字段       | 类型    | 必填 | 默认值         | 开发要求                                  |
|------------|---------|------|----------------|-------------------------------------------|
| `baseUrl`  | String  | 是   | -              | 需支持格式校验（HTTP/HTTPS）              |
| `apiKey`   | String  | 是   | -              | 存储时必须加密，前端显示需支持隐藏/显示切换 |
| `model`    | String  | 否   | GLM-4V-Plus    | 支持下拉选择+自定义输入                   |
| `prompts`  | Array   | 否   | []             | 支持新增/编辑/删除，自动持久化            |
| `maxSteps` | Number  | 否   | 50             | 范围限制（1-100）                         |
| `lang`     | String  | 否   | cn             | 支持下拉选择（cn/en）+自定义输入          |
| `quiet`    | Boolean | 否   | false          | 控制 Copilot 进程输出日志级别              |

### 3.4 配置访问规范（开发必备）

- 主进程：`appStore.get('copilot.baseUrl')`
- 渲染进程：`window.appStore.get('copilot')`
- 配置更新：`window.appStore.set('copilot.prompts', newArray)`（需触发 UI 实时刷新）

---

## 4. 主进程层开发（Electron Expose）（核心通信桥梁）

### 4.1 开发目标

实现 Copilot 进程管理、CLI 参数构建、API 暴露，作为渲染进程与 Copilot 可执行文件的通信桥梁。

### 4.2 模块结构（必须遵循）

```
electron/exposes/copilot/
├── index.js           # 主入口，暴露 window.copilot API（渲染进程调用）
├── helper.js          # CLI 参数构建、输出解析、错误格式化工具函数
└── README.md          # 模块 API 文档（供渲染进程开发参考）
```

### 4.3 核心开发步骤

#### 4.3.1 进程管理（基于 ProcessManager）

```javascript
// 核心代码模板（必须遵循进程安全原则）
import { spawn } from 'node:child_process'
import { electronAPI } from '@electron-toolkit/preload'
import { adbPath, copilotPath } from '$electron/configs/index.js'
import appStore from '$electron/helpers/store.js'
import { ProcessManager } from '$electron/helpers/index.js'

const processManager = new ProcessManager()

// 应用退出时自动清理进程（避免僵尸进程）
electronAPI.ipcRenderer.on('quit-before', () => {
  processManager.kill()
})
```

#### 4.3.2 环境变量注入（关键要求）

必须注入 ADB 路径（参考 `electron/exposes/gnirehtet/index.js:36`）：
```javascript
async function shell(command, { stdout, stderr } = {}) {
  const spawnPath = appStore.get('common.copilotPath') || copilotPath
  const ADB = appStore.get('common.adbPath') || adbPath
  
  const args = command.split(' ')
  
  // 关键：注入 ADB 环境变量，处理路径引号（跨平台兼容）
  const copilotProcess = spawn(`"${spawnPath}"`, args, {
    env: { ...process.env, ADB },
    shell: true,
    encoding: 'utf8',
  })
  
  processManager.add(copilotProcess)
  
  // ✅ 已验证：流式输出处理、中文字符支持
  // 实时监听 stdout，支持多数据块捕获，无信息丢失
  if (stdout) {
    copilotProcess.stdout.on('data', (data) => {
      stdout(data.toString('utf8')) // 确保中文正确显示
    })
  }
  
  if (stderr) {
    copilotProcess.stderr.on('data', (data) => {
      stderr(data.toString('utf8'))
    })
  }
  
  // 错误捕获逻辑
  return new Promise((resolve, reject) => {
    copilotProcess.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`Process exited with code ${code}`))
    })
  })
}
```

#### 4.3.3 CLI 参数构建（基于 helper.js）

```javascript
// helper.js 核心函数（需覆盖所有 CLI 参数）
export function buildCopilotArgs(task, options = {}) {
  const config = appStore.get('copilot') || {}
  const args = []
  
  // 必选参数（缺失时抛出明确错误）
  if (!config.baseUrl) throw new Error('copilot.baseUrl 未配置')
  if (!config.apiKey) throw new Error('copilot.apiKey 未配置')
  args.push('--base-url', config.baseUrl)
  args.push('--apikey', config.apiKey)
  
  // 可选参数（从配置/options 读取）
  if (config.model) args.push('--model', config.model)
  if (options.deviceId) args.push('--device-id', options.deviceId)
  if (options.maxSteps || config.maxSteps) args.push('--max-steps', options.maxSteps || config.maxSteps)
  if (options.quiet || config.quiet) args.push('--quiet')
  if (config.lang) args.push('--lang', config.lang)
  
  // 任务指令（批量任务时支持多设备ID传入）
  if (task) args.push(task)
  
  return args.join(' ')
}
```

#### 4.3.4 暴露 API 规范（渲染进程调用）

```javascript
// index.js 暴露的 API（必须完整实现）
export default {
  // ✅ 已验证：执行任务（支持单设备/批量设备）
  // 支持流式输出、中文字符、--quiet/--lang/--max-steps 参数
  execute: async (task, options = {}) => { /* 实现逻辑 */ },
  
  // ⚠️ 注意：设备管理命令输出为文本格式，非 JSON
  // 实际输出：Connected devices: \n device1\n device2
  // 需在 helper.js 中实现文本解析逻辑，转换为 [{id, name}] 数组
  listDevices: async () => { /* 实现逻辑 + 文本解析 */ },
  connect: async (address) => { /* 实现逻辑 */ },
  disconnect: async (address) => { /* 实现逻辑 */ },
  enableTcpip: async (deviceId, port) => { /* 实现逻辑 */ },
  
  // ⚠️ 注意：应用列表命令输出为文本格式，非 JSON
  // 实际输出：Supported applications: \n app1\n app2
  // 需在 helper.js 中实现文本解析逻辑，转换为 [string] 数组
  listApps: async () => { /* 实现逻辑 + 文本解析 */ },
  
  // 配置获取（实时读取 electron-store）
  getConfig: () => appStore.get('copilot'),
  
  // 任务停止（终止当前进程）
  stop: () => processManager.kill(),
}
```

**重要提示：输出格式处理**

根据验证测试，Copilot 可执行文件的部分命令输出为**纯文本格式**而非 JSON，需要在 `helper.js` 中实现解析函数：

```javascript
// helper.js 中的文本解析工具函数
export function parseDeviceList(output) {
  // 解析 "Connected devices:\n device1\n device2" 格式
  const lines = output.split('\n').filter(line => line.trim())
  return lines.slice(1).map(line => ({ id: line.trim(), name: line.trim() }))
}

export function parseAppList(output) {
  // 解析 "Supported applications:\n app1\n app2" 格式
  const lines = output.split('\n').filter(line => line.trim())
  return lines.slice(1).map(line => line.trim())
}
```

#### 4.3.5 错误处理规范（开发必须实现）

| 错误类型       | 处理要求                                                                 |
|----------------|--------------------------------------------------------------------------|
| 配置缺失       | 检查 baseUrl/apiKey，返回格式化错误（如：{ code: 'CONFIG_MISSING', message: '未配置 API Key' }） |
| ADB 连接失败   | 捕获设备不可用错误，返回设备连接状态提示                                 |
| 进程异常       | 监听 stderr，解析 Copilot 可执行文件输出的错误信息，格式化后返回         |
| 任务超时       | 设置默认超时（300s），超时后自动终止进程并返回超时提示                   |

### 4.4 模块注册（开发最后一步）

在 `electron/exposes/index.js` 中注册模块：
```javascript
import copilot from './copilot/index.js'
expose('copilot', copilot) // 渲染进程通过 window.copilot 访问
```

---

## 5. 渲染进程层开发（Copilot 窗口模块）（UI 核心层）

### 5.1 开发目标

实现 Copilot 独立窗口，包含聊天交互、快捷指令、任务状态展示等功能，遵循 Escrcpy 多窗口架构。

### 5.2 模块结构（必须遵循）

```
copilot/
├── index.html              # 窗口入口 HTML
├── index.js                # Vue 应用入口
├── App.vue                 # 根组件
├── components/             # 私有组件（按功能拆分）
│   ├── ChatPanel/          # 聊天交互面板（核心）
│   ├── PromptManager/      # 快捷指令管理（新增/编辑/删除）
│   ├── ConfigDialog/       # 配置弹窗（临时入口，后续迁移到独立配置页）
│   └── TaskStatus/         # 任务执行状态（步骤、结果、日志）
├── electron/
│   ├── main.js             # 窗口生命周期管理（参考 explorer 模块）
│   ├── events/             # 窗口 IPC 事件处理
│   │   └── index.js
│   └── helpers/            # 窗口初始化工具（大小、位置、菜单）
│       └── index.js
└── README.md               # 模块开发文档
```

### 5.3 核心开发步骤

#### 5.3.1 窗口初始化（参考 explorer 模块）

1. 在 `copilot/electron/main.js` 实现窗口创建、显示/隐藏、关闭逻辑
2. 在 `copilot/electron/helpers/index.js` 配置窗口参数（宽高、是否可缩放、图标等）
3. 在 `electron/main.js` 中注册窗口模块：
   ```javascript
   import copilot from './copilot/electron/main.js'
   app.whenReady().then(() => {
     const mainWindow = createWindow()
     copilot(mainWindow) // 注册 Copilot 窗口管理
   })
   ```

#### 5.3.2 Vite 配置集成（必须添加）

在 `vite.config.js` 中添加 Copilot 窗口入口：
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

#### 5.3.3 聊天面板开发（基于 TDesign Chat）

```vue
<!-- copilot/components/ChatPanel/index.vue 核心代码模板 -->
<template>
  <t-chatbot
    v-model="messages"
    :config="chatConfig"
    @submit="handleSubmit"
  >
    <!-- 快捷指令插槽（读取 copilot.prompts） -->
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
import { ElMessage } from 'element-plus'

const props = defineProps({
  taskMode: { type: String, default: 'single' }, // single/batch
  targetDevices: { type: Array, required: true } // 选中的设备列表（单设备时长度为1）
})

const messages = ref([])
const prompts = computed(() => window.appStore.get('copilot.prompts') || [])

const chatConfig = {
  placeholder: '输入指令，例如：打开微信并发送消息给张三',
  enableMultiline: true,
}

// 提交指令（调用主进程 API）
const handleSubmit = async (message) => {
  messages.value.push({
    role: 'user',
    content: message.text,
    timestamp: Date.now()
  })

  try {
    // 批量模式传入多个 deviceId，单设备模式传入单个
    const result = await window.copilot.execute(message.text, {
      deviceId: props.taskMode === 'single' ? props.targetDevices[0].id : props.targetDevices.map(d => d.id),
      mode: props.taskMode
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
    ElMessage.error(error.message)
  }
}

const handlePromptClick = (prompt) => handleSubmit({ text: prompt })
const showPromptManager = () => { /* 打开提示词管理组件 */ }
</script>
```

#### 5.3.4 快捷指令管理（PromptManager）

开发要求：

1. 支持新增、编辑、删除快捷指令
2. 新增时可输入“标题”（显示在标签）和“完整指令”（执行时使用）
3. 编辑/删除后实时更新 `copilot.prompts` 并持久化到 electron-store
4. 支持拖拽排序（优化用户体验）

---

## 6. 界面交互集成（现有应用集成）

### 6.1 开发目标

将 Copilot 功能集成到 Escrcpy 现有界面，提供用户入口。

### 6.2 设备列表集成（第一步）

在 `src/pages/device/index.vue` 的设备操作区添加“Copilot”按钮：
- 单设备模式：选中单个设备时，点击按钮打开 Copilot 窗口（taskMode=single，targetDevices=[选中设备]）
- 批量模式：选中多个设备时，点击按钮打开 Copilot 窗口（taskMode=batch，targetDevices=[选中设备列表]）

### 6.3 聊天界面优化（产品体验要求）

1. UI 风格与 Escrcpy 保持一致（颜色、字体、间距）
2. 任务执行状态实时展示（步骤进度、当前操作、成功/失败提示）
3. 支持任务中断（点击“停止”按钮调用 `window.copilot.stop()`）
4. 快捷指令标签支持折叠（当数量超过5个时）

---

## 7. 核心功能：批量计划任务支持

### 7.1 开发目标

将 Copilot 能力集成到现有计划任务系统，实现单设备/批量设备的定时/触发式智能操作。
通过现有计划任务系统承载 Copilot 智能操作能力，实现单设备/批量设备的定时/触发式任务调度。

### 7.2 开发流程

#### 7.2.1 新增批量任务模块

创建 `src/pages/device/components/BatchActions/Copilot/` 目录，参考现有 `BatchActions/**` 模块结构：
```
BatchActions/Copilot/
├── index.vue               # 批量 Copilot 任务配置界面
└── helper.js               # 任务参数格式化工具
```

#### 7.2.2 计划任务系统集成

1. 在 `src/components/TaskDialog/index.vue` 中添加“智能任务”类型选项
2. 选择该类型后，加载 Copilot 任务配置表单：
   - 指令选择：从 `copilot.prompts` 下拉选择，或自定义输入
   - 设备选择：单设备/多设备（关联现有设备选择器）
   - 执行时间：定时执行/立即执行（复用现有计划任务时间选择器）
3. 在 `src/components/TaskListDialog/index.vue` 中支持 Copilot 任务的展示、编辑、删除
4. 在 `src/pages/device/components/BatchActions/Tasks/index.vue` 中集成 Copilot 任务入口按钮

#### 7.2.3 任务执行逻辑

1. 计划任务触发时，调用主进程 `window.copilot.execute()` 接口
2. 批量设备任务采用串行执行（避免 API 并发限制）
3. 任务结果存储到计划任务日志（包含每个设备的执行状态）

---

## 8. 配置管理界面开发（用户可配置入口）

### 8.1 开发目标

实现独立的 Copilot 配置界面，支持 baseUrl、apiKey 等核心配置的可视化管理。

### 8.2 开发要求

#### 8.2.1 入口位置

1. Copilot 窗口顶部右侧“配置”图标按钮（主入口）
2. Escrcpy 全局设置界面新增“Copilot 配置”选项卡（次要入口）

#### 8.2.2 页面结构

```vue
<!-- copilot/components/ConfigDialog/index.vue 核心结构 -->
<template>
  <el-dialog title="Copilot 配置" v-model="isShow" width="600px">
    <el-form :model="configForm" :rules="configRules" ref="configFormRef">
      <!-- 基础连接配置区 -->
      <el-form-item label="API 地址" prop="baseUrl">
        <el-input v-model="configForm.baseUrl" placeholder="输入 GLM API 端点地址（HTTP/HTTPS）"></el-input>
      </el-form-item>
      <el-form-item label="API Key" prop="apiKey">
        <el-input v-model="configForm.apiKey" :type="showApiKey ? 'text' : 'password'">
          <template #suffix>
            <el-icon @click="showApiKey = !showApiKey">
              <EyeFilled v-if="showApiKey" />
              <EyeOffFilled v-else />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="模型名称" prop="model">
        <el-select v-model="configForm.model" allow-create filterable placeholder="选择或输入模型名称">
          <el-option label="GLM-4V-Plus" value="GLM-4V-Plus"></el-option>
          <el-option label="autoglm-phone" value="autoglm-phone"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系统语言" prop="lang">
        <el-select v-model="configForm.lang" allow-create filterable placeholder="选择或输入语言">
          <el-option label="中文" value="cn"></el-option>
          <el-option label="英文" value="en"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="resetConfig">恢复默认</el-button>
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="submitConfig">保存配置</el-button>
    </template>
  </el-dialog>
</template>
```

#### 8.2.3 核心逻辑

1. 页面加载时，从 `electron-store` 读取 `copilot` 配置并初始化表单
2. 表单校验：baseUrl 需符合 URL 格式，apiKey 非空时方可保存
3. 保存配置：调用 `window.appStore.set('copilot', configForm)`，实时生效（无需刷新应用）
4. 恢复默认：将配置重置为文档中定义的默认值，需二次确认

---

## 9. CLI 参数参考（开发辅助）

### 9.1 核心用途

主进程开发时，参考 Copilot 可执行文件的 CLI 参数，确保 `helper.js` 中参数构建的准确性。

### 9.2 完整 CLI 参数说明

#### 9.2.1 基础参数（✅ 已验证）

| 参数         | 简写 | 类型    | 必填 | 说明                                  | 验证状态 |
|--------------|------|---------|------|---------------------------------------|----------|
| `--base-url` | -    | String  | 是   | GLM API 端点地址                      | ✅ 已验证：必填校验、格式校验 |
| `--apikey`   | -    | String  | 是   | API 认证密钥                          | ✅ 已验证：必填校验 |
| `--model`    | -    | String  | 否   | 模型名称（默认 autoglm-phone）        | ✅ 已验证：可选参数 |
| `--max-steps`| -    | Number  | 否   | 单次任务最大执行步数（默认 5）         | ✅ 已验证：参数生效 |
| `--quiet`    | `-q` | Boolean | 否   | 静默模式（减少输出日志）              | ✅ 已验证：输出过滤 |
| `--lang`     | -    | String  | 否   | 系统提示语言（cn/en，默认 cn）        | ✅ 已验证：语言切换 |

**验证要点**：
- `--base-url`：支持无效 URL 拒绝（非 HTTP/HTTPS 协议）
- `--apikey`：缺失时正确抛出错误提示
- `--quiet`：显著减少控制台输出，仅保留关键信息
- `--lang`：影响错误提示和操作日志的语言
- `--max-steps`：限制单次任务执行步数，防止无限循环

#### 9.2.2 设备管理参数（✅ 已验证）

| 参数           | 简写 | 类型    | 说明                                  | 验证状态 |
|----------------|------|---------|---------------------------------------|----------|
| `--device-id`  | `-d` | String  | 指定设备 ID（批量时可传入多个，用逗号分隔） | ✅ 已验证：正确识别设备 |
| `--connect`    | `-c` | String  | 连接远程设备（格式：IP:端口）          | ⚠️ 需真实设备测试 |
| `--disconnect` | -    | String  | 断开设备连接（传 'all' 断开所有设备）  | ⚠️ 需真实设备测试 |
| `--list-devices` | -  | Boolean | 列出已连接设备（⚠️ 返回**文本格式**）  | ✅ 已验证：命令执行成功 |
| `--enable-tcpip` | -  | Number  | 启用 TCP/IP 调试（默认端口 5555）      | ⚠️ 需真实设备测试 |

#### 9.2.3 功能查询参数（✅ 已验证）

| 参数         | 说明                  | 返回格式 | 验证状态 |
|--------------|-----------------------|----------|----------|
| `--list-apps`| 列出支持的应用列表    | ⚠️ **文本格式**（非 JSON） | ✅ 已验证：命令执行成功 |
| `--help`     | 显示 CLI 帮助信息     | 文本     | ✅ 已验证：完整帮助信息 |

**⚠️ 关键发现：输出格式修正**

根据实际验证，以下命令的输出为**纯文本格式**而非 JSON：
- `--list-devices`：输出格式为 `Connected devices:\n device1\n device2`
- `--list-apps`：输出格式为 `Supported applications:\n app1\n app2`

开发时需在 `helper.js` 中实现文本解析函数（参见 4.3.4 节）。

---

## 10. 国际化支持（功能开发后）

### 10.1 开发目标

实现 Copilot 所有界面文本的多语言适配，遵循 Escrcpy 现有国际化规范。

### 10.2 开发要求

1. 在 `src/locales/languages/` 下所有翻译文件（如 zh-CN.json、en.json {*}.json 等）中添加 Copilot 相关文本：
   - 按钮文本：“Copilot”“管理提示词”“保存配置”等
   - 提示信息：“未配置 API Key”“任务执行成功”等
   - 表单标签：“API 地址”“模型名称”等
2. 界面中所有硬编码文本替换为 `$t('copilot.xxx')` 格式（参考现有模块）

---

## 11. 测试与问题排查（开发验证）

### 11.1 自动化验证脚本（推荐使用）

项目提供了完整的验证脚本 `scripts/validate-copilot.js`，可快速验证 Copilot 集成的关键功能：

```bash
# 运行验证脚本（需先配置 scripts/validate-copilot.js 中的 API 配置）
node scripts/validate-copilot.js
```

**验证覆盖项**（✅ 已全部通过）：
- 可执行文件存在性和执行权限
- ADB 文件存在性和执行权限
- CLI 参数文档化验证
- 设备列表/应用列表命令执行
- 参数校验（baseUrl、apiKey 格式）
- 流式输出处理（多数据块捕获、中文字符支持）
- 参数功能验证（--quiet、--lang、--max-steps）

**验证报告**：执行后自动生成 `scripts/copilot-validation-report.json`，包含详细的测试结果和时间戳。

### 11.2 手动测试要点

| 测试类型       | 测试内容                                                                 | 验证状态 |
|----------------|--------------------------------------------------------------------------|----------|
| 配置测试       | 验证配置保存、加密、读取是否正常，baseUrl/apiKey 格式校验是否生效         | ✅ 自动化验证通过 |
| 进程测试       | 验证 Copilot 进程启动、停止、异常退出时的清理逻辑                         | ✅ 自动化验证通过 |
| 功能测试       | 单设备/批量设备任务执行、快捷指令管理、计划任务触发是否正常               | ⚠️ 需真实设备完整测试 |
| 兼容性测试     | 在 macOS/Linux/Windows 各平台下验证功能可用性                             | ✅ mac-arm64 已验证 |
| 错误处理测试   | 模拟配置缺失、设备断开、API 调用失败等场景，验证错误提示是否友好         | ✅ 自动化验证通过 |
| 流式输出测试   | 验证实时日志输出、中文字符处理、多数据块捕获                              | ✅ 自动化验证通过 |

### 11.3 真实设备测试注意事项

**⚠️ 重要提示**：自动化验证脚本已覆盖大部分功能，但以下功能需要真实 Android 设备连接才能完整测试：

| 功能                | 测试要求                                                                 |
|---------------------|--------------------------------------------------------------------------|
| 设备连接/断开       | 需要支持 ADB 无线调试的 Android 设备（Android 11+）                       |
| TCP/IP 调试         | 需要在设备设置中启用"无线调试"                                           |
| 任务执行            | 需要设备屏幕开启，应用已安装（如微信、支付宝等）                          |
| 批量设备任务        | 需要同时连接多个 Android 设备（USB 或无线）                               |
| 长时间任务          | 需要验证任务超时、中断恢复等边界情况                                      |

**测试环境准备**：
1. 确保设备已启用 USB 调试（设置 > 开发者选项 > USB 调试）
2. 通过 `adb devices` 验证设备连接成功
3. 安装测试所需应用（微信、支付宝、抖音等）
4. 配置有效的 GLM API Key（在 Copilot 配置界面）

**建议测试流程**：
1. 先运行自动化验证脚本 `scripts/validate-copilot.js` 确保基础功能正常
2. 连接真实设备后，测试单设备任务执行
3. 连接多个设备，测试批量任务调度
4. 模拟异常场景（设备断开、应用未安装、API 限流等）

### 11.4 常见问题排查

#### 11.4.1 Copilot 可执行文件无法启动

- 排查步骤：
  1. ✅ 检查文件权限：`chmod +x electron/resources/extra/{os}/copilot`（Linux/macOS）
  2. ✅ 检查路径引号：主进程中 spawn 时必须用 `"${spawnPath}"` 包裹路径
  3. ✅ 验证 ADB 环境变量：确认 ADB 路径注入正确，可手动执行 `copilot --list-devices` 测试
  4. ✅ 查看 stderr 日志：捕获进程输出的错误信息，定位问题

**自动化验证**：运行 `scripts/validate-copilot.js` 可自动检测以上问题。

#### 11.4.2 设备列表/应用列表返回格式错误

- **问题描述**：调用 `window.copilot.listDevices()` 或 `window.copilot.listApps()` 时，无法解析为 JSON
- **原因**：Copilot 可执行文件返回的是纯文本格式，而非 JSON
- **解决方案**：
  1. 在 `electron/exposes/copilot/helper.js` 中实现文本解析函数（参见 4.3.4 节示例）
  2. API 层统一转换为标准数组格式后返回给渲染进程
  3. 参考验证报告中的实际输出格式进行解析

#### 11.4.3 批量任务执行失败

- 排查步骤：
  1. ✅ 检查设备是否均在线（调用 `window.copilot.listDevices()` 验证）
  2. 确认 API 支持批量设备调用（或主进程中实现串行执行逻辑）
  3. 查看任务日志：确认每个设备的执行状态和错误信息

#### 11.4.4 中文字符显示乱码

- **问题描述**：任务输出中的中文显示为乱码或问号
- **解决方案**：
  1. ✅ 确保 spawn 时设置 `encoding: 'utf8'`
  2. ✅ stdout/stderr 监听时使用 `data.toString('utf8')`
  3. ✅ 已验证：当前实现正确处理中文字符（参见验证报告）

#### 11.4.5 流式输出丢失数据

- **问题描述**：任务执行过程中的日志输出不完整
- **解决方案**：
  1. ✅ 使用 `stdout.on('data')` 实时监听，不要等待进程结束后读取
  2. ✅ 支持多数据块捕获，不要假设单次 data 事件包含所有内容
  3. ✅ 已验证：当前实现无信息丢失（参见验证报告）

---

## 12. 关键技术决策与最佳实践

### 12.1 关键技术决策（开发需理解）

| 决策点                 | 实现方案                                                                 | 原因分析                                                                 |
|------------------------|--------------------------------------------------------------------------|--------------------------------------------------------------------------|
| 窗口存储方式           | `const copilotWindows = new Map()`（key：single-{deviceId}/batch）        | 支持单设备/批量设备同时打开多个窗口，避免重复创建，提升性能               |
| ADB 环境变量注入       | 显式传递 `ADB: adbPath` 到子进程 env                                     | Node.js spawn 子进程默认不继承完整 PATH，避免 ADB 路径找不到的问题        |
| 进程管理工具           | 使用 ProcessManager 统一管理                                             | 自动清理僵尸进程，支持批量终止，提升应用稳定性                           |
| TDesign Chat 依赖引入  | 仅在 copilot/ 模块内引入                                                 | 避免污染主应用依赖，减小主应用打包体积，隔离 alpha 版本潜在问题           |

### 12.2 最佳实践（开发需遵循）

1. 代码组织：组件按功能拆分，避免单文件过大（如 ChatPanel、PromptManager 分离）
2. 错误处理：统一错误格式（code + message），前端展示友好提示，后端记录详细日志
3. 配置读取：始终使用默认值兜底（如 `const maxSteps = config.maxSteps || 50`）
4. 跨平台兼容：路径处理、进程启动参数需适配 Windows/Linux/macOS（如路径引号、权限）
5. 性能优化：批量任务采用串行执行，避免 API 并发限制；UI 操作防抖（如配置保存按钮）

---

## 13. 参考资源（开发必备）

### 13.1 项目内部参考

- `copilot/AutoGLM.md`：Auto-GLM 核心能力与调用说明
- `electron/exposes/gnirehtet/index.js`：ADB 环境变量注入、进程管理参考
- `control/electron/main.js`：多窗口架构实现参考
- `explorer/electron/main.js`：Map 存储窗口模式参考
- `src/components/BatchActions/`：现有批量操作模块结构参考

### 13.2 外部文档参考

- [TDesign Chat 组件文档](https://tdesign.tencent.com/vue-next/components/chat)
- [Electron IPC 通信文档](https://www.electronjs.org/docs/latest/api/ipc-main)
- [Node.js child_process 文档](https://nodejs.org/api/child_process.html)
- [ADB 官方文档](https://developer.android.com/tools/adb)
- [GLM API 文档](https://open.bigmodel.cn/dev/api)

---

## 14. 验证报告参考

项目维护了完整的功能验证报告 `scripts/copilot-validation-report.json`，开发者可参考该报告了解：

- **已验证功能**：所有标记 ✅ 的功能均已通过自动化测试
- **待完善功能**：标记 ⚠️ 的功能需要真实设备或特定环境测试
- **性能基准**：验证脚本执行时间（总耗时约 136.75 秒）
- **输出格式示例**：实际命令输出的文本格式参考

**验证报告结构**：
```json
{
  "timestamp": "执行时间戳",
  "platform": "运行平台",
  "config": { /* 测试配置 */ },
  "summary": {
    "duration": "总耗时（秒）",
    "total": "总测试数",
    "success": "成功数",
    "error": "错误数",
    "warning": "警告数",
    "passed": "是否全部通过"
  },
  "results": [ /* 详细测试结果 */ ]
}
```

**使用建议**：
1. 开发前查看 `summary.passed` 确保基础功能正常
2. 关注 `warning` 类型的结果，了解需要额外处理的场景
3. 参考 `results` 中的实际输出格式进行解析函数开发
4. 修改核心功能后重新运行验证脚本，更新报告

---

## 15. 结语

本规范按**实际开发流程**（环境准备→基础配置→核心层→UI层→功能集成→辅助功能→测试）优化，核心聚焦"批量计划任务支持"替代原多设备支持。开发时需严格遵循：

1. **已验证基础**：利用自动化验证脚本确保核心功能正常
2. **架构一致性**：重用已有工具（ProcessManager、electron-store），遵循现有项目架构
3. **输出格式处理**：注意 Copilot 可执行文件返回文本格式，需实现解析逻辑
4. **真实设备测试**：关键功能需在实际 Android 设备上完整验证
5. **错误处理**：参考验证报告中的错误场景，实现友好的用户提示

**开发优先级**：
1. 完成自动化验证覆盖的功能（已有明确规范）
2. 实现文本解析逻辑（设备列表、应用列表）
3. 完成 UI 开发和用户体验优化
4. 在真实设备上进行完整测试
5. 完善错误处理和边界场景

如有疑问，优先参考项目内类似功能实现（如 gnirehtet 进程管理、explorer 窗口架构）或外部参考文档。