---
title: Tunnels（隧道连接）
---

# 隧道连接

Scrcpy 主要用于镜像本地安卓设备。通过隧道技术，可以实现远程设备连接（例如通过互联网）。

要连接远程设备，可以让本地 `adb` 客户端连接到远程 `adb` 服务器（需确保双方使用相同版本的 _adb_ 协议）。

## 远程 ADB 服务器

要连接到远程 _adb 服务器_，需将服务器设置为监听所有网络接口：

```bash
adb kill-server
adb -a nodaemon server start
# 保持此窗口开启
```

**警告：客户端与 _adb 服务器_ 之间的所有通信均为明文传输。**

假设该服务器可通过 IP 地址 192.168.1.2 访问，则在另一终端中运行 `scrcpy`：

```bash
# bash 环境
export ADB_SERVER_SOCKET=tcp:192.168.1.2:5037
scrcpy --tunnel-host=192.168.1.2
```

```cmd
:: cmd 环境
set ADB_SERVER_SOCKET=tcp:192.168.1.2:5037
scrcpy --tunnel-host=192.168.1.2
```

```powershell
# PowerShell 环境
$env:ADB_SERVER_SOCKET = 'tcp:192.168.1.2:5037'
scrcpy --tunnel-host=192.168.1.2
```

默认情况下，`scrcpy` 使用 `adb forward` 隧道建立的本地端口（通常为 `27183`，参见 `--port` 参数）。也可强制指定其他隧道端口（在涉及多重转发的复杂场景中可能有用）：

```
scrcpy --tunnel-port=1234
```

## SSH 隧道

为实现安全的远程 _adb 服务器_ 通信，推荐使用 SSH 隧道。

首先确保远程计算机已启动 _adb 服务器_：

```bash
adb start-server
```

随后建立 SSH 隧道：

```bash
# 本地 5038 端口 --> 远程 5037 端口
# 本地 27183 端口 <-- 远程 27183 端口
ssh -CN -L5038:localhost:5037 -R27183:localhost:27183 远程计算机地址
# 保持此窗口开启
```

在另一终端中运行 `scrcpy`：

```bash
# bash 环境
export ADB_SERVER_SOCKET=tcp:localhost:5038
scrcpy
```

```cmd
:: cmd 环境
set ADB_SERVER_SOCKET=tcp:localhost:5038
scrcpy
```

```powershell
# PowerShell 环境
$env:ADB_SERVER_SOCKET = 'tcp:localhost:5038'
scrcpy
```

若需避免启用远程端口转发，可强制使用正向连接（注意将 `-R` 替换为 `-L`）：

```bash
# 本地 5038 端口 --> 远程 5037 端口
# 本地 27183 端口 --> 远程 27183 端口
ssh -CN -L5038:localhost:5037 -L27183:localhost:27183 远程计算机地址
# 保持此窗口开启
```

在另一终端中运行 `scrcpy`：

```bash
# bash 环境
export ADB_SERVER_SOCKET=tcp:localhost:5038
scrcpy --force-adb-forward
```

```cmd
:: cmd 环境
set ADB_SERVER_SOCKET=tcp:localhost:5038
scrcpy --force-adb-forward
```

```powershell
# PowerShell 环境
$env:ADB_SERVER_SOCKET = 'tcp:localhost:5038'
scrcpy --force-adb-forward
```