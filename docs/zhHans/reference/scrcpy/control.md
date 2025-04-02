---
title: Control（控制）
---

# 控制

## 只读模式

禁用所有控制功能（包括与设备交互的所有操作：输入按键、鼠标事件、拖放文件等）：

```bash
scrcpy --no-control
scrcpy -n   # 简写形式
```

## 键盘与鼠标

详见[键盘](/zhHans/reference/scrcpy/keyboard)和[鼠标](/zhHans/reference/scrcpy/mouse)文档。

## 仅控制模式

仅控制设备而不显示屏幕镜像：

```bash
scrcpy --no-video --no-audio
```

默认情况下，关闭视频播放时鼠标功能会被禁用。

如需使用相对鼠标模式控制设备，启用UHID鼠标模式：

```bash
scrcpy --no-video --no-audio --mouse=uhid
scrcpy --no-video --no-audio -M  # 简写形式
```

如需同时使用UHID键盘，需显式设置：

```bash
scrcpy --no-video --no-audio --mouse=uhid --keyboard=uhid
scrcpy --no-video --no-audio -MK  # 简写形式
```

如需改用AOA模式（仅限USB连接）：

```bash
scrcpy --no-video --no-audio --keyboard=aoa --mouse=aoa
```

## 复制粘贴

Android剪贴板内容变化时会自动同步到电脑剪贴板。

所有<kbd>Ctrl</kbd>快捷键都会转发到设备，例如：
 - <kbd>Ctrl</kbd>+<kbd>c</kbd> 通常执行复制
 - <kbd>Ctrl</kbd>+<kbd>x</kbd> 通常执行剪切
 - <kbd>Ctrl</kbd>+<kbd>v</kbd> 通常执行粘贴（在电脑到设备剪贴板同步后）

这些操作通常符合预期，但具体行为取决于当前应用。例如：
- _Termux_ 会在<kbd>Ctrl</kbd>+<kbd>c</kbd>时发送SIGINT信号
- _K-9 Mail_ 会触发新建邮件功能

针对此类情况（仅支持Android 7及以上版本），可通过以下组合键实现复制/剪切/粘贴：
 - <kbd>MOD</kbd>+<kbd>c</kbd> 注入`COPY`命令
 - <kbd>MOD</kbd>+<kbd>x</kbd> 注入`CUT`命令
 - <kbd>MOD</kbd>+<kbd>v</kbd> 注入`PASTE`命令（在电脑到设备剪贴板同步后）

此外，<kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>v</kbd>会将电脑剪贴板文本作为按键序列注入。这在组件不支持文本粘贴时（如_Termux_中）很有用，但可能破坏非ASCII内容。

**警告：** 将电脑剪贴板内容粘贴到设备（通过<kbd>Ctrl</kbd>+<kbd>v</kbd>或<kbd>MOD</kbd>+<kbd>v</kbd>）会将该内容存入Android剪贴板，导致任何应用均可读取。应避免以此方式粘贴敏感内容（如密码）。

部分Android设备在编程设置剪贴板时行为异常，可通过`--legacy-paste`选项修改<kbd>Ctrl</kbd>+<kbd>v</kbd>和<kbd>MOD</kbd>+<kbd>v</kbd>的行为，使其同样以按键序列方式注入电脑剪贴板文本（与<kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>v</kbd>相同）。

如需禁用自动剪贴板同步，使用`--no-clipboard-autosync`。

## 捏合缩放、旋转与倾斜模拟

模拟"捏合缩放"：<kbd>Ctrl</kbd>+_点击并移动_。

具体操作：按住<kbd>Ctrl</kbd>的同时按下鼠标左键。在左键释放前，所有鼠标移动都会以屏幕中心为基准对内容进行缩放和旋转（如果应用支持）。

https://github.com/Genymobile/scrcpy/assets/543275/26c4a920-9805-43f1-8d4c-608752d04767

模拟垂直倾斜手势：<kbd>Shift</kbd>+_点击并上下移动_。

https://github.com/Genymobile/scrcpy/assets/543275/1e252341-4a90-4b29-9d11-9153b324669f

类似地，模拟水平倾斜手势：<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+_点击并左右移动_。

技术实现上，_scrcpy_会通过屏幕中心对称点生成"虚拟手指"的额外触摸事件。按下<kbd>Ctrl</kbd>时_x_和_y_坐标会反转，单独按下<kbd>Shift</kbd>仅反转_x_，而<kbd>Ctrl</kbd>+<kbd>Shift</kbd>仅反转_y_。

此功能仅适用于默认鼠标模式（`--mouse=sdk`）。

## 文件拖放

### 安装APK

安装APK时，只需将APK文件（后缀为`.apk`）拖放到_scrcpy_窗口。

无视觉反馈，操作日志会打印到控制台。

### 推送文件到设备

推送文件到设备的`/sdcard/Download/`目录：将非APK文件拖放到_scrcpy_窗口。

无视觉反馈，操作日志会打印到控制台。

目标目录可通过启动参数修改：

```bash
scrcpy --push-target=/sdcard/Movies/
```