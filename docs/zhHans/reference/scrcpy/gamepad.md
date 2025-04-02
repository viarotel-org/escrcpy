---
title: Gamepad（游戏手柄）
---

# Gamepad（游戏手柄）

提供多种游戏手柄输入模式：

- `--gamepad=disabled`（默认模式）
- `--gamepad=uhid`（或简写为 `-G`）：通过设备的 UHID 内核模块模拟物理 HID 游戏手柄
- `--gamepad=aoa`：通过 AOAv2 协议模拟物理 HID 游戏手柄

## 物理游戏手柄模拟

有两种模式可以在设备上模拟物理 HID 游戏手柄，每种模式对应计算机上连接的一个物理游戏手柄。

### UHID 模式

此模式通过设备上的 [UHID] 内核模块模拟物理 HID 游戏手柄。

[UHID]: https://kernel.org/doc/Documentation/hid/uhid.txt

启用 UHID 游戏手柄模式，请使用以下命令：

```bash
scrcpy --gamepad=uhid
scrcpy -G  # 简写形式
```

注意：由于权限问题，UHID 在较旧的 Android 版本上可能无法正常工作。

### AOA 模式

此模式通过 [AOAv2] 协议模拟物理 HID 游戏手柄。

[AOAv2]: https://source.android.com/devices/accessories/aoa2#hid-support

启用 AOA 游戏手柄模式，请使用以下命令：

```bash
scrcpy --gamepad=aoa
```

与其他模式不同，此模式直接在 USB 层级工作（因此仅支持通过 USB 连接）。

它不使用 scrcpy 服务端，也不需要 `adb`（USB 调试）。因此，即使 USB 调试被禁用，也可以控制设备（但无法镜像屏幕，详见 [OTG](/zhHans/reference/scrcpy/otg)）。

注意：在此模式下，Android 会将多个物理游戏手柄检测为一个行为异常的单一设备。如果需要使用多个游戏手柄，请选择 UHID 模式。

注意：在 Windows 上，此模式可能仅在 [OTG 模式](/zhHans/reference/scrcpy/otg) 下有效，无法在镜像时使用（如果 USB 设备已被其他进程如 _adb 守护进程_ 占用，则无法打开）。