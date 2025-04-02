---
title: VirtualDisplay（虚拟显示）
---

# 虚拟显示屏

## 新建虚拟显示屏

将画面镜像到新建的虚拟显示屏（而非设备主屏幕）：

```bash
scrcpy --new-display=1920x1080
scrcpy --new-display=1920x1080/420  # 强制设为420 dpi
scrcpy --new-display         # 使用主屏幕尺寸和像素密度
scrcpy --new-display=/240    # 使用主屏幕尺寸和240 dpi
```

虚拟显示屏会在程序退出时销毁。

## 启动应用

部分设备会在虚拟显示屏中显示启动器。

若设备未提供启动器（或通过 [`--no-vd-system-decorations`](#系统装饰) 参数显式禁用），虚拟显示屏将显示空白内容。此时需要[启动安卓应用](/zhHans/reference/scrcpy/device#启动安卓应用)。

例如：

```bash
scrcpy --new-display=1920x1080 --start-app=org.videolan.vlc
```

也可以直接启动启动器应用。例如运行开源启动器 [Fossify Launcher]：

```bash
scrcpy --new-display=1920x1080 --no-vd-system-decorations --start-app=org.fossify.home
```

[Fossify Launcher]: https://f-droid.org/en/packages/org.fossify.home/

## 系统装饰

默认启用虚拟显示屏的系统装饰元素。禁用请使用 `--no-vd-system-decorations`：

```bash
scrcpy --new-display --no-vd-system-decorations
```

该参数适用于解决某些设备可能出现的UI异常，或禁用虚拟显示屏中默认的启动器界面。

注意：若未启动任何应用，虚拟显示屏将不会渲染任何内容，因此不会产生视频帧。

## 关闭时销毁

默认情况下，关闭虚拟显示屏时，正在运行的应用会被销毁。

若要将应用转移至主屏幕显示，请使用：

```bash
scrcpy --new-display --no-vd-destroy-content
```

## 输入法策略

默认情况下，虚拟显示屏的输入法会显示在默认屏幕上。

若要在本地显示屏显示输入法，请使用 `--display-ime-policy=local`：

```bash
scrcpy --display-id=1 --display-ime-policy=local
scrcpy --new-display --display-ime-policy=local
```