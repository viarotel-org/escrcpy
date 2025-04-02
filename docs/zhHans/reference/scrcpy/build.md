---
title: Build（编译）
---


# 编译 scrcpy

以下是编译 _scrcpy_（客户端和服务器）的说明。

如果只需构建并安装最新版本，请按照 [linux.md](/zhHans/reference/scrcpy/linux) 中的简化流程操作。

## 分支

项目有两个主要分支：
 - `master`：包含最新发布版本。这是 GitHub 上的项目主页。
 - `dev`：当前开发分支。所有提交到 `dev` 的代码将包含在下一个版本中。

如需贡献代码，请基于最新的 `dev` 分支提交。

## 要求

需要 [adb]。可从 [Android SDK 平台工具][platform-tools] 获取，或通过系统包管理器安装（如 `adb`）。

在 Windows 上，下载 [platform-tools][platform-tools-windows] 并将以下文件解压到 `PATH` 可访问的目录：
 - `adb.exe`
 - `AdbWinApi.dll`
 - `AdbWinUsbApi.dll`

scrcpy 的发布版本中也包含这些文件。

客户端需要 [FFmpeg] 和 [LibSDL2]。请按照说明安装。

[adb]: https://developer.android.com/studio/command-line/adb.html
[platform-tools]: https://developer.android.com/studio/releases/platform-tools.html
[platform-tools-windows]: https://dl.google.com/android/repository/platform-tools-latest-windows.zip
[ffmpeg]: https://en.wikipedia.org/wiki/FFmpeg
[LibSDL2]: https://en.wikipedia.org/wiki/Simple_DirectMedia_Layer

## 系统特定步骤

### Linux

通过包管理器安装所需依赖。

#### Debian/Ubuntu

```bash
# 运行时依赖
sudo apt install ffmpeg libsdl2-2.0-0 adb libusb-1.0-0

# 客户端构建依赖
sudo apt install gcc git pkg-config meson ninja-build libsdl2-dev \
                 libavcodec-dev libavdevice-dev libavformat-dev libavutil-dev \
                 libswresample-dev libusb-1.0-0-dev

# 服务器构建依赖
sudo apt install openjdk-17-jdk
```

在旧版本（如 Ubuntu 16.04）中，`meson` 可能过旧。此时可通过 `pip3` 安装：

```bash
sudo apt install python3-pip
pip3 install meson
```

#### Fedora

```bash
# 启用 RPM Fusion Free
sudo dnf install https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm

# 客户端构建依赖
sudo dnf install SDL2-devel ffms2-devel libusb1-devel libavdevice-free-devel meson gcc make

# 服务器构建依赖
sudo dnf install java-devel
```

### Windows

#### 从 Linux 交叉编译

这是推荐的方法（也是发布版本的构建方式）。

在 _Debian_ 中安装 _mingw_：

```bash
sudo apt install mingw-w64 mingw-w64-tools libz-mingw-w64-dev
```

还需安装 JDK 以构建服务器：

```bash
sudo apt install openjdk-17-jdk
```

然后生成发布版本：

```bash
./release.sh
```

生成的 win32 和 win64 版本将位于 `dist/` 目录。

#### 在 MSYS2 中构建

在 Windows 上，需要 [MSYS2] 来构建项目。在 MSYS2 终端中安装所需依赖：

[MSYS2]: http://www.msys2.org/

```bash
# 运行时依赖
pacman -S mingw-w64-x86_64-SDL2 \
          mingw-w64-x86_64-ffmpeg \
          mingw-w64-x86_64-libusb

# 客户端构建依赖
pacman -S mingw-w64-x86_64-make \
          mingw-w64-x86_64-gcc \
          mingw-w64-x86_64-pkg-config \
          mingw-w64-x86_64-meson
```

对于 32 位版本，将 `x86_64` 替换为 `i686`：

```bash
# 运行时依赖
pacman -S mingw-w64-i686-SDL2 \
          mingw-w64-i686-ffmpeg \
          mingw-w64-i686-libusb

# 客户端构建依赖
pacman -S mingw-w64-i686-make \
          mingw-w64-i686-gcc \
          mingw-w64-i686-pkg-config \
          mingw-w64-i686-meson
```

MSYS2 中没有 Java（>= 7），如需构建服务器，请手动安装并将其添加到 `PATH`：

```bash
export PATH="$JAVA_HOME/bin:$PATH"
```

### Mac OS

使用 [Homebrew] 安装依赖：

[Homebrew]: https://brew.sh/

```bash
# 运行时依赖
brew install sdl2 ffmpeg libusb

# 客户端构建依赖
brew install pkg-config meson
```

如需构建服务器，还需从 Caskroom 安装 Java 17 并添加到 `PATH`：

```bash
brew tap homebrew/cask-versions
brew install adoptopenjdk/openjdk/adoptopenjdk17
export JAVA_HOME="$(/usr/libexec/java_home --version 1.17)"
export PATH="$JAVA_HOME/bin:$PATH"
```

### Docker

参考 [pierlon/scrcpy-docker](https://github.com/pierlon/scrcpy-docker)。

## 通用步骤

**以非 root 用户**克隆项目：

```bash
git clone https://github.com/Genymobile/scrcpy
cd scrcpy
```

### 构建

如果只需构建客户端（服务器二进制文件将被推送到 Android 设备，不依赖于系统架构），可以使用 [预构建服务器]（此时无需 Java 或 Android SDK）。

[预构建服务器]: #选项-2-使用预构建服务器

#### 选项 1：从源码构建所有内容

安装 [Android SDK]（_Android Studio_），并设置 `ANDROID_SDK_ROOT` 环境变量。例如：

[Android SDK]: https://developer.android.com/studio/index.html

```bash
# Linux
export ANDROID_SDK_ROOT=~/Android/Sdk
# Mac
export ANDROID_SDK_ROOT=~/Library/Android/sdk
# Windows
set ANDROID_SDK_ROOT=%LOCALAPPDATA%\Android\sdk
```

然后构建：

```bash
meson setup x --buildtype=release --strip -Db_lto=true
ninja -Cx  # 不要以 root 用户运行
```

_注意：`ninja` [必须][ninja-user] 以非 root 用户运行（只有 `ninja install` 需要 root 权限）。_

[ninja-user]: https://github.com/Genymobile/scrcpy/commit/4c49b27e9f6be02b8e63b508b60535426bd0291a

#### 选项 2：使用预构建服务器

 - [`scrcpy-server-v3.2`][direct-scrcpy-server]  
   <sub>SHA-256: `b920e0ea01936bf2482f4ba2fa985c22c13c621999e3d33b45baa5acfc1ea3d0`</sub>

[direct-scrcpy-server]: https://github.com/Genymobile/scrcpy/releases/download/v3.2/scrcpy-server-v3.2

下载预构建服务器，并在 Meson 配置中指定路径：

```bash
meson setup x --buildtype=release --strip -Db_lto=true \
    -Dprebuilt_server=/path/to/scrcpy-server
ninja -Cx  # 不要以 root 用户运行
```

服务器仅与匹配的客户端版本兼容（此服务器适用于 `master` 分支）。

### 不安装直接运行

```bash
./run x [options]
```

### 安装

构建成功后，可以安装 _scrcpy_ 到系统：

```bash
sudo ninja -Cx install    # Windows 上无需 sudo
```

安装的文件包括：
 - `/usr/local/bin/scrcpy`（主程序）
 - `/usr/local/share/scrcpy/scrcpy-server`（推送到设备的服务器）
 - `/usr/local/share/man/man1/scrcpy.1`（手册页）
 - `/usr/local/share/icons/hicolor/256x256/apps/icon.png`（应用图标）
 - `/usr/local/share/zsh/site-functions/_scrcpy`（zsh 补全）
 - `/usr/local/share/bash-completion/completions/scrcpy`（bash 补全）

之后可直接运行 `scrcpy`。

### 卸载

```bash
sudo ninja -Cx uninstall  # Windows 上无需 sudo
```