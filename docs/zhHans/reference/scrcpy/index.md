---
title: Scrcpy
---

> [!IMPORTANT]
> Escrcpy基于以下开源项目构建。相关内容仅供参考，将定期更新。

# scrcpy (v3.2)

<img src="https://cdn.jsdelivr.net/gh/Genymobile/scrcpy@master/app/data/icon.svg" width="128" height="128" alt="scrcpy" align="right" />

_发音为 "**scr**een **c**o**py**"_

此应用通过USB或[TCP/IP](/zhHans/reference/scrcpy/connection#tcpip-wireless)连接镜像Android设备（视频和音频），并支持使用计算机的键盘和鼠标进行控制。它不需要_root_权限，也无需在设备上安装应用。支持_Linux_、_Windows_和_macOS_。

![截图](https://cdn.jsdelivr.net/gh/Genymobile/scrcpy@master/assets/screenshot-debian-600.jpg)

其特点包括：

 - **轻量**：原生实现，仅显示设备屏幕
 - **高性能**：30~120fps，具体取决于设备
 - **高质量**：1920×1080或更高分辨率
 - **低延迟**：[35~70毫秒][lowlatency]
 - **快速启动**：约1秒显示首帧画面
 - **无侵入性**：不会在Android设备上留下任何痕迹
 - **用户友好**：无需账户、无广告、无需联网
 - **自由**：免费开源软件

[lowlatency]: https://github.com/Genymobile/scrcpy/pull/646

功能亮点：
 - [音频转发](/zhHans/reference/scrcpy/audio)（Android 11+）
 - [录制](/zhHans/reference/scrcpy/recording)
 - [虚拟显示](/zhHans/reference/scrcpy/virtual_display)
 - [设备屏幕关闭时镜像](/zhHans/reference/scrcpy/device#turn-screen-off)
 - 双向[复制粘贴](/zhHans/reference/scrcpy/control#copy-paste)
 - [可配置画质](/zhHans/reference/scrcpy/video)
 - [摄像头镜像](/zhHans/reference/scrcpy/camera)（Android 12+）
 - [作为网络摄像头镜像（V4L2）](/zhHans/reference/scrcpy/v4l2)（仅限Linux）
 - 物理[键盘][hid-keyboard]和[鼠标][hid-mouse]模拟（HID）
 - [手柄](/zhHans/reference/scrcpy/gamepad)支持
 - [OTG模式](/zhHans/reference/scrcpy/otg)
 - 更多功能…

[hid-keyboard]: /zhHans/reference/scrcpy/keyboard#physical-keyboard-simulation
[hid-mouse]: /zhHans/reference/scrcpy/mouse#physical-mouse-simulation

## 前提条件

Android设备需至少支持API 21（Android 5.0）。

[音频转发](/zhHans/reference/scrcpy/audio)需API >= 30（Android 11+）。

确保已在设备上[启用USB调试][enable-adb]。

[enable-adb]: https://developer.android.com/studio/debug/dev-options#enable

在某些设备（尤其是小米）上，可能会遇到以下错误：

```
java.lang.SecurityException: Injecting input events requires the caller (or the source of the instrumentation, if any) to have the INJECT_EVENTS permission.
```

此时，需启用额外选项[control] `USB调试（安全设置）`（与`USB调试`不同），才能使用键盘和鼠标控制设备。启用后需重启设备。

[control]: https://github.com/Genymobile/scrcpy/issues/70#issuecomment-373286323

注意：[OTG模式](/zhHans/reference/scrcpy/otg)下无需开启USB调试。


## 获取应用

 - [Linux](/zhHans/reference/scrcpy/linux)
 - [Windows](/zhHans/reference/scrcpy/windows)（阅读[运行方法](/zhHans/reference/scrcpy/windows#run)）
 - [macOS](/zhHans/reference/scrcpy/macos)


## 必知技巧

 - [降低分辨率](/zhHans/reference/scrcpy/video#size)可显著提升性能（如`scrcpy -m1024`）
 - [_右键点击_](/zhHans/reference/scrcpy/mouse#mouse-bindings)触发`返回`
 - [_中键点击_](/zhHans/reference/scrcpy/mouse#mouse-bindings)触发`主页`
 - <kbd>Alt</kbd>+<kbd>f</kbd>切换[全屏](/zhHans/reference/scrcpy/window#fullscreen)
 - 更多[快捷键](/zhHans/reference/scrcpy/shortcuts)


## 使用示例

提供多种选项，详见[文档](#用户文档)。以下为常用示例：

 - 以H.265格式捕获屏幕（更高画质），限制分辨率为1920，帧率60fps，禁用音频，并通过模拟物理键盘控制设备：

    ```bash
    scrcpy --video-codec=h265 --max-size=1920 --max-fps=60 --no-audio --keyboard=uhid
    scrcpy --video-codec=h265 -m1920 --max-fps=60 --no-audio -K  # 简写版本
    ```

 - 在新虚拟显示中启动VLC（与设备显示分离）：

    ```bash
    scrcpy --new-display=1920x1080 --start-app=org.videolan.vlc
    ```

 - 以H.265格式录制设备摄像头（及麦克风）到MP4文件，分辨率1920x1080：

    ```bash
    scrcpy --video-source=camera --video-codec=h265 --camera-size=1920x1080 --record=file.mp4
    ```

 - 捕获设备前置摄像头并作为网络摄像头暴露给计算机（仅限Linux）：

    ```bash
    scrcpy --video-source=camera --camera-size=1920x1080 --camera-facing=front --v4l2-sink=/dev/video2 --no-playback
    ```

 - 通过模拟物理键盘和鼠标控制设备，无需镜像（无需USB调试）：

    ```bash
    scrcpy --otg
    ```

 - 使用连接到计算机的手柄控制设备：

    ```bash
    scrcpy --gamepad=uhid
    scrcpy -G  # 简写版本
    ```

## 用户文档

应用提供丰富的功能和配置选项，详见以下页面：

 - [连接](/zhHans/reference/scrcpy/connection)
 - [视频](/zhHans/reference/scrcpy/video)
 - [音频](/zhHans/reference/scrcpy/audio)
 - [控制](/zhHans/reference/scrcpy/control)
 - [键盘](/zhHans/reference/scrcpy/keyboard)
 - [鼠标](/zhHans/reference/scrcpy/mouse)
 - [手柄](/zhHans/reference/scrcpy/gamepad)
 - [设备](/zhHans/reference/scrcpy/device)
 - [窗口](/zhHans/reference/scrcpy/window)
 - [录制](/zhHans/reference/scrcpy/recording)
 - [虚拟显示](/zhHans/reference/scrcpy/virtual_display)
 - [隧道](/zhHans/reference/scrcpy/tunnels)
 - [OTG](/zhHans/reference/scrcpy/otg)
 - [摄像头](/zhHans/reference/scrcpy/camera)
 - [Video4Linux](/zhHans/reference/scrcpy/v4l2)
 - [快捷键](/zhHans/reference/scrcpy/shortcuts)


## 资源

 - [常见问题](/help/)
 - [翻译][wiki]（可能未及时更新）
 - [构建指南](/zhHans/reference/scrcpy/build)
 - [开发者](/zhHans/reference/scrcpy/develop)

[wiki]: https://github.com/Genymobile/scrcpy/wiki


## 相关文章

- [Scrcpy简介][article-intro]
- [Scrcpy现已支持无线连接][article-tcpip]
- [Scrcpy 2.0，支持音频][article-scrcpy2]

[article-intro]: https://blog.rom1v.com/2018/03/introducing-scrcpy/
[article-tcpip]: https://www.genymotion.com/blog/open-source-project-scrcpy-now-works-wirelessly/
[article-scrcpy2]: https://blog.rom1v.com/2023/03/scrcpy-2-0-with-audio/

## 联系方式

可通过[issue]提交错误报告、功能请求或一般问题。

提交错误报告前，请先阅读[常见问题](/help/scrcpy)，可能已包含解决方案。

[issue]: https://github.com/Genymobile/scrcpy/issues

其他渠道：

 - Reddit: [`r/scrcpy`](https://www.reddit.com/r/scrcpy)
 - BlueSky: [`@scrcpy.bsky.social`](https://bsky.app/profile/scrcpy.bsky.social)
 - Twitter: [`@scrcpy_app`](https://twitter.com/scrcpy_app)

## 捐赠

我是[@rom1v](https://github.com/rom1v)，Scrcpy的作者和维护者。

如果您喜欢此应用，可以[支持我的开源工作][donate]：
 - [GitHub赞助](https://github.com/sponsors/rom1v)
 - [Liberapay](https://liberapay.com/rom1v/)
 - [PayPal](https://paypal.me/rom2v)

[donate]: https://blog.rom1v.com/about/#support-my-open-source-work

## 许可证

```
版权所有 (C) 2018 Genymobile
版权所有 (C) 2018-2025 Romain Vimont

根据Apache许可证2.0版（"许可证"）授权；
除非符合许可证要求，否则不得使用此文件。
您可以在以下网址获取许可证副本：

    http://www.apache.org/licenses/LICENSE-2.0

除非适用法律要求或书面同意，按"原样"分发，
无任何明示或暗示的保证或条件。
详见许可证中特定语言规定的权限和限制。
```