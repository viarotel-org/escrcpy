# Scrcpy

以下是常见问题及其状态报告。  
遇到任何错误时，请首先升级至最新版本。

## `adb` 与 USB 问题

`scrcpy` 通过执行 `adb` 命令初始化设备连接。若 `adb` 失败，则 scrcpy 无法工作。  
这通常并非 _scrcpy_ 的 bug，而是环境配置问题。

### `adb` 未找到

需确保 `adb` 位于 `PATH` 环境变量中。  
Windows 版本已默认包含 `adb.exe` 且当前目录在 `PATH` 中，因此开箱即用。

### 设备未检测到

>     ERROR: 未找到任何 ADB 设备

请确认已正确启用 [adb 调试][enable-adb]。  
通过以下命令检查设备是否被识别：

```
adb devices
```

若设备未列出，可能需要安装[驱动][drivers]（Windows 系统）。Google 设备需单独安装 [USB 驱动][google-usb-driver]。

[enable-adb]: https://developer.android.com/studio/command-line/adb.html#Enabling  
[drivers]: https://developer.android.com/studio/run/oem-usb.html  
[google-usb-driver]: https://developer.android.com/studio/run/win-usb  

### 设备未授权

>     ERROR: 设备未授权:  
>     ERROR:     -->   (usb)  0123456789abcdef          unauthorized  
>     ERROR: 设备端应弹出授权请求窗口  

连接时设备端会弹出 USB 调试授权请求，需手动允许。  
若未弹出，请参考 [stackoverflow][device-unauthorized] 解决方案。

[device-unauthorized]: https://stackoverflow.com/questions/23081263/adb-android-device-unauthorized  

### 多设备连接冲突

若同时连接多个设备，将出现以下错误：

>     ERROR: 检测到多个 (2) ADB 设备:  
>     ERROR:     -->   (usb)  0123456789abcdef                device  Nexus_5  
>     ERROR:     --> (tcpip)  192.168.1.5:5555                device  GM1913  
>     ERROR: 请通过 -s (--serial)、-d (--select-usb) 或 -e (--select-tcpip) 选择设备  

可通过序列号指定设备：

```bash
scrcpy -s 0123456789abcdef
```

或选择单一 USB/TCP/IP 设备：

```bash
scrcpy -d  # USB 设备  
scrcpy -e  # TCP/IP 设备  
```

注意：TCP/IP 连接时可能收到如下提示（旧版 Android 的已知问题，见 [#5]）：

>     adb: error: 检测到多个设备/模拟器  
>     ERROR: "adb reverse" 返回值 1  
>     WARN: 'adb reverse' 失败，回退至 'adb forward'  

此情况下 scrcpy 会自动切换备用方案，通常可正常使用。

[#5]: https://github.com/Genymobile/scrcpy/issues/5  

### adb 版本冲突

>     adb 服务端版本 (41) 与客户端 (39) 不匹配；正在终止...

此错误表明系统同时运行了多个 `adb` 版本。需统一所有程序使用的 `adb` 版本。  
解决方案：  
- 覆盖其他程序的 `adb` 二进制文件  
- 或通过环境变量指定 `adb` 路径：

```bash
# bash
export ADB=/path/to/your/adb
scrcpy
```

```cmd
:: cmd
set ADB=C:\path\to\your\adb.exe
scrcpy
```

```powershell
# PowerShell
$env:ADB = 'C:\path\to\your\adb.exe'
scrcpy
```

### 设备断开连接

若 scrcpy 自动退出并提示 "Device disconnected"，表明 `adb` 连接已中断。  
尝试更换 USB 线缆或接口。详见 [#281] 和 [#283]。

[#281]: https://github.com/Genymobile/scrcpy/issues/281  
[#283]: https://github.com/Genymobile/scrcpy/issues/283  

## Windows OTG 问题

在 Windows 上执行 `scrcpy --otg`（或 `--keyboard=aoa`/`--mouse=aoa`）时若出现：

>     ERROR: 未找到任何 USB 设备

（或仅检测到无关 USB 设备），可能是驱动问题。  
请阅读 [#3654]，特别是 [此评论][#3654-comment1] 和 [后续说明][#3654-comment2]。

[#3654]: https://github.com/Genymobile/scrcpy/issues/3654  
[#3654-comment1]: https://github.com/Genymobile/scrcpy/issues/3654#issuecomment-1369278232  
[#3654-comment2]: https://github.com/Genymobile/scrcpy/issues/3654#issuecomment-1369295011  

## 控制问题

### 鼠标键盘失效

部分设备需启用以下选项：  
开发者选项 → **USB 调试（安全设置）**  
_允许通过 USB 调试授予权限和模拟输入_  
启用后需重启设备。详见 [#70]。

[#70]: https://github.com/Genymobile/scrcpy/issues/70#issuecomment-373286323  

### 特殊字符输入异常

默认文本注入仅支持 [ASCII 字符][text-input]。  
可通过技巧输入部分 [带重音字符][accented-characters]，但功能有限（参见 [#37]）。  
解决方案：切换为 [物理键盘模拟模式][hid]。

[text-input]: https://github.com/Genymobile/scrcpy/issues?q=is%3Aopen+is%3Aissue+label%3Aunicode  
[accented-characters]: https://blog.rom1v.com/2018/03/introducing-scrcpy/#handle-accented-characters  
[#37]: https://github.com/Genymobile/scrcpy/issues/37  
[hid]: /reference/scrcpy/keyboard#physical-keyboard-simulation  

## 客户端问题

### Wayland 兼容性问题

Linux 默认使用 x11，可通过环境变量切换 [视频驱动][video driver]：

```bash
export SDL_VIDEODRIVER=wayland
scrcpy
```

部分发行版（如 Fedora）需手动安装 `libdecor` 包。  
详见 [#2554] 和 [#2559]。

[video driver]: https://wiki.libsdl.org/FAQUsingSDL#how_do_i_choose_a_specific_video_driver  
[#2554]: https://github.com/Genymobile/scrcpy/issues/2554  
[#2559]: https://github.com/Genymobile/scrcpy/issues/2559  

### KWin 合成器崩溃

Plasma 桌面环境下运行 _scrcpy_ 时会禁用合成器。  
临时解决方案：[关闭 "阻止合成"][kwin] 选项。

[kwin]: https://github.com/Genymobile/scrcpy/issues/114#issuecomment-378778613  

## 崩溃问题

### MediaCodec 异常

若出现以下异常：

```
ERROR: 线程 Thread[main,5,main] 抛出异常  
java.lang.IllegalStateException  
        at android.media.MediaCodec.native_dequeueOutputBuffer(Native Method)  
```

请尝试更换 [编码器](/reference/scrcpy/video#encoder)。  