---
title: Audio（音频）
---

# 音频

音频转发功能支持运行 Android 11 或更高版本的设备，并默认启用：

 - **Android 12 或更新版本**：开箱即用。
 - **Android 11**：需要确保在启动 scrcpy 时设备屏幕已解锁。此时会短暂弹出一个虚假窗口，让系统认为 shell 应用处于前台。若不满足此条件，音频捕获将失败。
 - **Android 10 或更早版本**：无法捕获音频，功能自动禁用。

如果音频捕获失败，镜像会继续仅传输视频（由于音频默认启用，若音频不可用，scrcpy 不会直接失败，除非设置了 `--require-audio`）。

## 禁用音频

要禁用音频功能：

```
scrcpy --no-audio
```

若仅禁用音频播放，请参阅[禁用播放](/zhHans/reference/scrcpy/video#no-playback)。

## 仅音频模式

要仅播放音频，需禁用视频和控制功能：

```bash
scrcpy --no-video --no-control
```

要在无窗口模式下播放音频：

```bash
# --no-video 和 --no-control 会被 --no-window 隐含
scrcpy --no-window
# 按 Ctrl+C 中断
```

无视频时，音频延迟通常不关键，因此可以增加[缓冲](#buffering)以减少卡顿：

```
scrcpy --no-video --audio-buffer=200
```

## 音频源

默认情况下，转发的是设备音频输出。

也可以捕获设备麦克风输入：

```
scrcpy --audio-source=mic
```

例如，将设备用作录音机并直接在电脑上录制：

```
scrcpy --audio-source=mic --no-video --no-playback --record=file.opus
```

支持的音频源包括：

 - `output`（默认）：转发全部音频输出，并禁用设备播放（映射到 [`REMOTE_SUBMIX`](https://developer.android.com/reference/android/media/MediaRecorder.AudioSource#REMOTE_SUBMIX)）。
 - `playback`：捕获音频播放（Android 应用可选择退出，因此不一定能捕获全部输出）。
 - `mic`：捕获麦克风输入（映射到 [`MIC`](https://developer.android.com/reference/android/media/MediaRecorder.AudioSource#MIC)）。
 - `mic-unprocessed`：捕获未经处理的麦克风原始音频（映射到 [`UNPROCESSED`](https://developer.android.com/reference/android/media/MediaRecorder.AudioSource#UNPROCESSED)）。
 - `mic-camcorder`：捕获为视频录制优化的麦克风音频，方向与摄像头一致（映射到 [`CAMCORDER`](https://developer.android.com/reference/android/media/MediaRecorder.AudioSource#CAMCORDER)）。
 - `mic-voice-recognition`：捕获为语音识别优化的麦克风音频（映射到 [`VOICE_RECOGNITION`](https://developer.android.com/reference/android/media/MediaRecorder.AudioSource#VOICE_RECOGNITION)）。
 - `mic-voice-communication`：捕获为语音通信优化的麦克风音频（例如支持回声消除或自动增益控制）（映射到 [`VOICE_COMMUNICATION`](https://developer.android.com/reference/android/media/MediaRecorder.AudioSource#VOICE_COMMUNICATION)）。
 - `voice-call`：捕获语音通话（映射到 [`VOICE_CALL`](https://developer.android.com/reference/android/media/MediaRecorder.AudioSource#VOICE_CALL)）。
 - `voice-call-uplink`：仅捕获语音通话上行链路（映射到 [`VOICE_UPLINK`](https://developer.android.com/reference/android/media/MediaRecorder.AudioSource#VOICE_UPLINK)）。
 - `voice-call-downlink`：仅捕获语音通话下行链路（映射到 [`VOICE_DOWNLINK`](https://developer.android.com/reference/android/media/MediaRecorder.AudioSource#VOICE_DOWNLINK)）。
 - `voice-performance`：捕获适用于实时表演（如卡拉OK）的音频，包括麦克风和设备播放（映射到 [`VOICE_PERFORMANCE`](https://developer.android.com/reference/android/media/MediaRecorder.AudioSource#VOICE_PERFORMANCE)）。

### 音频复制

另一种设备音频捕获方法（仅限 Android 13 及以上版本）：

```
scrcpy --audio-source=playback
```

此音频源支持在镜像时保持设备音频播放，通过 `--audio-dup` 实现：

```bash
scrcpy --audio-source=playback --audio-dup
# 或简写为：
scrcpy --audio-dup  # 隐含 --audio-source=playback
```

但需要 Android 13 及以上版本，且 Android 应用可选择退出捕获。

详见 [#4380](https://github.com/Genymobile/scrcpy/issues/4380)。

## 编解码器

可选择音频编解码器，可选值为 `opus`（默认）、`aac`、`flac` 和 `raw`（未压缩的 PCM 16-bit LE）：

```bash
scrcpy --audio-codec=opus  # 默认
scrcpy --audio-codec=aac
scrcpy --audio-codec=flac
scrcpy --audio-codec=raw
```

如果出现以下错误：

> Failed to initialize audio/opus, error 0xfffffffe

说明设备不支持 Opus 编码器，可尝试 `scrcpy --audio-codec=aac`。

高级用法中，可通过 `--audio-codec-options` 传递自定义参数给 [`MediaFormat`]，详见手册或 `scrcpy --help`。

例如，调整 [FLAC 压缩级别]：

```bash
scrcpy --audio-codec=flac --audio-codec-options=flac-compression-level=8
```

[`MediaFormat`]: https://developer.android.com/reference/android/media/MediaFormat
[FLAC 压缩级别]: https://developer.android.com/reference/android/media/MediaFormat#KEY_FLAC_COMPRESSION_LEVEL

## 编码器

设备上可能有多个编码器可用，可通过以下命令列出：

```bash
scrcpy --list-encoders
```

选择特定编码器：

```bash
scrcpy --audio-codec=opus --audio-encoder='c2.android.opus.encoder'
```

## 比特率

默认音频比特率为 128Kbps，可通过以下命令调整：

```bash
scrcpy --audio-bit-rate=64K
scrcpy --audio-bit-rate=64000  # 等效
```

_此参数不适用于 RAW 音频编解码器（`--audio-codec=raw`）。_

## 缓冲

音频缓冲不可避免。需在低延迟（避免卡顿）和足够缓冲（减少欠载）之间平衡。

默认缓冲大小为 50ms，可调整：

```bash
scrcpy --audio-buffer=40   # 比默认值小
scrcpy --audio-buffer=100  # 比默认值大
```

注意：此选项设置的是目标缓冲值，实际缓冲可能因欠载等原因无法达到目标值。

若不与设备交互（如观看视频），可增加[视频](/zhHans/reference/scrcpy/video#buffering)和音频缓冲以平滑播放：

```
scrcpy --video-buffer=200 --audio-buffer=200
```

还可配置另一音频缓冲（音频输出缓冲），默认为 5ms。除非出现[机器人声或卡顿][#3793]，否则不建议修改：

```bash
# 仅在绝对必要时使用
scrcpy --audio-output-buffer=10
```

[#3793]: https://github.com/Genymobile/scrcpy/issues/3793