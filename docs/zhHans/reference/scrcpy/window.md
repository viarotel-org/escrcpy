---
title: Window（窗口控制）
---

# 窗口设置

## 禁用窗口显示

如需禁用窗口显示（适用于仅需录制或播放音频的场景）：

```bash
scrcpy --no-window --record=file.mp4
# 按Ctrl+C终止录制
```

## 窗口标题

默认窗口标题为设备型号，可通过以下命令修改：

```bash
scrcpy --window-title='我的设备'
```

## 位置与尺寸

可指定窗口初始位置和尺寸：

```bash
scrcpy --window-x=100 --window-y=100 --window-width=800 --window-height=600
```

## 无边框模式

禁用窗口装饰边框：

```bash
scrcpy --window-borderless
```

## 窗口置顶

保持窗口始终在最前端显示：

```bash
scrcpy --always-on-top
```

## 全屏模式

直接以全屏模式启动：

```bash
scrcpy --fullscreen
scrcpy -f   # 简写形式
```

全屏模式可通过快捷键 <kbd>MOD</kbd>+<kbd>f</kbd> 动态切换（参见[快捷键说明](/zhHans/reference/scrcpy/shortcuts)）。

## 禁用屏幕保护

默认情况下，_scrcpy_ 不会阻止计算机进入屏幕保护状态。如需禁用：

```bash
scrcpy --disable-screensaver
```