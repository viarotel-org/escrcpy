---
title: Video（视频）
---

# 视频

## 源

默认情况下，scrcpy 会镜像显示设备屏幕。

也可以选择捕获设备摄像头画面。

详见专门的 [摄像头](/zhHans/reference/scrcpy/camera) 页面。

## 尺寸

默认情况下，scrcpy 会尝试以 Android 设备的分辨率进行镜像。

为了提升性能，可以降低分辨率进行镜像。以下命令将宽度和高度限制在最大值（此处为 1024）：

```bash
scrcpy --max-size=1024
scrcpy -m 1024   # 简写版本
```

另一边的尺寸会按比例计算，以保持 Android 设备的宽高比。例如，1920×1080 的设备会被镜像为 1024×576。

如果编码失败，scrcpy 会自动尝试降低分辨率（除非启用了 `--no-downsize-on-error`）。

对于摄像头镜像，`--max-size` 值用于选择摄像头源尺寸（在可用分辨率中）。

## 比特率

默认视频比特率为 8 Mbps。可以通过以下命令修改：

```bash
scrcpy --video-bit-rate=2M
scrcpy --video-bit-rate=2000000  # 等效
scrcpy -b 2M                     # 简写版本
```

## 帧率

可以限制捕获帧率：

```bash
scrcpy --max-fps=15
```

实际捕获帧率可以通过以下命令打印到控制台：

```bash
scrcpy --print-fps
```

也可以通过快捷键 <kbd>MOD</kbd>+<kbd>i</kbd> 随时启用或禁用（见 [快捷键](/zhHans/reference/scrcpy/shortcuts)）。

帧率本质上是可变的：只有当屏幕内容发生变化时才会生成新帧。例如，如果在设备上全屏播放 24fps 的视频，scrcpy 的帧率不会超过 24 帧每秒。

## 编解码器

可以选择视频编解码器，可选值为 `h264`（默认）、`h265` 和 `av1`：

```bash
scrcpy --video-codec=h264  # 默认
scrcpy --video-codec=h265
scrcpy --video-codec=av1
```

H265 可能提供更好的画质，但 H264 的延迟更低。当前 Android 设备上 AV1 编码器并不常见。

高级用法中，可以通过 `--video-codec-options` 传递任意参数给 [`MediaFormat`]，详见手册或 `scrcpy --help`。

[`MediaFormat`]: https://developer.android.com/reference/android/media/MediaFormat

## 编码器

设备上可能有多个编码器可用，可以通过以下命令列出：

```bash
scrcpy --list-encoders
```

有时，默认编码器可能存在问题甚至崩溃，因此可以尝试其他编码器：

```bash
scrcpy --video-codec=h264 --video-encoder=OMX.qcom.video.encoder.avc
```

## 方向

方向可以在三个不同层级上设置：
- 快捷键 <kbd>MOD</kbd>+<kbd>r</kbd> 会请求设备在竖屏和横屏之间切换（当前运行的应用程序可能会拒绝，如果不支持请求的方向）。
- `--capture-orientation` 改变镜像方向（从设备发送到电脑的视频方向），这会影响录制。
- `--orientation` 在客户端应用，影响显示和录制。对于显示，可以通过 [快捷键](/zhHans/reference/scrcpy/shortcuts) 动态改变。

以特定方向捕获视频：

```bash
scrcpy --capture-orientation=0
scrcpy --capture-orientation=90       # 顺时针 90°
scrcpy --capture-orientation=180      # 180°
scrcpy --capture-orientation=270      # 顺时针 270°
scrcpy --capture-orientation=flip0    # 水平翻转
scrcpy --capture-orientation=flip90   # 水平翻转 + 顺时针 90°
scrcpy --capture-orientation=flip180  # 水平翻转 + 180°
scrcpy --capture-orientation=flip270  # 水平翻转 + 顺时针 270°
```

可以通过 `@` 锁定捕获方向，使物理设备旋转不会改变捕获的视频方向：

```bash
scrcpy --capture-orientation=@         # 锁定为初始方向
scrcpy --capture-orientation=@0        # 锁定为 0°
scrcpy --capture-orientation=@90       # 锁定为顺时针 90°
scrcpy --capture-orientation=@180      # 锁定为 180°
scrcpy --capture-orientation=@270      # 锁定为顺时针 270°
scrcpy --capture-orientation=@flip0    # 锁定为水平翻转
scrcpy --capture-orientation=@flip90   # 锁定为水平翻转 + 顺时针 90°
scrcpy --capture-orientation=@flip180  # 锁定为水平翻转 + 180°
scrcpy --capture-orientation=@flip270  # 锁定为水平翻转 + 顺时针 270°
```

捕获方向变换在 `--crop` 之后应用，但在 `--angle` 之前。

设置视频方向（客户端）：

```bash
scrcpy --orientation=0
scrcpy --orientation=90       # 顺时针 90°
scrcpy --orientation=180      # 180°
scrcpy --orientation=270      # 顺时针 270°
scrcpy --orientation=flip0    # 水平翻转
scrcpy --orientation=flip90   # 水平翻转 + 顺时针 90°
scrcpy --orientation=flip180  # 垂直翻转（水平翻转 + 180°）
scrcpy --orientation=flip270  # 水平翻转 + 顺时针 270°
```

如果需要，可以通过 `--display-orientation` 和 `--record-orientation` 分别设置显示和录制的方向。

旋转通过向 MP4 或 MKV 目标文件写入显示变换来实现。翻转不支持，因此录制时仅允许前四个值。

## 角度

按自定义角度（顺时针，单位为度）旋转视频内容：

```bash
scrcpy --angle=23
```

旋转中心为可见区域的中心。

此变换在 `--crop` 和 `--capture-orientation` 之后应用。

## 裁剪

可以裁剪设备屏幕，仅镜像部分区域。

例如，仅镜像 Oculus Go 的一只眼睛：

```bash
scrcpy --crop=1224:1440:0:0   # 1224x1440，偏移 (0,0)
```

值以设备的自然方向表示（手机为竖屏，平板为横屏）。

裁剪在 `--capture-orientation` 和 `--angle` 之前应用。

对于显示镜像，`--max-size` 在裁剪后应用。对于摄像头，`--max-size` 首先应用（因为它选择源尺寸而非调整内容大小）。

## 显示

如果 Android 设备有多个显示器，可以选择镜像的显示器：

```bash
scrcpy --display-id=1
```

可以通过以下命令获取显示器 ID 列表：

```bash
scrcpy --list-displays
```

只有设备运行 Android 10 或更高版本时，才能控制副显示器（否则为只读镜像）。

也可以创建 [虚拟显示器](/zhHans/reference/scrcpy/virtual_display)。

## 缓冲

默认情况下，视频无缓冲，以实现最低延迟。

可以添加缓冲以延迟视频流并补偿抖动，获得更平滑的播放（见 [#2464]）。

[#2464]: https://github.com/Genymobile/scrcpy/issues/2464

配置可独立用于显示、[v4l2 接收端](/zhHans/reference/scrcpy/video#video4linux) 和 [音频](/zhHans/reference/scrcpy/audio#buffering) 播放。

```bash
scrcpy --video-buffer=50     # 为视频播放添加 50ms 缓冲
scrcpy --audio-buffer=200    # 为音频播放设置 200ms 缓冲
scrcpy --v4l2-buffer=300     # 为 v4l2 接收端添加 300ms 缓冲
```

可以同时应用：

```bash
scrcpy --video-buffer=50 --v4l2-buffer=300
```

## 无播放

可以在不播放视频或音频的情况下捕获 Android 设备。此选项在 [录制](/zhHans/reference/scrcpy/recording) 或启用 [v4l2](/zhHans/reference/scrcpy/#eo4linux) 时有用：

```bash
scrcpy --v4l2-sink=/dev/video2 --no-playback
scrcpy --record=file.mkv --no-playback
# 按 Ctrl+C 中断
```

也可以分别禁用视频和音频播放：

```bash
# 将视频发送到 V4L2 接收端但不播放，保留音频播放
scrcpy --v4l2-sink=/dev/video2 --no-video-playback

# 录制视频和音频，但仅播放视频
scrcpy --record=file.mkv --no-audio-playback
```

## 无视频

完全禁用视频转发，仅转发音频：

```bash
scrcpy --no-video
```

## Video4Linux

详见专门的 [Video4Linux](/zhHans/reference/scrcpy/v4l2) 页面。