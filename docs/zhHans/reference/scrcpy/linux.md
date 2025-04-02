---
title: Linux（平台指南）
---

# Linux 平台指南

## 安装

### 官方发布版本

下载[最新版本]的静态构建包：

- [`scrcpy-linux-x86_64-v3.2.tar.gz`][direct-linux-x86_64] (x86_64)  
  <sub>SHA-256: `df6cf000447428fcde322022848d655ff0211d98688d0f17cbbf21be9c1272be`</sub>

[最新版本]: https://github.com/Genymobile/scrcpy/releases/latest  
[direct-linux-x86_64]: https://github.com/Genymobile/scrcpy/releases/download/v3.2/scrcpy-linux-x86_64-v3.2.tar.gz  

下载后解压即可。

_Linux平台的静态构建版本仍处于实验阶段。_

### 通过包管理器安装

<a href="https://repology.org/project/scrcpy/versions"><img src="https://repology.org/badge/vertical-allrepos/scrcpy.svg" alt="Packaging status" align="right"></a>

Scrcpy已被多种发行版和包管理器收录：

- Debian/Ubuntu: ~~`apt install scrcpy`~~ _(版本过旧)_  
- Arch Linux: `pacman -S scrcpy`  
- Fedora: `dnf copr enable zeno/scrcpy && dnf install scrcpy`  
- Gentoo: `emerge scrcpy`  
- Snap: `snap install scrcpy`  
- … (详见 [repology](https://repology.org/project/scrcpy/versions))  

### 使用安装脚本

如需安装`master`分支的最新版本，可按以下简化流程操作：

首先安装依赖包：

```bash
# Debian/Ubuntu系统
sudo apt install ffmpeg libsdl2-2.0-0 adb wget \
                 gcc git pkg-config meson ninja-build libsdl2-dev \
                 libavcodec-dev libavdevice-dev libavformat-dev libavutil-dev \
                 libswresample-dev libusb-1.0-0 libusb-1.0-0-dev
```

然后克隆仓库并执行安装脚本  
([脚本源码](https://cdn.jsdelivr.net/gh/Genymobile/scrcpy@master/install_release.sh))：

```bash
git clone https://github.com/Genymobile/scrcpy
cd scrcpy
./install_release.sh
```

当有新版本发布时，更新仓库并重新安装：

```bash
git pull
./install_release.sh
```

卸载方法：

```bash
sudo ninja -Cbuild-auto uninstall
```

_注意：此简化流程仅适用于正式发布版本（脚本会下载预编译的服务器二进制文件），因此无法用于测试开发分支（如`dev`分支）。_

_如需手动构建安装，请参阅[build.md](/zhHans/reference/scrcpy/build)。_

## 运行

_请确保设备满足[运行要求](/zhHans/reference/scrcpy/#prerequisites)。_

安装完成后，在终端中执行：

```bash
scrcpy
```

或带参数运行（以下示例禁用音频并录制到`file.mkv`）：

```bash
scrcpy --no-audio --record=file.mkv
```

命令行参数文档可通过以下方式查看：  
- `man scrcpy`  
- `scrcpy --help`  
- [GitHub文档](https://github.com/Genymobile/scrcpy)