---
title: Quick Start
---

# Quick Start

## Installation

### Manual installation via released packages

- [Github](https://github.com/viarotel-org/escrcpy/releases)
- [Gitee](https://gitee.com/viarotel-org/escrcpy/releases)
- [Gitcode](https://gitcode.com/viarotel-org/escrcpy/releases)

### macOS can be installed via Homebrew

See [homebrew-escrcpy](https://github.com/viarotel-org/homebrew-escrcpy)

## USB Connection

> Note: If the phone prompts for debugging authorization, click allow

1. [Enable developer mode](https://www.bing.com/search?q=Enable+developer+mode+android) and [USB debugging](https://www.bing.com/search?q=USB+debugging+android) on your Android phone
2. Open Escrcpy and connect your Android phone to your computer
3. The device list in Escrcpy should have detected your phone, click start mirroring
4. Enjoy!

## WIFI Connection

### Scan QR Code to Connect

1. Follow steps 1-2 from USB connection
2. Enable and enter wireless debugging in developer mode
3. Click "Pair device using QR code"
4. Start enjoying!

### Connect via IP Address

> Note: If initial wireless connection fails, you may need wireless pairing. Please refer to [FAQ](/help/)
>
> Note: You need to enable wireless debugging and obtain your device's wireless address (usually the IP address assigned when connecting to WiFi) and port number (default is 5555) from the wireless debugging page

1. Follow steps 1-2 from USB connection
2. Enter the obtained device IP address and port number in Escrcpy, then click connect device
3. At this point, Escrcpy device list should detect your phone, click start mirroring
4. Start enjoying!

## macOS && Linux

> Note: These platforms do not come with integrated [Scrcpy](/reference/scrcpy/), you need to install them manually

**In Escrcpy@1.27.1+ scrcpy binary files are preliminarily integrated, eliminating the need for manual scrcpy installation.**

1. Refer to the [installation document](/reference/scrcpy/linux.md) for Linux
2. Refer to the [installation document](/reference/scrcpy/macos.md) for macOS
3. Follow steps in USB Connection and WIFI Connection after dependencies are installed successfully

## Gnirehtet Reverse Tethering
> Gnirehtet is built into the Windows and Linux apps to provide reverse tethering from PC to Android devices.

After connecting the device through the above steps, enable the reverse network function through `Devices` -> `Device Control Bar` -> `Gnirehtet`.

**Note: macOS does not have Gnirehtet built-in. You need to manually install it to use this feature [Installation Guide](/reference/gnirehtet/).**