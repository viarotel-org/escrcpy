---
title: MacOS（平台指南）
---

# 在 macOS 上使用 scrcpy

## 安装

### 从官方发布版本安装

下载[最新版本]的静态构建包：

- [`scrcpy-macos-aarch64-v3.2.tar.gz`][direct-macos-aarch64] (aarch64 架构)  
  <sub>SHA-256: `f6d1f3c5f74d4d46f5080baa5b56b69f5edbf698d47e0cf4e2a1fd5058f9507b`</sub>

- [`scrcpy-macos-x86_64-v3.2.tar.gz`][direct-macos-x86_64] (x86_64 架构)  
  <sub>SHA-256: `e337d5cf0ba4e1281699c338ce5f104aee96eb7b2893dc851399b6643eb4044e`</sub>

[最新版本]: https://github.com/Genymobile/scrcpy/releases/latest
[direct-macos-aarch64]: https://github.com/Genymobile/scrcpy/releases/download/v3.2/scrcpy-macos-aarch64-v3.2.tar.gz
[direct-macos-x86_64]: https://github.com/Genymobile/scrcpy/releases/download/v3.2/scrcpy-macos-x86_64-v3.2.tar.gz

下载完成后解压即可。

_注意：macOS 版的 scrcpy 静态构建包仍处于实验阶段。_

### 通过包管理器安装

Scrcpy 可通过 [Homebrew] 安装：

```bash
brew install scrcpy
```

[Homebrew]: https://brew.sh/

你需要确保 `adb` 工具已在 `PATH` 环境变量中。如果尚未安装：

```bash
brew install --cask android-platform-tools
```

此外，Scrcpy 也可通过 [MacPorts] 安装，该工具会自动配置 `adb`：

```bash
sudo port install scrcpy
```

[MacPorts]: https://www.macports.org/

_如需手动构建和安装，请参阅 [build](/zhHans/reference/scrcpy/build)。_

## 运行

_请确保你的设备满足[使用前提](/zhHans/reference/scrcpy/#prerequisites)。_

安装完成后，在终端中运行：

```bash
scrcpy
```

或带参数运行（以下示例为禁用音频并录制到 `file.mkv`）：

```bash
scrcpy --no-audio --record=file.mkv
```

命令行参数的文档可通过以下方式查看：
- `man scrcpy`
- `scrcpy --help`
- [GitHub 上的文档](/zhHans/reference/scrcpy/)