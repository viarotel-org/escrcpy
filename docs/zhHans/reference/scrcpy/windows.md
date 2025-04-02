---
title: Windows（平台指南）
---

# Windows 平台指南

## 安装

### 官方发布版本

下载[最新版本]：
- [`scrcpy-win64-v3.2.zip`][direct-win64] (64位)  
  <sub>SHA-256: `eaa27133e0520979873ba57ad651560a4cc2618373bd05450b23a84d32beafd0`</sub>
- [`scrcpy-win32-v3.2.zip`][direct-win32] (32位)  
  <sub>SHA-256: `4a3407d7f0c2c8a03e22a12cf0b5e1e585a5056fe23c8e5cf3252207c6fa8357`</sub>

[最新版本]: https://github.com/Genymobile/scrcpy/releases/latest
[direct-win64]: https://github.com/Genymobile/scrcpy/releases/download/v3.2/scrcpy-win64-v3.2.zip
[direct-win32]: https://github.com/Genymobile/scrcpy/releases/download/v3.2/scrcpy-win32-v3.2.zip

下载后解压即可。

### 通过包管理器安装

使用 [WinGet]（将同时安装ADB和其他依赖项）：
```bash
winget install --exact Genymobile.scrcpy
```

使用 [Chocolatey]：
```bash
choco install scrcpy
choco install adb    # 如果尚未安装ADB
```

使用 [Scoop]：
```bash
scoop install scrcpy
scoop install adb    # 如果尚未安装ADB
```

[WinGet]: https://github.com/microsoft/winget-cli
[Chocolatey]: https://chocolatey.org/
[Scoop]: https://scoop.sh

_如需手动构建和安装应用，请参阅 [build](/zhHans/reference/scrcpy/build)。_

## 运行

_请确保您的设备满足[先决条件](/zhHans/reference/scrcpy/#prerequisites)。_

Scrcpy是一个命令行应用程序，主要设计为通过终端带参数执行。

在scrcpy目录中双击`open_a_terminal_here.bat`文件，即可在指定位置打开终端，然后输入命令。例如，不带参数运行：
```bash
scrcpy
```

或带参数运行（以下示例禁用音频并录制到`file.mkv`）：
```bash
scrcpy --no-audio --record=file.mkv
```

命令行参数的文档可通过以下方式查看：
- `scrcpy --help`
- [github](/zhHans/reference/scrcpy/)

若需直接启动scrcpy而无需打开终端，可双击以下文件之一：
- `scrcpy-console.bat`：启动时打开终端（scrcpy终止后终端会关闭，除非发生错误）；
- `scrcpy-noconsole.vbs`：启动时不显示终端（但错误信息将不可见）。

_避免直接双击`scrcpy.exe`文件：若发生错误，终端会立即关闭，您将无法查看错误信息（该程序设计为通过终端运行）。请使用`scrcpy-console.bat`替代。_

如果希望固定使用某些参数，可以创建一个`myscrcpy.bat`文件（需先[显示文件扩展名]以避免混淆），内容为您的命令。例如：
```bash
scrcpy --prefer-text --turn-screen-off --stay-awake
```

[显示文件扩展名]: https://www.howtogeek.com/205086/beginner-how-to-make-windows-show-file-extensions/

之后双击该文件即可运行。您也可以编辑（或复制）`scrcpy-console.bat`或`scrcpy-noconsole.vbs`文件，添加所需的参数。