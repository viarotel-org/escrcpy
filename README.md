<div style="display:flex;">
  <img src="./src/assets/logo.png" alt="viarotel-escrcpy" style="width: 128px;">
</div>

# Escrcpy

📱 使用图形界面的 Scrcpy 显示和控制您的 Android 设备，由 Electron 驱动。 [查看更多截图](https://github.com/viarotel-org/escrcpy/tree/main/public/screenshot)

<div style="display:flex;">
  <img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c2b84b35f8e49d3b809e89272c59e16~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1359&h=693&s=144785&e=jpg&b=fefefe" alt="viarotel-escrcpy" style="width: 100%;">
</div>

## 特点

- 🏃 同步：得益于 Web 技术，将更快速的与 Scrcpy 保持同步
- 💡 定制化：支持对多个设备偏好进行独立配置，并且能够添加备注以及导入导出所有配置的功能
- 😎 轻巧度：本机支持，仅显示设备屏幕
- ⚡️ 性能：30~120 帧每秒，取决于设备
- 🌟 质量：1920×1080 或更高
- 🕒 低延迟：35~70 毫秒
- 🚀 快速启动：显示第一张图片仅需约 1 秒钟
- 🙅‍♂️ 非侵入性：不会在安卓设备上留下任何安装文件
- 🤩 用户收益：无需账户、无广告、无需互联网连接
- 🗽 自由：免费且开源软件

## 获取软件包

[查看发布地址](https://github.com/viarotel-org/escrcpy/releases)

## 快速上手

### USB 连接

> 注意：如果手机上提示调试授权请点击允许

1. 安卓手机需开启开发者模式并打开 USB 调试
2. 打开 Escrcpy 并将安卓手机连接到你的电脑
3. 这时 Escrcpy 设备列表应该已经检测到你的手机，点击开始镜像
4. 开始享受吧

### WIFI 连接

> 注意：如果首次无线连接失败，你可能需要无线配对请参阅 [常见问题](#常见问题)
>
> 注意：需同时开启无线调试功能，并在无线调试页面中获取你的当前设备的无线地址（通常为你连接 WIFI 时分配的 IP 地址）及端口号（默认为 5555）

1. 同 USB 连接中的 1-2 步骤
2. 将获取到的设备 IP 地址及端口号填写到 Escrcpy 中，然后点击连接设备
3. 这时 Escrcpy 设备列表应该已经检测到你的手机，点击开始镜像
4. 开始享受吧

### macOS && Linux

> 注意：这些平台没有集成 [Adb](https://developer.android.com/studio/releases/platform-tools?hl=zh-cn) 及 [Scrcpy](https://github.com/Genymobile/scrcpy) 需要手动安装

1. Linux 可参阅的 [安装文档](https://github.com/Genymobile/scrcpy/blob/master/doc/linux.md)
2. macOS 可参阅的 [安装文档](https://github.com/Genymobile/scrcpy/blob/master/doc/macos.md)
3. 安装上述依赖成功后步骤同 USB 连接 和 WIFI 连接

## 快捷键

请参阅 [scrcpy/doc/shortcuts](https://github.com/Genymobile/scrcpy/blob/master/doc/shortcuts.md)

## 设备交互栏

- 切换键
- 主屏幕键
- 返回键
- 通知栏
- 电源键
- 重启设备
- 截取屏幕
- 安装应用

## 偏好设置

> 持续完善中 目前支持以下常用配置

### 自定义

- Adb 路径
- Scrcpy 路径
- 文件存储路径（音视频录制及设备截图都保存在这里）

### 视频控制

- 分辨率
- 比特率
- 刷新率
- 视频解码器
- 视频编码器
- 屏幕旋转
- 屏幕裁剪
- 多显示器
- 视频缓冲
- 音频缓冲
- 接收器(v4l2)缓冲
- 禁用视频

### 设备控制

- 展示触摸点
- 保持清醒
- 控制时关闭屏幕
- 控制结束关闭屏幕
- 控制时停止充电

### 窗口控制

- 无边框模式
- 全屏幕模式

### 音视频录制

- 录制视频格式

### 音频控制

- 禁用音频

## 下一步做什么？

> 优先级从高到低

1. 用户界面进行优化，制作合适的 Logo ✅
2. 内置的软件更新功能 ✅
3. 录制和保存音视频 ✅
4. 添加设备快捷交互控制栏 ✅
5. 支持自定义 Adb 及 Scrcpy 依赖 ✅
6. 支持自定义设备名称，以及偏好设置的导出及导入 ✅
7. 定制化，支持对单个设备进行独立配置 ✅
8. 添加 macOS 及 linux 操作系统的支持 ✅
9. 支持语言国际化功能 🚧
10. 添加对游戏的增强功能，如游戏键位映射 🚧

## 常见问题

### 电脑连接设备后无法检测到

1. 请重新插拔你的设备，并确认设备同意了 USB 调试授权窗口。
2. 如果还不行，你的电脑可能缺少必要的驱动程序，请使用第三方工具 如：驱动精灵，安装必要的驱动后重试。

### 无法输入中文

该问题是已知的， Scrcpy 似乎并未直接对中文输入进行测试和支持 需要在手机端安装第三方输入法 以下输入法经测试可以很好支持

- 搜狗输入法
- QQ 输入法
- 谷歌拼音输入法
- Gboard

### 没有控制栏，无法通过点击返回上一步及桌面问题

> 后期会增加支持 目前可以使用以下方法

1. 在高级设置中开启 设备控制 => 虚拟控制栏 （如果该配置不起作用则需要在设备上手动开启）
2. 通过快捷键，请参阅 [scrcpy/doc/shortcuts](https://github.com/Genymobile/scrcpy/blob/master/doc/shortcuts.md)

### 无线连接提示： 目标计算机积极拒绝访问

第一次无线连接可能需要配对 或 插入 USB 以保证与电脑建立连接即授权成功后方可使用

### 通过数据线连接后点击无线模式没有反应

请再点一次，或点击刷新设备，一般不会超过两次，如果还不行，请提供机型和安卓版本信息到 [Issues](https://github.com/viarotel-org/escrcpy/issues)

### 设备交互控制栏为什么不设计为自动跟踪吸附的悬浮菜单?

采用悬浮菜单方案不可避免地会增加对 Scrcpy 的耦合性，并增加与 Scrcpy 同步更新的难度。许多类似的 ScrcpyGUI 软件在使用此方案后不得不投入大量精力，最终因难以维护而放弃开发。因此，综合考虑，我们决定采用现有的方案，并期待 Scrcpy 未来能够增加原生交互控制栏的支持。

### 某些设备连接镜像后可以看到画面但是无法操作

> 注意：以小米手机为例，不仅需要开启 USB 调试还需要开启 USB 调试（安全设置）也就是允许通过 USB 调试修改权限或模拟点击的功能

可供参阅的详情说明 [鼠标和键盘不工作的原因](https://github.com/Genymobile/scrcpy/blob/master/FAQ.md#mouse-and-keyboard-do-not-work)

## 获得帮助

> 因为是开源项目 全靠爱发电 所以支持有限 更新节奏不固定
>
> 注意：非 BUG 或计划外的需求，有偿处理；至于金额，根据问题难易程度，你觉得帮助了多少，看着给吧（维护这些项目已经耗费了大量精力，还要免费花时间解答问题就说不过去了吧...所以白嫖的一律不通过。）

- issues: [反馈问题](https://github.com/viarotel-org/escrcpy/issues)
- email: viarotel@qq.com
- weixin: viarotel
- qq: 523469508

## 致谢

该项目的诞生离不开以下开源项目

- [scrcpy](https://github.com/Genymobile/scrcpy)
- [adbkit](https://github.com/DeviceFarmer/adbkit)
- [electron](https://www.electronjs.org/)

## 支持项目

> 如果该项目帮到你的话，可以请我喝杯咖啡，让我更有精神完善该项目 😛

<div style="display:flex;">
  <img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79dcbc40246743e2b6870419e88e0392~tplv-k3u1fbpfcp-watermark.image?" alt="viarotel-wepay" style="width: 36%;">
  <img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e5e69b83dd746deade95afd4a6864ec~tplv-k3u1fbpfcp-watermark.image?" alt="viarotel-alipay" style="width: 36%;">
</div>
