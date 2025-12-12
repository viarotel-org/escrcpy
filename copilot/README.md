# 在当前项目（Escrcpy）中集成 Auto-GLM（copilot）能力

本需求旨在将 Auto-GLM 的自然语言设备操作能力无缝集成到 Escrcpy 中，以增强用户体验。Auto-GLM（以下简称 copilot）已通过 PyInstaller 打包为可执行文件，并存放于 `electron/resources/extra/{os}/copilot`，可直接调用。相关文档可参考 `copilot/AutoGLM.md`。

以下是需要在项目中完成的全部集成规范与开发任务：

---

## 1. 全局配置（electron-store）

在 `config.json` 新增 `copilot` 键，用于存储 Auto-GLM 调用参数和常用提示词：

```json
"copilot": {
  "prompts": ["帮我打开微信", "帮我打开支付宝并扫码支付100元"],
  "baseUrl": "https://open.bigmodel.cn/api/paas/v4",
  "apiKey": "88c2c920978e4570a1214a8e152252c6.LaI1etG0bQHbYkn3",
  "model": "GLM-130B-Chat"
}
```

重要: 为便于用户自主配置和切换不同的 Auto-GLM 服务环境，需要在前端实现一个独立的 copilot 配置界面。相关要求如下：

---

## 2. 工具命令名称规范

项目统一使用 **copilot** 作为:

* 可执行文件调用名称
* 后端逻辑模块名称
* 前端调用命名空间（window.copilot）

---

## 3. Electron 主进程：copilot 后端逻辑层

在 `electron/exposes/copilot/**` 中：

1. 实现对 copilot 可执行文件的所有功能封装（任务执行、设备指定、参数传递等）。
2. 通过 `contextBridge.exposeInMainWorld` 暴露 `window.copilot`。
3. 需包含对全部 CLI 参数的封装，例如：

   * `--device-id`
   * `--connect`
   * `--disconnect`
   * `--list-devices`
   * `--enable-tcpip`
   * 默认交互式任务执行等。

确保支持单设备、批量设备、定时任务等调用场景。

请在将 Copilot 集成至当前项目时重点关注以下事项：在通过 node:child_process 调用 Copilot 可执行文件的过程中，必须正确处理跨平台路径解析与可执行权限设置。同时，请参考 electron/exposes/gnirehtet/index.js 的实现方式，将 ADB 相关环境变量按需注入到子进程运行环境中，以确保 Copilot 在各操作系统下均能正常访问并调用 ADB。

---

## 4. 前端：copilot 交互界面

在项目根目录创建 `copilot/**` 目录，并参考 `copilot` 与 `explorer` 模块结构实现前端界面逻辑。

核心要求：

1. 提供自然语言指令输入与 AI 结果展示。
2. 支持单设备、批量设备两种使用模式。
3. 模块化组件设计以保证复用。

---

## 5. 设备列表集成

在 `src/pages/device/index.vue`：

* 在每条设备操作中添加 **copilot 按钮**，点击后打开 copilot 界面并绑定当前设备。

---

## 6. 批量设备操作集成

在 `src/pages/device/components/BatchActions` 中：

* 添加批量 copilot 执行功能。
* 适配批量设备 ID 收集与任务派发逻辑。

---

## 7. copilot 界面复用与架构要求

* 界面需支持：

  * 单设备交互
  * 多设备批量交互
* 并保证 UI 和逻辑可复用。

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
...
