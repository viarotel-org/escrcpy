---
title: OTG
---

# OTG

默认情况下，_scrcpy_ 通过 Android API 层级注入输入事件。作为替代方案，它可以发送 HID 事件，使得 scrcpy 的行为类似于连接到 Android 设备的[物理键盘]和/或[物理鼠标]（详见[键盘](/zhHans/reference/scrcpy/keyboard)和[鼠标](/zhHans/reference/scrcpy/mouse)）。

[物理键盘]: /zhHans/reference/scrcpy/keyboard#physical-keyboard-simulation  
[物理鼠标]: /zhHans/reference/scrcpy/mouse#physical-mouse-simulation  

一种特殊模式（OTG）允许使用 AOA [键盘](/zhHans/reference/scrcpy/keyboard#aoa)、[鼠标](/zhHans/reference/scrcpy/mouse#aoa)和[游戏手柄](/zhHans/reference/scrcpy/gamepad#aoa)控制设备，完全无需使用 _adb_（因此 USB 调试不是必需的）。在此模式下，视频和音频被禁用，且默认启用 `--keyboard=aoa` 和 `--mouse=aoa`。但游戏手柄默认禁用，因此需要显式设置 `--gamepad=aoa`（或在 OTG 模式下使用 `-G`）。

因此，可以仅通过物理键盘、鼠标和游戏手柄模拟运行 _scrcpy_，就像计算机的键盘、鼠标和游戏手柄通过 OTG 线缆直接连接到设备一样。

启用 OTG 模式：

```bash
scrcpy --otg
# 如果连接了多个 USB 设备，需指定序列号
scrcpy --otg -s 0123456789abcdef
```

可以禁用键盘或鼠标：

```bash
scrcpy --otg --keyboard=disabled
scrcpy --otg --mouse=disabled
```

并启用游戏手柄：

```bash
scrcpy --otg --gamepad=aoa
scrcpy --otg -G  # 简写形式
```

此功能仅在设备通过 USB 连接时有效。

## Windows 上的 OTG 问题

详见[常见问题](/zhHans/help/scrcpy#otg-issues-on-windows)。

## 仅控制功能

请注意，OTG 的目的是在不启用 USB 调试（adb）的情况下控制设备。

如果仅需在启用 USB 调试时控制设备而不需要镜像功能，则无需使用 OTG 模式。

可以禁用视频和音频，并选择 UHID（或 AOA）：

```bash
scrcpy --no-video --no-audio --keyboard=uhid --mouse=uhid --gamepad=uhid
scrcpy --no-video --no-audio -KMG  # 简写形式
scrcpy --no-video --no-audio --keyboard=aoa --mouse=aoa --gamepad=aoa
```

UHID 的一个优势是它还可以无线工作。