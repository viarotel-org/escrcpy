---
title: Gnirehtet
---

> [!IMPORTANT]
> Escrcpy基于以下开源项目构建。相关内容按原样提供，仅供用户参考，并将定期更新。

# Gnirehtet (v2.5.1)

该项目通过`adb`为Android设备提供**反向网络共享**功能：允许设备使用所连接计算机的网络连接。它不需要任何_root_权限（设备或计算机均无需）。支持_GNU/Linux_、_Windows_和_Mac OS_。

目前，它通过[IPv4]转发[TCP]和[UDP]流量，但不支持[IPv6]（未来可能支持？）。

[TCP]: https://en.wikipedia.org/wiki/Transmission_Control_Protocol
[UDP]: https://fr.wikipedia.org/wiki/User_Datagram_Protocol
[IPv4]: https://en.wikipedia.org/wiki/IPv4
[IPv6]: https://en.wikipedia.org/wiki/IPv6

_**该项目已不再积极维护，仅修复重大阻塞问题（如构建问题）。但功能仍可正常使用。**_


## 版本

_Gnirehtet_提供两种实现：
 - **Java**版本；
 - **Rust**版本。


### 如何选择？

推荐使用**Rust**版本。原生二进制文件占用更少的CPU和内存资源，且无需安装_Java_运行时环境。

_Gnirehtet_的中继服务器最初仅以Java实现，其优势在于支持所有安装了_Java 8_运行时的平台。目前仍保留该版本，以便在Rust版本出现问题时作为备选方案。


## 要求

Android应用至少需要API 21（Android 5.0）。

仅针对_Java_版本，计算机需安装_Java 8_（JRE）。在基于Debian的系统中，请安装`openjdk-8-jre`包。

### adb

需要较新版本的[adb]（支持`adb reverse`命令，1.0.36版本已验证可用）。

可通过[Android SDK平台工具][platform-tools]获取。

在基于Debian的系统中，也可安装`android-tools-adb`包。

在Windows上，若仅为此应用需要`adb`，可直接下载[平台工具][platform-tools-windows]，并将以下文件解压至_gnirehtet_目录：
 - `adb.exe`
 - `AdbWinApi.dll`
 - `AdbWinUsbApi.dll`

确保已在设备上[启用adb调试][enable-adb]。

[adb]: https://developer.android.com/studio/command-line/adb.html
[enable-adb]: https://developer.android.com/studio/command-line/adb.html#Enabling
[platform-tools]: https://developer.android.com/studio/releases/platform-tools.html
[platform-tools-windows]: https://dl.google.com/android/repository/platform-tools-latest-windows.zip


## 获取应用

### Homebrew

若使用[Homebrew](https://brew.sh/)，安装过程非常简单。安装Rust版本：

```
brew install gnirehtet
```

### 下载

从[最新发布][latest]中下载所需版本。

[latest]: https://github.com/Genymobile/gnirehtet/releases/latest


#### Rust

 - **Linux:** [`gnirehtet-rust-linux64-v2.5.1.zip`][direct-rust-linux64]  
   (SHA-256: _dee55499ca4fef00ce2559c767d2d8130163736d43fdbce753e923e75309c275_)
 - **Windows:** [`gnirehtet-rust-win64-v2.5.1.zip`][direct-rust-win64]  
   (SHA-256: _7f5b1063e7895182aa60def1437e50363c3758144088dcd079037bb7c3c46a1c_)
 - **MacOS:** [`gnirehtet-rust-macos64-v2.2.1.zip`][direct-rust-macos64]
   _（旧版本）_  
   (SHA-256: _902103e6497f995e1e9b92421be212559950cca4a8b557e1f0403769aee06fc8_)

[direct-rust-linux64]: https://github.com/Genymobile/gnirehtet/releases/download/v2.5.1/gnirehtet-rust-linux64-v2.5.1.zip
[direct-rust-win64]: https://github.com/Genymobile/gnirehtet/releases/download/v2.5.1/gnirehtet-rust-win64-v2.5.1.zip
[direct-rust-macos64]: https://github.com/Genymobile/gnirehtet/releases/download/v2.2.1/gnirehtet-rust-macos64-v2.2.1.zip

下载后解压文件。

Linux和MacOS压缩包包含：
 - `gnirehtet.apk`
 - `gnirehtet`

Windows压缩包包含：
 - `gnirehtet.apk`
 - `gnirehtet.exe`
 - `gnirehtet-run.cmd`


#### Java

 - **全平台:** [`gnirehtet-java-v2.5.1.zip`][direct-java]  
   (SHA-256: _816748078fa6a304600a294a13338a06ac778bcc0e57b62d88328c7968ad2d3a_)

[direct-java]: https://github.com/Genymobile/gnirehtet/releases/download/v2.5.1/gnirehtet-java-v2.5.1.zip

解压后包含：
 - `gnirehtet.apk`
 - `gnirehtet.jar`
 - `gnirehtet`
 - `gnirehtet.cmd`
 - `gnirehtet-run.cmd`


## 运行（简单方式）

_注意：在Windows上，以下命令中的`./gnirehtet`需替换为`gnirehtet`。_

该应用无用户界面，需通过计算机控制。

若需为单一设备启用反向网络共享，直接执行：

```shell
./gnirehtet run
```

反向网络共享将持续生效，直至按下_Ctrl+C_终止。

在Windows上，为方便起见，可直接双击`gnirehtet-run.cmd`（其功能等同于`gnirehtet run`，无需打开终端）。

首次启动时会弹出权限请求窗口：

![request](https://cdn.jsdelivr.net/gh/Genymobile/gnirehtet@master/assets/request.jpg)

当_Gnirehtet_激活时，状态栏会显示“钥匙”图标：

![key](https://cdn.jsdelivr.net/gh/Genymobile/gnirehtet@master/assets/key.png)

若需为所有已连接设备（包括后续连接的设备）启用反向网络共享，可执行：

```shell
./gnirehtet autorun
```

## 运行（分步操作）

可分别执行各步骤（适用于需同时为多台设备启用反向网络共享的场景）。

启动中继服务器并保持运行：

```shell
./gnirehtet relay
```

在Android设备上安装`apk`：

```shell
./gnirehtet install [serial]
```

在另一终端中，为每个客户端执行：

```shell
./gnirehtet start [serial]
```

停止客户端：

```shell
./gnirehtet stop [serial]
```

重置隧道（当设备在_Gnirehtet_激活时断开并重新连接后，可用于恢复连接）：

```shell
./gnirehtet tunnel [serial]
```

仅当`adb devices`输出多个设备时，才需指定_serial_参数。

高级选项可通过不带参数的`./gnirehtet`命令查看详情。


## 手动运行

`gnirehtet`程序提供了简单的命令行接口，实际执行的是底层命令。用户也可手动调用这些命令。

启动中继服务器：

```shell
./gnirehtet relay
```

安装apk：

```shell
adb install -r gnirehtet.apk
```

启动客户端：

```shell
adb reverse localabstract:gnirehtet tcp:31416
adb shell am start -a com.genymobile.gnirehtet.START \
    -n com.genymobile.gnirehtet/.GnirehtetActivity
```

停止客户端：

```shell
adb shell am start -a com.genymobile.gnirehtet.STOP \
    -n com.genymobile.gnirehtet/.GnirehtetActivity
```


## 环境变量

`ADB`用于指定自定义的`adb`路径：

```shell
ADB=/path/to/my/adb ./gnirehtet run
```

`GNIREHTET_APK`用于指定自定义的`gnirehtet.apk`路径：

```shell
GNIREHTET_APK=/usr/share/gnirehtet/gnirehtet.apk ./gnirehtet run
```


## 为什么叫_gnirehtet_？

    rev <<< tethering

（在_Bash_中）


## 开发者

阅读[开发者页面]。

[开发者页面]: https://github.com/Genymobile/gnirehtet/blob/master/DEVELOP.md


## 许可证

```
版权所有 (C) 2017 Genymobile

根据Apache许可证2.0版（“许可证”）授权；
除非符合许可证，否则不得使用此文件。
您可在以下网址获取许可证副本：

    http://www.apache.org/licenses/LICENSE-2.0

除非适用法律要求或书面同意，按“原样”分发的软件
无任何明示或暗示的担保或条件。
详见许可证中特定语言规定的权限和限制。
```


## 相关文章

- [介绍“gnirehtet”：Android反向网络共享工具][medium-1]（[法语版][blog-1]）
- [Gnirehtet 2：基于Rust的Android反向网络共享工具][medium-2]
- [Gnirehtet重写为Rust版本][blog-2-en]（[法语版][blog-2-fr]）

[medium-1]: https://medium.com/@rom1v/gnirehtet-reverse-tethering-android-2afacdbdaec7
[blog-1]: https://blog.rom1v.com/2017/03/gnirehtet/
[medium-2]: https://medium.com/genymobile/gnirehtet-2-our-reverse-tethering-tool-for-android-now-available-in-rust-999960483d5a
[blog-2-en]: https://blog.rom1v.com/2017/09/gnirehtet-rewritten-in-rust/
[blog-2-fr]: https://blog.rom1v.com/2017/09/gnirehtet-reecrit-en-rust/