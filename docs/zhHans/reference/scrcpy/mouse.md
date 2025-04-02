---
title: Mouse（鼠标）
---

# 鼠标  

提供多种鼠标输入模式：  

 - `--mouse=sdk`（默认模式）  
 - `--mouse=uhid`（或 `-M`）：通过设备的 UHID 内核模块模拟物理 HID 鼠标  
 - `--mouse=aoa`：通过 AOAv2 协议模拟物理 HID 鼠标  
 - `--mouse=disabled`  

## SDK 鼠标模式  

在此模式下（`--mouse=sdk` 或省略参数时），鼠标输入事件会以绝对坐标的形式通过 Android API 注入设备。  

注意：在某些设备上，开发者选项中需启用额外选项才能使此模式生效。详见[前提条件](/zhHans/reference/scrcpy/#prerequisites)。  

### 鼠标悬停  

默认情况下，鼠标悬停（无点击的鼠标移动）事件会被转发到设备。可通过以下命令禁用：  

```  
scrcpy --no-mouse-hover  
```  

## 物理鼠标模拟  

有两种模式可在设备上模拟物理 HID 鼠标。  

在这些模式下，计算机鼠标会被“捕获”：鼠标指针从计算机消失，转而出现在 Android 设备上。  

通过[快捷键修饰键](/zhHans/reference/scrcpy/shortcuts)（默认为 <kbd>Alt</kbd> 或 <kbd>Super</kbd>）可切换（禁用或启用）鼠标捕获功能。使用其中之一可将鼠标控制权交还给计算机。  

### UHID 模式  

此模式通过设备的 [UHID] 内核模块模拟物理 HID 鼠标。  

[UHID]: https://kernel.org/doc/Documentation/hid/uhid.txt  

启用 UHID 鼠标模式的命令：  

```bash  
scrcpy --mouse=uhid  
scrcpy -M  # 简写形式  
```  

注意：由于权限问题，UHID 在旧版 Android 上可能无法工作。  

### AOA 模式  

此模式通过 [AOAv2] 协议模拟物理 HID 鼠标。  

[AOAv2]: https://source.android.com/devices/accessories/aoa2#hid-support  

启用 AOA 鼠标模式的命令：  

```bash  
scrcpy --mouse=aoa  
```  

与其他模式不同，此模式直接在 USB 层面工作（因此仅支持 USB 连接）。  

它不使用 scrcpy 服务端，也不依赖 `adb`（USB 调试）。因此，即使 USB 调试被禁用，仍可控制设备（但无法镜像）。详见 [OTG](/zhHans/reference/scrcpy/otg)。  

注意：在 Windows 上，此模式可能仅在 [OTG 模式](/zhHans/reference/scrcpy/otg)下有效，镜像时无效（如果 USB 设备已被其他进程如 _adb 守护进程_ 占用，则无法打开）。  

## 鼠标按键绑定  

默认情况下，在 SDK 鼠标模式下：  
 - 右键触发 `BACK`（或点亮屏幕）  
 - 中键触发 `HOME`  
 - 第四键触发 `APP_SWITCH`  
 - 第五键展开通知面板  

通过按住 <kbd>Shift</kbd> 键，可将次要点击事件转发到设备（例如 <kbd>Shift</kbd>+右键会向设备注入右键点击）。  

在 AOA 和 UHID 鼠标模式下，默认绑定相反：所有点击默认被转发，按住 <kbd>Shift</kbd> 可触发快捷键（由于光标由设备端处理，在此模式下默认转发所有鼠标按键更合理）。  

可通过 `--mouse-bind=xxxx:xxxx` 配置任何鼠标模式的快捷键。参数必须为一或两组（用 `:` 分隔）共 4 个字符的序列，分别对应每次次要点击：  

```  
                .---- Shift + 右键  
       次要绑定 |.--- Shift + 中键  
               ||.-- Shift + 第四键  
               |||.- Shift + 第五键  
               ||||  
               vvvv  
--mouse-bind=xxxx:xxxx  
             ^^^^  
             ||||  
   主要绑定   ||| `- 第五键  
             || `-- 第四键  
             | `--- 中键  
              `---- 右键  
```  

每个字符必须为以下之一：  

 - `+`：转发点击到设备  
 - `-`：忽略点击  
 - `b`：触发快捷键 `BACK`（或点亮屏幕）  
 - `h`：触发快捷键 `HOME`  
 - `s`：触发快捷键 `APP_SWITCH`  
 - `n`：触发快捷键“展开通知面板”  

例如：  

```bash  
scrcpy --mouse-bind=bhsn:++++  # SDK 鼠标的默认模式  
scrcpy --mouse-bind=++++:bhsn  # AOA 和 UHID 的默认模式  
scrcpy --mouse-bind=++bh:++sn  # 转发右键和中键点击，  
                               # 使用第四键和第五键触发 BACK 和 HOME，  
                               # 使用 Shift+第四键 和 Shift+第五键 触发  
                               # APP_SWITCH 和展开通知面板  
```  

第二组绑定可省略。此时其内容与第一组相同：  

```bash  
scrcpy --mouse-bind=bhsn  
scrcpy --mouse-bind=bhsn:bhsn  # 等效  
```  