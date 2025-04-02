---
title: 快速上手
---

# 快速上手

## 安装说明

### 手动安装（通过发行包）

- [Github发布页](https://github.com/viarotel-org/escrcpy/releases)
- [Gitee发布页](https://gitee.com/viarotel-org/escrcpy/releases)
- [Gitcode发布页](https://gitcode.com/viarotel-org/escrcpy/releases)

### macOS用户可通过Homebrew安装

详见 [homebrew-escrcpy](https://github.com/viarotel-org/homebrew-escrcpy)

## USB连接方式

> 注意：若手机弹出调试授权提示，请点击允许

1. 在安卓设备上[启用开发者模式](https://www.bing.com/search?q=启用安卓开发者模式)和[USB调试](https://www.bing.com/search?q=启用安卓USB调试)功能
2. 启动Escrcpy并将安卓设备通过USB连接电脑
3. Escrcpy设备列表应已检测到您的设备，点击"开始镜像"
4. 开始使用！

## 无线连接方式

### 扫码连接

1. 先完成USB连接方式的步骤1-2
2. 在开发者选项中启用并进入"无线调试"
3. 点击"通过二维码配对设备"
4. 开始使用！

### IP地址连接

> 注意：若首次无线连接失败，可能需先进行无线配对，详见[常见问题](/help/)
>
> 注意：需在无线调试页面获取设备无线地址（通常为连接WiFi时分配的IP地址）和端口号（默认为5555）

1. 先完成USB连接方式的步骤1-2
2. 在Escrcpy中输入设备IP地址和端口号，点击"连接设备"
3. 此时设备列表应显示您的手机，点击"开始镜像"
4. 开始使用！

## macOS与Linux平台

> 注意：这些平台未预装[Scrcpy](/reference/scrcpy/)，需手动安装

**Escrcpy@1.27.1+版本已初步集成scrcpy二进制文件，无需手动安装**

1. Linux用户参考[安装文档](/reference/scrcpy/linux.md)
2. macOS用户参考[安装文档](/reference/scrcpy/macos.md)
3. 依赖安装成功后，按照USB连接或无线连接的步骤操作即可

## Gnirehtet反向网络共享
> Windows和Linux应用已内置Gnirehtet功能，可实现PC到安卓设备的网络共享。

设备连接成功后，通过`设备`->`设备控制栏`->`Gnirehtet`启用反向网络功能。

**注意：macOS版本未内置Gnirehtet，需手动安装才能使用该功能[安装指南](/reference/gnirehtet/)**