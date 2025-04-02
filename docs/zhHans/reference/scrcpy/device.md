---
title: device（设备控制）
---

# 设备控制

某些命令行参数可以在scrcpy运行时对设备本身执行操作。

## 保持唤醒

当设备通过有线连接时，防止设备延迟休眠：

```bash
scrcpy --stay-awake
scrcpy -w  # 简写形式
```

scrcpy关闭时将恢复初始状态。

如果设备未通过有线连接（即仅通过TCP/IP连接），`--stay-awake`参数无效（这是Android系统的特性）。

该功能通过修改[`stay_on_while_plugged_in`]设置实现，也可手动调整：

[`stay_on_while_plugged_in`]: https://developer.android.com/reference/android/provider/Settings.Global#STAY_ON_WHILE_PLUGGED_IN

```bash
# 获取当前stay_on_while_plugged_in值
adb shell settings get global stay_on_while_plugged_in
# 为AC/USB/无线充电器启用保持唤醒
adb shell settings put global stay_on_while_plugged_in 7
# 禁用保持唤醒
adb shell settings put global stay_on_while_plugged_in 0
```

## 屏幕关闭超时

Android屏幕会在一定延迟后自动关闭。

在scrcpy运行时修改此延迟：

```bash
scrcpy --screen-off-timeout=300  # 300秒（5分钟）
```

退出时将恢复原始值。

也可手动修改此设置：

```bash
# 获取当前screen_off_timeout值
adb shell settings get system screen_off_timeout
# 设置新值（单位毫秒）
adb shell settings put system screen_off_timeout 30000
```

注意：Android系统值的单位是毫秒，而scrcpy命令行参数的单位是秒。

## 关闭屏幕

可以在镜像开始时通过命令行选项关闭设备屏幕：

```bash
scrcpy --turn-screen-off
scrcpy -S  # 简写形式
```

或随时按下<kbd>MOD</kbd>+<kbd>o</kbd>组合键（参见[快捷键](/zhHans/reference/scrcpy/shortcuts)）。

按<kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>o</kbd>可重新打开屏幕。

在Android设备上，物理`POWER`键总是会唤醒屏幕。为方便起见，通过scrcpy发送`POWER`指令（右键点击或<kbd>MOD</kbd>+<kbd>p</kbd>）会强制在一小段延迟后关闭屏幕（尽力而为）。物理`POWER`键仍会唤醒屏幕。

此功能也可用于防止设备休眠：

```bash
scrcpy --turn-screen-off --stay-awake
scrcpy -Sw  # 简写形式
```

从Android 15开始，可以手动修改此设置：

```bash
# 关闭屏幕（0表示主显示屏）
adb shell cmd display power-off 0
# 打开屏幕
adb shell cmd display power-on 0
```

## 显示触摸痕迹

在进行演示时，显示物理触摸痕迹（在物理设备上）可能很有用。Android在开发者选项中提供了此功能。

scrcpy提供了在启动时启用此功能并在退出时恢复初始值的选项：

```bash
scrcpy --show-touches
scrcpy -t  # 简写形式
```

注意：此功能仅显示物理触摸痕迹（手指在设备上的触摸）。

可以手动修改此设置：

```bash
# 获取当前show_touches值
adb shell settings get system show_touches
# 启用show_touches
adb shell settings put system show_touches 1
# 禁用show_touches
adb shell settings put system show_touches 0
```

## 关闭时断电

在关闭scrcpy时关闭设备屏幕：

```bash
scrcpy --power-off-on-close
```

## 启动时通电

默认情况下，启动时会唤醒设备。禁用此行为：

```bash
scrcpy --no-power-on
```

## 启动Android应用

列出设备上安装的Android应用：

```bash
scrcpy --list-apps
```

可以通过包名在启动时运行指定应用：

```bash
scrcpy --start-app=org.mozilla.firefox
```

此功能可用于在[虚拟显示器](virtual_display.md)中运行应用：

```bash
scrcpy --new-display=1920x1080 --start-app=org.videolan.vlc
```

可以在启动应用前强制停止它，只需添加`+`前缀：

```bash
scrcpy --start-app=+org.mozilla.firefox
```

为方便起见，也可以通过应用名称选择应用，需添加`?`前缀：

```bash
scrcpy --start-app=?firefox
```

但检索应用名称可能需要一些时间（有时需要几秒），因此建议直接使用包名。

`+`和`?`前缀可以组合使用（按此顺序）：

```bash
scrcpy --start-app=+?firefox
```