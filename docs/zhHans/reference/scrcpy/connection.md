---
title: Connection（连接）
---

# 连接

## 设备选择

如果仅有一台设备已连接（即通过 `adb devices` 列出），则该设备会被自动选中。  

但如果有多台设备连接，您需要通过以下4种方式之一指定要使用的设备：  
 - 通过设备序列号：  
   ```bash  
   scrcpy --serial=0123456789abcdef  
   scrcpy -s 0123456789abcdef   # 简写形式  

   # 如果通过 TCP/IP 连接，序列号为 IP:端口（与 adb 行为一致）  
   scrcpy --serial=192.168.1.1:5555  
   ```  
 - 选择通过 USB 连接的设备（仅限一台）：  
   ```bash  
   scrcpy --select-usb  
   scrcpy -d   # 简写形式  
   ```  
 - 选择通过 TCP/IP 连接的设备（仅限一台）：  
   ```bash  
   scrcpy --select-tcpip  
   scrcpy -e   # 简写形式  
   ```  
 - 选择已监听 TCP/IP 连接的设备（见[下文](#tcpip-无线连接)）：  
   ```bash  
   scrcpy --tcpip=192.168.1.1:5555  
   scrcpy --tcpip=192.168.1.1        # 默认端口为 5555  
   ```  

设备序列号也可以通过环境变量 `ANDROID_SERIAL` 提供（该变量同样被 `adb` 使用）：  

```bash  
# 在 bash 中  
export ANDROID_SERIAL=0123456789abcdef  
scrcpy  
```  

```cmd  
:: 在 cmd 中  
set ANDROID_SERIAL=0123456789abcdef  
scrcpy  
```  

```powershell  
# 在 PowerShell 中  
$env:ANDROID_SERIAL = '0123456789abcdef'  
scrcpy  
```  


## TCP/IP（无线连接）

_Scrcpy_ 使用 `adb` 与设备通信，而 `adb` 可以通过 TCP/IP [连接] 设备。设备必须与计算机连接在同一网络中。  

[连接]: https://developer.android.com/studio/command-line/adb.html#wireless  


### 自动连接

选项 `--tcpip` 支持自动配置连接。它有两种使用方式。  

如果设备未启用 _adb_ TCP/IP 模式（或您不知道设备的 IP 地址），请先通过 USB 连接设备，然后运行：  

```bash  
scrcpy --tcpip   # 不带参数  
```  

该命令会自动查找设备的 IP 地址和 adb 端口，必要时启用 TCP/IP 模式，并在启动前连接到设备。  

如果设备（本例中为 192.168.1.1）已监听某个端口（通常为 5555）以接收 _adb_ 连接，则直接运行：  

```bash  
scrcpy --tcpip=192.168.1.1       # 默认端口为 5555  
scrcpy --tcpip=192.168.1.1:5555  
```  

在地址前添加 '+' 可强制重新连接：  

```bash  
scrcpy --tcpip=+192.168.1.1  
```  


### 手动连接

您也可以手动通过 `adb` 启用 TCP/IP 连接：  

1. 将设备通过 USB 连接到计算机。  
2. 将设备与计算机连接到同一 Wi-Fi 网络。  
3. 获取设备 IP 地址，可通过“设置 → 关于手机 → 状态”查看，或执行以下命令：  
    ```bash  
    adb shell ip route | awk '{print $9}'  
    ```  
4. 在设备上启用 TCP/IP 模式的 `adb`：`adb tcpip 5555`。  
5. 拔掉设备 USB 线。  
6. 连接到设备：`adb connect 设备IP:5555`（将 `设备IP` 替换为实际的 IP 地址）。  
7. 像往常一样运行 `scrcpy`。  
8. 完成后运行 `adb disconnect`。  

从 Android 11 开始，[无线调试选项][adb-wireless] 允许您无需物理连接设备即可完成操作。  

[adb-wireless]: https://developer.android.com/studio/command-line/adb#wireless-android11-command-line  


## 自动启动

_scrcpy_ 作者开发的一个小工具 [AutoAdb] 可以在检测到新 Android 设备连接时自动运行任意命令。您可以用它来启动 scrcpy：

```bash  
autoadb scrcpy -s '{}'
```  

[AutoAdb]: https://github.com/rom1v/autoadb