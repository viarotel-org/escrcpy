---
title: keyboard（键盘）
---

# 键盘

提供多种键盘输入模式：

- `--keyboard=sdk`（默认模式）
- `--keyboard=uhid`（或简写为 `-K`）：通过设备的 UHID 内核模块模拟物理 HID 键盘
- `--keyboard=aoa`：通过 AOAv2 协议模拟物理 HID 键盘
- `--keyboard=disabled` 禁用键盘输入

默认使用 `sdk` 模式，但如果经常使用 scrcpy，建议切换到 [`uhid`](#uhid) 模式并一次性配置键盘布局。

---

## SDK 键盘模式

在此模式下（`--keyboard=sdk` 或省略参数时），键盘输入事件通过 Android API 层级注入。该模式通用性强，但仅支持 ASCII 和部分其他字符。

注意：某些设备需在开发者选项中启用额外设置才能使此模式正常工作，详见[前提条件](/reference/scrcpy/#prerequisites)。

以下参数（专用于 `--keyboard=sdk`）可自定义行为：

### 文本注入偏好

输入文本时会生成两种[事件][textevents]：
- **按键事件**：表示按键的按下或释放；
- **文本事件**：表示文本的输入。

默认情况下，数字和“特殊字符”通过文本事件插入，而字母通过按键事件注入（以便在游戏中正常响应 WASD 等按键）。

但此行为可能导致[问题][prefertext]。若遇到此类问题，可强制将字母作为文本注入（或直接切换至 [UHID](#uhid) 模式）：

```bash
scrcpy --prefer-text
```

（但这会破坏游戏中的键盘行为）

反之，也可强制始终使用原始按键事件：

```bash
scrcpy --raw-key-events
```

[textevents]: https://blog.rom1v.com/2018/03/introducing-scrcpy/#handle-text-input  
[prefertext]: https://github.com/Genymobile/scrcpy/issues/650#issuecomment-512945343  

### 按键重复

默认情况下，长按按键会生成重复的按键事件。某些游戏中这些事件无用且可能导致性能问题。

禁用重复按键事件转发：

```bash
scrcpy --no-key-repeat
```

---

## 物理键盘模拟

两种模式可在设备上模拟物理 HID 键盘。为确保正常工作，需在设备上一次性配置与计算机匹配的键盘布局。

可通过以下方式打开配置页面：
- 使用 `uhid` 或 `aoa` 模式时，在 scrcpy 窗口中按 <kbd>MOD</kbd>+<kbd>k</kbd>（见[快捷键](/zhHans/reference/scrcpy/shortcuts)）
- 在设备上进入：设置 → 系统 → 语言与输入 → 物理键盘
- 通过计算机终端执行：  
  ```bash  
  adb shell am start -a android.settings.HARD_KEYBOARD_SETTINGS  
  ```

在此配置页面中，还可启用或禁用屏幕键盘。

### UHID 模式

此模式通过设备的 [UHID] 内核模块模拟物理 HID 键盘。

[UHID]: https://kernel.org/doc/Documentation/hid/uhid.txt  

启用 UHID 键盘：

```bash
scrcpy --keyboard=uhid
scrcpy -K  # 简写形式
```

配置键盘布局后（见上文），这是镜像时使用键盘的最佳模式：
- 支持所有字符和输入法（与 `--keyboard=sdk` 不同）
- 可禁用屏幕键盘（与 `--keyboard=sdk` 不同）
- 支持 TCP/IP 无线连接（与 `--keyboard=aoa` 不同）
- 在 Windows 上无兼容问题（与 `--keyboard=aoa` 不同）

缺点是由于权限问题，旧版 Android 可能无法使用此模式。

### AOA 模式

此模式通过 [AOAv2] 协议模拟物理 HID 键盘。

[AOAv2]: https://source.android.com/devices/accessories/aoa2#hid-support  

启用 AOA 键盘：

```bash
scrcpy --keyboard=aoa
```

与其他模式不同，AOA 直接在 USB 层级工作（仅支持有线连接）。

它不使用 scrcpy 服务端，且无需 `adb`（USB 调试）。因此，即使关闭 USB 调试，仍可控制设备（但不支持镜像，见 [OTG](/zhHans/reference/scrcpy/otg)）。

注意：在 Windows 上，此模式可能仅支持 [OTG 模式](/zhHans/reference/scrcpy/otg)，镜像时无法使用（若 USB 设备已被其他进程如 _adb 守护进程_ 占用，则无法重复打开）。