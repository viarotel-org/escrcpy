---
title: API（接口文档）
---

# Gnirehtet API

`gnirehtet` 是一款用于在安卓设备上实现反向网络共享的工具，允许设备通过USB共享电脑的网络连接。以下是各命令的详细用法及示例。

## gnirehtet install [serial]

**描述**：在指定的安卓设备上安装客户端并退出。若连接了多个设备，必须提供 `serial` 参数。

**示例用法**：
```bash
gnirehtet install
```
若连接了多个设备，指定设备序列号：
```bash
gnirehtet install 1234567890ABCDEF
```

## gnirehtet uninstall [serial]

**描述**：从指定的安卓设备上卸载客户端并退出。若连接了多个设备，必须提供 `serial` 参数。

**示例用法**：
```bash
gnirehtet uninstall
```
若连接了多个设备，指定设备序列号：
```bash
gnirehtet uninstall 1234567890ABCDEF
```

## gnirehtet reinstall [serial]

**描述**：先卸载再安装客户端。

**示例用法**：
```bash
gnirehtet reinstall
```
若连接了多个设备，指定设备序列号：
```bash
gnirehtet reinstall 1234567890ABCDEF
```

## gnirehtet run [serial] [-d DNS[,DNS2,...]] [-p PORT] [-r ROUTE[,ROUTE2,...]]

**描述**：为单一设备启用反向网络共享：
- 必要时安装客户端。
- 启动客户端。
- 启动中继服务器。
- 按下 Ctrl+C 时，停止中继服务器和客户端。

**示例用法**：
```bash
gnirehtet run
```
指定DNS服务器：
```bash
gnirehtet run -d 8.8.8.8,8.8.4.4
```
指定端口：
```bash
gnirehtet run -p 8080
```
指定路由：
```bash
gnirehtet run -r 192.168.1.0/24
```

## gnirehtet autorun [-d DNS[,DNS2,...]] [-p PORT] [-r ROUTE[,ROUTE2,...]]

**描述**：为所有设备启用反向网络共享：
- 监控设备并自动启动客户端。
- 启动中继服务器。

**示例用法**：
```bash
gnirehtet autorun
```
指定DNS服务器：
```bash
gnirehtet autorun -d 8.8.8.8,8.8.4.4
```
指定端口：
```bash
gnirehtet autorun -p 8080
```
指定路由：
```bash
gnirehtet autorun -r 192.168.1.0/24
```

## gnirehtet start [serial] [-d DNS[,DNS2,...]] [-p PORT] [-r ROUTE[,ROUTE2,...]]

**描述**：在安卓设备上启动客户端并退出。
- 若指定 `-d`，设备将使用指定的DNS服务器。
- 若指定 `-r`，仅反向共享指定的路由。
- 若指定 `-p`，中继服务器将监听指定端口。

**示例用法**：
```bash
gnirehtet start
```
指定设备序列号：
```bash
gnirehtet start 1234567890ABCDEF
```
指定DNS服务器：
```bash
gnirehtet start -d 8.8.8.8,8.8.4.4
```
指定端口：
```bash
gnirehtet start -p 8080
```
指定路由：
```bash
gnirehtet start -r 192.168.1.0/24
```

## gnirehtet autostart [-d DNS[,DNS2,...]] [-p PORT] [-r ROUTE[,ROUTE2,...]]

**描述**：监听设备连接并为每个检测到的设备启动客户端。
- 参数与 `start` 命令相同（无需指定序列号，将自动从检测到的设备获取）。

**示例用法**：
```bash
gnirehtet autostart
```
指定DNS服务器：
```bash
gnirehtet autostart -d 8.8.8.8,8.8.4.4
```
指定端口：
```bash
gnirehtet autostart -p 8080
```
指定路由：
```bash
gnirehtet autostart -r 192.168.1.0/24
```

## gnirehtet stop [serial]

**描述**：停止指定安卓设备上的客户端并退出。

**示例用法**：
```bash
gnirehtet stop
```
指定设备序列号：
```bash
gnirehtet stop 1234567890ABCDEF
```

## gnirehtet restart [serial] [-d DNS[,DNS2,...]] [-p PORT] [-r ROUTE[,ROUTE2,...]]

**描述**：停止当前客户端并重新启动。

**示例用法**：
```bash
gnirehtet restart
```
指定设备序列号：
```bash
gnirehtet restart 1234567890ABCDEF
```
指定DNS服务器：
```bash
gnirehtet restart -d 8.8.8.8,8.8.4.4
```
指定端口：
```bash
gnirehtet restart -p 8080
```
指定路由：
```bash
gnirehtet restart -r 192.168.1.0/24
```

## gnirehtet tunnel [serial] [-p PORT]

**描述**：设置 `adb reverse` 隧道。若设备在 gnirehtet 运行期间断开并重新连接，重置隧道可恢复连接。

**示例用法**：
```bash
gnirehtet tunnel
```
指定设备序列号：
```bash
gnirehtet tunnel 1234567890ABCDEF
```
指定端口：
```bash
gnirehtet tunnel -p 8080
```

## gnirehtet relay [-p PORT]

**描述**：在当前终端启动中继服务器。

**示例用法**：
```bash
gnirehtet relay
```
指定端口：
```bash
gnirehtet relay -p 8080
```