---
title: Recording（录制）
---

# 录制

在镜像时录制视频和音频流：

```bash
scrcpy --record=file.mp4
scrcpy -r file.mkv
```

仅录制视频：

```bash
scrcpy --no-audio --record=file.mp4
```

仅录制音频：

```bash
scrcpy --no-video --record=file.opus
scrcpy --no-video --audio-codec=aac --record=file.aac
scrcpy --no-video --audio-codec=flac --record=file.flac
scrcpy --no-video --audio-codec=raw --record=file.wav
# .m4a/.mp4 和 .mka/.mkv 也支持 opus、aac 和 flac 格式
```

时间戳在设备端捕获，因此[数据包延迟变化]不会影响录制的文件（前提是使用 `--record` 选项，而不是在计算机上捕获 scrcpy 窗口和音频输出时）。

[数据包延迟变化]: https://en.wikipedia.org/wiki/Packet_delay_variation

## 格式

视频和音频流在设备端编码，但在客户端混合。支持多种格式（容器）：
- MP4（`.mp4`、`.m4a`、`.aac`）
- Matroska（`.mkv`、`.mka`）
- OPUS（`.opus`）
- FLAC（`.flac`）
- WAV（`.wav`）

容器会根据文件名自动选择。

也可以显式选择容器（此时文件名无需以已知扩展名结尾）：

```bash
scrcpy --record=file --record-format=mkv
```

## 旋转

可以录制旋转的视频。参见[视频方向](/zhHans/reference/scrcpy/video#orientation)。

## 无播放

在录制时禁用播放和控制：

```bash
scrcpy --no-playback --no-control --record=file.mp4
```

也可以分别禁用视频和音频播放：

```bash
# 录制视频和音频，但仅播放视频
scrcpy --record=file.mkv --no-audio-playback
```

同时禁用窗口：

```bash
scrcpy --no-playback --no-window --record=file.mp4
# 使用 Ctrl+C 中断录制
```

## 时间限制

限制录制时间：

```bash
scrcpy --record=file.mkv --time-limit=20  # 单位为秒
```

`--time-limit` 选项不仅限于录制，也会影响简单的镜像：

```bash
scrcpy --time-limit=20
```