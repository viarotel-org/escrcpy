---
title: develop（开发者指南）
---

# 开发者指南：scrcpy

## 概述

该应用由两部分组成：
- 服务端（`scrcpy-server`），在设备上执行；
- 客户端（`scrcpy` 可执行文件），在主机上执行。

客户端负责将服务端推送到设备并启动其执行。

客户端和服务端通过独立的套接字进行视频、音频和控制通信。这些功能可以单独禁用（但不能全部禁用），因此可能使用 1、2 或 3 个套接字。

服务端首先在第一个套接字上发送设备名称（用于 scrcpy 窗口标题），随后每个套接字分别用于其特定用途。客户端和服务端均为每个套接字分配专用线程进行读写操作。

如果启用了视频功能，服务端会发送设备屏幕的原始视频流（默认为 H.264 编码），每个数据包附带额外头部信息。客户端解码视频帧并尽快显示，不进行缓冲（除非指定 `--video-buffer=delay`）以最小化延迟。客户端不感知设备旋转（由服务端处理），仅知道接收到的视频帧尺寸。

类似地，如果启用了音频功能，服务端会发送设备音频输出（或通过 `--audio-source=mic` 指定麦克风输入）的原始音频流（默认为 OPUS 编码），每个数据包附带额外头部信息。客户端解码音频流，尝试通过保持最小缓冲来降低延迟。[scrcpy v2.0 发布的博客文章][scrcpy2]详细介绍了音频功能。

如果启用了控制功能，客户端会捕获相关的键盘和鼠标事件，并将其传输到服务端，由服务端注入到设备中。这是唯一一个双向使用的套接字：输入事件从客户端发送到设备，而当设备剪贴板内容变化时，新内容会从设备发送到客户端，以实现无缝复制粘贴。

[scrcpy2]: https://blog.rom1v.com/2023/03/scrcpy-2-0-with-audio/

需要注意的是，客户端和服务端的角色是从应用层面定义的：
- 服务端提供视频和音频流，并处理客户端的请求；
- 客户端通过服务端控制设备。

然而，默认情况下（未设置 `--force-adb-forward` 时），网络层面的角色是相反的：
- 客户端在启动服务端之前打开服务器套接字并监听端口；
- 服务端连接到客户端。

这种角色反转避免了因竞态条件导致的连接失败，而无需轮询。

---

## 服务端

### 权限

捕获屏幕需要一些权限，这些权限已授予 `shell` 用户。

服务端是一个 Java 应用程序（包含 [`public static void main(String... args)`][main] 方法），针对 Android 框架编译，并在 Android 设备上以 `shell` 用户身份执行。

[main]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/server/src/main/java/com/genymobile/scrcpy/Server.java#L193

要运行这样的 Java 应用程序，类必须被 [_dexed_][dex]（通常是 `classes.dex`）。如果 `my.package.MainClass` 是主类，编译为 `classes.dex` 并推送到设备的 `/data/local/tmp` 目录，则可以通过以下命令运行：

```bash
adb shell CLASSPATH=/data/local/tmp/classes.dex app_process / my.package.MainClass
```

_路径 `/data/local/tmp` 是推送服务端的理想选择，因为它对 `shell` 用户可读写，但对其他用户不可写，因此恶意应用无法在客户端执行前替换服务端。_

除了原始的 _dex_ 文件，`app_process` 还接受包含 `classes.dex` 的 _jar_ 文件（例如 [APK]）。为了简化操作并利用 gradle 构建系统，服务端被构建为一个（未签名的）APK（重命名为 `scrcpy-server.jar`）。

[dex]: https://en.wikipedia.org/wiki/Dalvik_(software)
[apk]: https://en.wikipedia.org/wiki/Android_application_package

### 隐藏方法

尽管针对 Android 框架编译，[隐藏][hidden]方法和类无法直接访问（且不同 Android 版本可能有所不同）。

可以通过反射调用这些方法。与隐藏组件的通信由 [_wrapper_ 类][wrappers] 和 [aidl] 提供。

[hidden]: https://stackoverflow.com/a/31908373/1987178
[wrappers]: https://github.com/Genymobile/scrcpy/tree/master/server/src/main/java/com/genymobile/scrcpy/wrappers
[aidl]: https://github.com/Genymobile/scrcpy/tree/master/server/src/main/aidl

### 执行

客户端通过以下命令启动服务端：

```bash
adb push scrcpy-server /data/local/tmp/scrcpy-server.jar
adb forward tcp:27183 localabstract:scrcpy
adb shell CLASSPATH=/data/local/tmp/scrcpy-server.jar app_process / com.genymobile.scrcpy.Server 2.1
```

第一个参数（示例中的 `2.1`）是客户端的 scrcpy 版本。如果客户端和服务端版本不完全一致，服务端会失败。客户端和服务端之间的协议可能因版本而异（参见[协议](#协议)部分），且没有向后或向前兼容性（使用不同版本的服务端和客户端毫无意义）。此检查用于检测配置错误（意外运行旧版或新版服务端）。

随后可以跟随任意数量的参数，形式为 `key=value` 对，顺序无关。可能的键及其值类型可以在[服务端][server-options]和[客户端][client-options]代码中找到。

[server-options]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/server/src/main/java/com/genymobile/scrcpy/Options.java#L181
[client-options]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/app/src/server.c#L226

例如，如果执行 `scrcpy -m1920 --no-audio`，则服务端的执行如下：

```bash
# scid 是一个随机数，用于区分同一设备上运行的不同客户端
adb shell CLASSPATH=/data/local/tmp/scrcpy-server.jar app_process / com.genymobile.scrcpy.Server 2.1 scid=12345678 log_level=info audio=false max_size=1920
```

### 组件

执行时，其 [`main()`][main] 方法（在“主”线程中运行）会解析参数，建立与客户端的连接，并启动其他“组件”：
- **视频**流：捕获屏幕视频并通过 _video_ 套接字发送编码后的视频数据包（从 _video_ 线程）。
- **音频**流：使用多个线程捕获原始数据包，提交编码并获取编码后的数据包，通过 _audio_ 套接字发送。
- **控制器**：从一个线程接收 _control_ 套接字上的控制消息（通常是输入事件），并从另一个线程通过同一 _control_ 套接字发送设备消息（例如将设备剪贴板内容传输到客户端）。因此，_control_ 套接字是双向使用的（与 _video_ 和 _audio_ 套接字不同）。

### 屏幕视频编码

编码由 [`ScreenEncoder`] 管理。

视频使用 [`MediaCodec`] API 编码。编码器编码与显示关联的 `Surface` 内容，并将编码后的数据包写入客户端（通过 _video_ 套接字）。

[`ScreenEncoder`]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/server/src/main/java/com/genymobile/scrcpy/ScreenEncoder.java
[`MediaCodec`]: https://developer.android.com/reference/android/media/MediaCodec.html

在设备旋转（或折叠）时，编码会话会[重置][reset]并重新启动。

仅当 Surface 发生变化时才会生成新帧。这避免了发送不必要的帧，但默认情况下可能存在以下问题：
- 如果设备屏幕未变化，启动时不会发送任何帧；
- 快速运动变化后，最后一帧的质量可能较差。

这两个问题通过标志 [`KEY_REPEAT_PREVIOUS_FRAME_AFTER`][repeat-flag] [解决][repeat]。

[reset]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/server/src/main/java/com/genymobile/scrcpy/ScreenEncoder.java#L179
[repeat]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/server/src/main/java/com/genymobile/scrcpy/ScreenEncoder.java#L246-L247
[repeat-flag]: https://developer.android.com/reference/android/media/MediaFormat.html#KEY_REPEAT_PREVIOUS_FRAME_AFTER

### 音频编码

类似地，音频通过 [`AudioRecord`] [捕获][captured]，并使用 [`MediaCodec`] 异步 API [编码][encoded]。

更多细节请参阅介绍音频功能的[博客文章][scrcpy2]。

[captured]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/server/src/main/java/com/genymobile/scrcpy/AudioCapture.java
[encoded]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/server/src/main/java/com/genymobile/scrcpy/AudioEncoder.java
[`AudioRecord`]: https://developer.android.com/reference/android/media/AudioRecord

### 输入事件注入

_控制消息_ 由客户端通过 [`Controller`]（在单独线程中运行）接收。输入事件有多种类型：
- 键码（参考 [`KeyEvent`]）；
- 文本（特殊字符可能无法直接通过键码处理）；
- 鼠标移动/点击；
- 鼠标滚动；
- 其他命令（例如开关屏幕或复制剪贴板）。

其中一些需要通过系统注入输入事件。为此，它们使用 _隐藏_ 方法 [`InputManager.injectInputEvent()`]（由 [`InputManager` 包装器][inject-wrapper] 暴露）。

[`Controller`]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/server/src/main/java/com/genymobile/scrcpy/Controller.java
[`KeyEvent`]: https://developer.android.com/reference/android/view/KeyEvent.html
[`InputManager.injectInputEvent()`]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/server/src/main/java/com/genymobile/scrcpy/wrappers/InputManager.java#L34
[inject-wrapper]: https://github.com/Genymobile/scrcpy/blob/ffe0417228fb78ab45b7ee4e202fc06fc8875bf3/server/src/main/java/com/genymobile/scrcpy/wrappers/InputManager.java#L27

---

## 客户端

客户端依赖 [SDL]，它提供了跨平台的 UI、输入事件、线程等 API。

视频和音频流由 [FFmpeg] 解码。

[SDL]: https://www.libsdl.org
[ffmpeg]: https://ffmpeg.org/

### 初始化

客户端解析命令行参数后，[运行以下两种代码路径之一][run]：
- scrcpy 的“正常”模式（[`scrcpy.c`]）；
- scrcpy 的 [OTG 模式](/zhHans/reference/scrcpy/otg)（[`scrcpy_otg.c`]）。

[run]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/app/src/main.c#L81-L82
[`scrcpy.c`]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/app/src/scrcpy.c#L292-L293
[`scrcpy_otg.c`]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/app/src/usb/scrcpy_otg.c#L51-L52

在本文档的剩余部分，我们假设使用的是“正常”模式（OTG 模式的代码请自行阅读）。

启动时，客户端：
- 打开 _video_、_audio_ 和 _control_ 套接字；
- 推送并启动设备上的服务端；
- 初始化其组件（解复用器、解码器、录制器等）。

### 视频和音频流

根据传递给 `scrcpy` 的参数，可能会使用多个组件。以下是视频和音频组件的概述：

```
                                                 V4L2 sink
                                               /
                                       decoder
                                     /         \
        VIDEO -------------> demuxer             display
                                     \
                                       recorder
                                     /
        AUDIO -------------> demuxer
                                     \
                                       decoder --- audio player
```

_解复用器_ 负责提取视频和音频数据包（读取头部信息，在正确边界处拆分视频流等）。

解复用后的数据包可能发送到 _解码器_（每个流一个，用于生成帧）和录制器（接收视频和音频流以录制单个文件）。数据包在设备上编码（通过 `MediaCodec`），但在录制时，它们会在客户端异步 _复用_ 到容器（MKV 或 MP4）中。

视频帧发送到屏幕/显示器以在 scrcpy 窗口中渲染，也可能发送到 [V4L2 sink](/zhHans/reference/scrcpy/v4l2)。

音频“帧”（解码后的样本数组）发送到音频播放器。

### 控制器

_控制器_ 负责向设备发送 _控制消息_。它在单独的线程中运行，以避免在主线程上进行 I/O 操作。

在主线程上接收 SDL 事件时，_输入管理器_ 会创建相应的 _控制消息_。它负责将 SDL 事件转换为 Android 事件，然后将 _控制消息_ 推送到控制器持有的队列中。控制器在自己的线程中从队列中取出消息，序列化后发送到客户端。

---

## 协议

客户端和服务端之间的协议应视为 _内部_：它可能（并且将会）因任何原因随时更改。所有内容（套接字数量、套接字打开顺序、数据格式等）都可能因版本而异。客户端必须始终与匹配的服务端版本一起运行。

本节记录了 scrcpy v2.1 的当前协议。

### 连接

首先，客户端设置 adb 隧道：

```bash
# 默认情况下是反向重定向：计算机监听，设备连接
adb reverse localabstract:scrcpy_<SCID> tcp:27183

# 作为回退（或设置了 --force-adb forward 时），是正向重定向：
# 设备监听，计算机连接
adb forward tcp:27183 localabstract:scrcpy_<SCID>
```

（`<SCID>` 是一个 31 位随机数，以避免同一设备上同时启动多个 scrcpy 实例时失败。）

随后，按顺序打开最多 3 个套接字：
- _video_ 套接字；
- _audio_ 套接字；
- _control_ 套接字。

每个套接字都可以禁用（分别通过 `--no-video`、`--no-audio` 和 `--no-control`，直接或间接）。例如，如果设置了 `--no-audio`，则首先打开 _video_ 套接字，然后是 _control_ 套接字。

在打开的 _第一个_ 套接字上（无论哪个），如果隧道是 _正向_ 的，则设备会向客户端发送一个[虚拟字节][dummy byte]。这用于检测连接错误（只要存在 adb 正向重定向，客户端连接就不会失败，即使设备端没有监听）。

仍然在此 _第一个_ 套接字上，设备向客户端发送一些[元数据][device meta]（目前仅设备名称，用作窗口标题，但未来可能包含其他字段）。

[dummy byte]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/server/src/main/java/com/genymobile/scrcpy/DesktopConnection.java#L93
[device meta]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/server/src/main/java/com/genymobile/scrcpy/DesktopConnection.java#L151

更多细节请阅读[客户端][client-connection]和[服务端][server-connection]代码。

[client-connection]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/app/src/server.c#L465-L466
[server-connection]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/server/src/main/java/com/genymobile/scrcpy/DesktopConnection.java#L63

随后，每个套接字用于其预定用途。

### 视频和音频

在 _video_ 和 _audio_ 套接字上，设备首先发送一些[编解码器元数据][codec metadata]：
- 在 _video_ 套接字上，12 字节：
  - 编解码器 ID（`u32`）（H264、H265 或 AV1）；
  - 初始视频宽度（`u32`）；
  - 初始视频高度（`u32`）。
- 在 _audio_ 套接字上，4 字节：
  - 编解码器 ID（`u32`）（OPUS、AAC 或 RAW）。

[codec metadata]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/server/src/main/java/com/genymobile/scrcpy/Streamer.java#L33-L51

随后，每个由 `MediaCodec` 生成的数据包会附带一个 12 字节的[帧头部][frame header]：
- 配置包标志（`u1`）；
- 关键帧标志（`u1`）；
- PTS（`u62`）；
- 数据包大小（`u32`）。

以下是帧头部的结构描述：

```
    [. . . . . . . .|. . . .]. . . . . . . . . . . . . . . ...
     <-------------> <-----> <-----------------------------...
           PTS        packet        raw packet
                       size
     <--------------------->
           frame header

PTS 的最高位用于数据包标志：

     byte 7   byte 6   byte 5   byte 4   byte 3   byte 2   byte 1   byte 0
    CK...... ........ ........ ........ ........ ........ ........ ........
    ^^<------------------------------------------------------------------->
    ||                                PTS
    | `- 关键帧
     `-- 配置包
```

[frame header]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/server/src/main/java/com/genymobile/scrcpy/Streamer.java#L83

### 控制

控制消息通过自定义二进制协议发送。

该协议的唯一文档是双方的单元测试：
- `ControlMessage`（从客户端到设备）：[序列化](https://github.com/Genymobile/scrcpy/blob/master/app/tests/test_control_msg_serialize.c) | [反序列化](https://github.com/Genymobile/scrcpy/blob/master/server/src/test/java/com/genymobile/scrcpy/ControlMessageReaderTest.java)；
- `DeviceMessage`（从设备到客户端）：[序列化](https://github.com/Genymobile/scrcpy/blob/master/server/src/test/java/com/genymobile/scrcpy/DeviceMessageWriterTest.java) | [反序列化](https://github.com/Genymobile/scrcpy/blob/master/app/tests/test_device_msg_deserialize.c)。

---

## 独立服务端

尽管服务端设计用于 scrcpy 客户端，但它可以与任何使用相同协议的客户端一起使用。

为了简化操作，添加了一些[服务端特定选项][server-specific options]以轻松生成原始流：
- `send_device_meta=false`：禁用通过 _第一个_ 套接字发送的设备元数据（实际为设备名称）；
- `send_frame_meta=false`：禁用每个数据包的 12 字节头部；
- `send_dummy_byte`：禁用正向连接时发送的虚拟字节；
- `send_codec_meta`：禁用编解码信息（以及视频的初始设备尺寸）；
- `raw_stream`：禁用上述所有内容。

[server-specific options]: https://github.com/Genymobile/scrcpy/blob/a3cdf1a6b86ea22786e1f7d09b9c202feabc6949/server/src/main/java/com/genymobile/scrcpy/Options.java#L309-L329

具体来说，以下是如何在 TCP 套接字上暴露原始 H.264 流：

```bash
adb push scrcpy-server-v2.1 /data/local/tmp/scrcpy-server-manual.jar
adb forward tcp:1234 localabstract:scrcpy
adb shell CLASSPATH=/data/local/tmp/scrcpy-server-manual.jar \
    app_process / com.genymobile.scrcpy.Server 2.1 \
    tunnel_forward=true audio=false control=false cleanup=false \
    raw_stream=true max_size=1920
```

一旦客户端通过 TCP 连接到端口 1234，设备就会开始流式传输视频。例如，VLC 可以播放视频（尽管会有很高的延迟，更多细节[在此][vlc-0latency]）：

```bash
vlc -Idummy --demux=h264 --network-caching=0 tcp://localhost:1234
```

[vlc-0latency]: https://code.videolan.org/rom1v/vlc/-/merge_requests/20

---

## 黑客指南

更多细节，请阅读代码！

如果发现错误或有绝妙的想法，欢迎讨论和贡献 ;-)

### 调试服务端

服务端由客户端在启动时推送到设备。

要调试它，请在配置时启用服务端调试器：

```bash
meson setup x -Dserver_debugger=true
# 或者，如果 x 已配置
meson configure x -Dserver_debugger=true
```

然后重新编译并运行 scrcpy。

对于 Android < 11，它会在设备的 5005 端口启动调试器并等待。将该端口重定向到计算机：

```bash
adb forward tcp:5005 tcp:5005
```

对于 Android >= 11，首先找到监听端口：

```bash
adb jdwp
# 按 Ctrl+C 中断
```

然后重定向结果 PID：

```bash
adb forward tcp:5005 jdwp:XXXX  # 替换 XXXX
```

在 Android Studio 中，_Run_ > _Debug_ > _Edit configurations..._，在左侧点击 `+`，选择 _Remote_，并填写表单：
- Host: `localhost`；
- Port: `5005`。

然后点击 _Debug_。