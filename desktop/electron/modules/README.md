该目录用于存放应用程序各个子模块代码

## 模块约定（弱约束）

- 每个模块可导出具名插件 `{ name, deps, order, apply }`
- 窗口模块通过 `createWindowManager('module-id', { ... })` 注册
- 如需渲染侧开关窗口，请在对应模块下提供 `service.js` 注册 IPC

### 推荐结构

```
modules/
	window/            # 主窗口模块
	control/           # 子窗口模块
		index.js         # 窗口模块注册
		service.js       # IPC 入口（可选）
		events.js        # 窗口事件（可选）
```