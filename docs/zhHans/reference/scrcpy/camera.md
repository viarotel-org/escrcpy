---
title: Camera（相机）
---

# 相机  

支持在运行 Android 12 或更高版本的设备上使用相机镜像功能。  

若要捕获相机画面而非设备屏幕，请运行以下命令：  

```  
scrcpy --video-source=camera  
```  

默认情况下，该命令会自动将[音频源](/zhHans/reference/scrcpy/audio#source)切换为麦克风（相当于同时传递了 `--audio-source=mic` 参数）。  

```bash  
scrcpy --video-source=display  # 默认音频源为输出（output）  
scrcpy --video-source=camera   # 默认音频源为麦克风（mic）  
scrcpy --video-source=display --audio-source=mic    # 强制显示画面并使用麦克风  
scrcpy --video-source=camera --audio-source=output  # 强制使用相机画面并捕获设备音频输出  
```  

可以禁用音频：  

```bash  
# 完全不捕获音频  
scrcpy --video-source=camera --no-audio  
scrcpy --video-source=camera --no-audio --record=file.mp4  

# 捕获并录制音频，但不播放  
scrcpy --video-source=camera --no-audio-playback --record=file.mp4  
```  

## 列表  

列出可用的相机（包括其声明的有效尺寸和帧率）：  

```  
scrcpy --list-cameras  
scrcpy --list-camera-sizes  
```  

_请注意，尺寸和帧率是声明性的。并非所有设备都能准确支持：有些设备声明的参数实际上不支持，而有些未声明的参数却可能支持。_  

## 选择  

可以通过传递明确的相机 ID（通过 `--list-cameras` 列出）来选择相机：  

```  
scrcpy --video-source=camera --camera-id=0  
```  

或者，可以自动选择相机：  

```bash  
scrcpy --video-source=camera                           # 使用第一个相机  
scrcpy --video-source=camera --camera-facing=front     # 使用第一个前置相机  
scrcpy --video-source=camera --camera-facing=back      # 使用第一个后置相机  
scrcpy --video-source=camera --camera-facing=external  # 使用第一个外接相机  
```  

如果指定了 `--camera-id`，则禁止使用 `--camera-facing`（因为 ID 已经确定了相机）：  

```bash  
scrcpy --video-source=camera --camera-id=0 --camera-facing=front  # 错误  
```  

### 尺寸选择  

可以传递明确的相机尺寸：  

```  
scrcpy --video-source=camera --camera-size=1920x1080  
```  

给定的尺寸可以是声明的有效尺寸之一（通过 `--list-camera-sizes` 列出），也可以是其他任意尺寸（某些设备支持任意尺寸）：  

```  
scrcpy --video-source=camera --camera-size=1840x444  
```  

或者，可以自动选择一个声明的有效尺寸（通过 `list-camera-sizes` 列出）。  

支持两种约束条件：  
 - `-m`/`--max-size`（已用于显示镜像），例如 `-m1920`；  
 - `--camera-ar` 用于指定宽高比（格式为 `<num>:<den>`、`<value>` 或 `sensor`）。  

示例：  

```bash  
scrcpy --video-source=camera                          # 使用最大宽度及其关联的最大高度  
scrcpy --video-source=camera -m1920                   # 使用不超过 1920 的最大宽度及其关联的最大高度  
scrcpy --video-source=camera --camera-ar=4:3          # 使用宽高比为 4:3（误差 +/- 10%）的最大尺寸  
scrcpy --video-source=camera --camera-ar=1.6          # 使用宽高比为 1.6（误差 +/- 10%）的最大尺寸  
scrcpy --video-source=camera --camera-ar=sensor       # 使用与相机传感器宽高比（误差 +/- 10%）匹配的最大尺寸  
scrcpy --video-source=camera -m1920 --camera-ar=16:9  # 使用不超过 1920 的最大宽度，并最接近 16:9 的宽高比  
```  

如果指定了 `--camera-size`，则禁止使用 `-m`/`--max-size` 和 `--camera-ar`（尺寸已由显式给定的值确定）：  

```bash  
scrcpy --video-source=camera --camera-size=1920x1080 -m3000  # 错误  
```  

## 旋转  

若要旋转捕获的视频，请使用[视频方向](/zhHans/reference/scrcpy/video#orientation)选项：  

```  
scrcpy --video-source=camera --camera-size=1920x1080 --orientation=90  
```  

## 帧率  

默认情况下，相机以 Android 的默认帧率（30 fps）捕获。  

若要配置不同的帧率：  

```  
scrcpy --video-source=camera --camera-fps=60  
```  

## 高速捕获  

Android 相机 API 还支持[高速捕获模式][high speed]。  

此模式仅限于特定的分辨率和帧率，通过 `--list-camera-sizes` 列出。  

```  
scrcpy --video-source=camera --camera-size=1920x1080 --camera-fps=240  
```  

[high speed]: https://developer.android.com/reference/android/hardware/camera2/CameraConstrainedHighSpeedCaptureSession  

## 花括号扩展技巧  

所有相机选项均以 `--camera-` 开头，因此如果您的 shell 支持，可以利用[花括号扩展][brace expansion]（例如，bash 和 zsh 支持）：  

```bash  
scrcpy --video-source=camera --camera-{facing=back,ar=16:9,high-speed,fps=120}  
```  

这将扩展为：  

```bash  
scrcpy --video-source=camera --camera-facing=back --camera-ar=16:9 --camera-high-speed --camera-fps=120  
```  

[brace expansion]: https://www.gnu.org/software/bash/manual/html_node/Brace-Expansion.html  

## 网络摄像头  

在 Linux 上结合 [V4L2](/zhHans/reference/scrcpy/v4l2) 功能，可以将 Android 设备相机用作计算机上的网络摄像头。  