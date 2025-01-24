<div style="display:flex;">
  <img src="https://cdn.jsdelivr.net/gh/viarotel-org/escrcpy@main/electron/resources/build/logo.png" alt="viarotel-escrcpy" width="108px">
</div>

# Escrcpy

[![GitCode](https://gitcode.com/viarotel-org/escrcpy/star/badge.svg)](https://gitcode.com/viarotel-org/escrcpy)
[![Gitee](https://gitee.com/viarotel-org/escrcpy/badge/star.svg?theme=dark)](https://gitee.com/viarotel-org/escrcpy)
[![GitHub](https://img.shields.io/github/stars/viarotel-org/escrcpy?label=Github%20Stars)](https://github.com/viarotel-org/escrcpy)

📱 Display and control your Android device with a Graphical Interface of Scrcpy powered by Electron. [中文文档](https://github.com/viarotel-org/escrcpy/blob/main/README-CN.md)

<div style="display:flex;">
  <img src="./screenshots/en-US/overview.jpg" alt="viarotel-escrcpy" width="100%">
</div>

## Features

- 🏃 Synchronous: Benefit from web technologies to synchronize with Scrcpy faster
- 🤖 Automation: Auto-connect devices, auto-execute images, custom scripts, scheduled tasks
- 💡 Customization: Multi-device management, independent configurations, custom notes, config import/export
- 📡 Wireless: Quick connect by scanning QR code
- 🔗 Reverse tethering: Gnirehtet reverse tethering
- 🎨 Themes: Light mode, dark mode, system-based switching
- 😎 Lightweight: Native support, only display device screen
- ⚡️ Performance: 30-120 fps depending on device
- 🌟 Quality: 1920×1080 or higher
- 🕒 Low latency: 35~70 ms
- 🚀 Quick startup: Display first image in about 1 second
- 🙅‍♂️ Non-intrusive: No installation residual left on Android device
- 🤩 User benefits: No account, no ads, no internet required
- 🗽 Free and open source

## Installation

### Manual installation via released packages

View [release address](https://github.com/viarotel-org/escrcpy/releases)

### macOS can be installed via Homebrew

See [homebrew-escrcpy](https://github.com/viarotel-org/homebrew-escrcpy)

## Quick Start

### USB Connection

> Note: If the phone prompts for debugging authorization, click allow

1. Enable developer mode and USB debugging on your Android phone
2. Open Escrcpy and connect your Android phone to your computer
3. The device list in Escrcpy should have detected your phone, click start mirroring
4. Enjoy!

### WIFI Connection

#### Scan QR Code to Connect

1. Follow steps 1-2 from USB connection
2. Enable and enter wireless debugging in developer mode
3. Click "Pair device using QR code"
4. Start enjoying!

#### Connect via IP Address

> Note: If initial wireless connection fails, you may need wireless pairing. Please refer to [FAQ](#FAQ)
>
> Note: You need to enable wireless debugging and obtain your device's wireless address (usually the IP address assigned when connecting to WiFi) and port number (default is 5555) from the wireless debugging page

1. Follow steps 1-2 from USB connection
2. Enter the obtained device IP address and port number in Escrcpy, then click connect device
3. At this point, Escrcpy device list should detect your phone, click start mirroring
4. Start enjoying!

### macOS && Linux

> Note: These platforms do not come with integrated [Scrcpy](https://github.com/Genymobile/scrcpy), you need to install them manually

**In Escrcpy@1.27.1+ scrcpy binary files are preliminarily integrated, eliminating the need for manual scrcpy installation.**

1. Refer to the [installation document](https://github.com/Genymobile/scrcpy/blob/master/doc/linux.md) for Linux
2. Refer to the [installation document](https://github.com/Genymobile/scrcpy/blob/master/doc/macos.md) for macOS
3. Follow steps in USB Connection and WIFI Connection after dependencies are installed successfully

### Gnirehtet Reverse Tethering

> Note: macOS does not have Gnirehtet built-in. You need to manually install it to use this feature [Installation Guide](https://github.com/Genymobile/gnirehtet).

Gnirehtet is built into the Windows and Linux apps to provide reverse tethering from PC to Android devices.

## Developers

If you are a developer and would like to run or help improve this project please see the [development documentation](https://github.com/viarotel-org/escrcpy/blob/main/develop.md)

## Shortcuts

Refer to [scrcpy/doc/shortcuts](https://github.com/Genymobile/scrcpy/blob/master/doc/shortcuts.md)

## Device Operation

### Batch Processing

- Batch Interception Screen
- Batch Installation Application
- Batch File Management
- Batch Execution Script
- Batch Scheduled Task

### Control Model

- Mirror
- Recording
- Recording Camera
- Recording Audio
- Camera
- Custom
- OTG

### Device Interaction Bar

- Switch
- Home
- Back
- Start APP (Mirror Group)
- Turn off screen (experimental)
- Notification
- Power
- Rotation
- Volume
- Screenshot
- Reboot
- Install APP
- File Manager
- Execution Script
- Scheduled Task
- Gnirehtet

## Preferences

> Continuously improving. Currently supports the following common configurations

### General

- Theme
- Language
- File storage path
- Adb path
- Scrcpy path
- Gnirehtet path
- Scrcpy parameters
- Auto-connect device
- Auto-execute mirroring
- Gnirehtet fix
- Debug
- Floating control bar

### Video Control

- Disable video forwarding
- Maximum size
- Video bitrate
- Refresh rate
- Video codec
- Display orientation
- Rotation angle
- Screen cropping
- Monitor
- Video buffer
- Receiver (v4l2) buffer

### Device Control

- Show touch points
- Keep awake
- Turn off screen during control
- Turn off screen after control
- Disable auto screen on during control
- Simulate auxiliary display

### Window Control

- Window width
- Window height
- Window X-coordinate
- Window Y-coordinate
- Borderless mode
- Fullscreen mode
- Always on top
- Disable screensaver

### Audio Control

- Disable audio forwarding
- Keep device audio
- Audio source
- Audio codec
- Audio bitrate
- Audio buffer
- Audio output buffer

### Audio/Video Recording

- Record video format
- Record video orientation
- Recording duration
- Disable video playback
- Disable audio playback

### Input Control

- Mouse mode
- Mouse binding
- Keyboard mode
- Keyboard injection method
- Gamepad

### Camera Control

- Camera source
- Camera size
- Camera ratio
- Camera frame rate

## Next Steps?

> Priority from high to low:

1. Improved logo ✅
2. Software update feature ✅
3. Record and save audio/video ✅
4. Device quick interaction control bar ✅
5. Custom Adb and Scrcpy dependencies ✅
6. Custom device names ✅
7. Export and import preferences ✅
8. Individual device configuration ✅
9. macOS and Linux support ✅
10. Internationalization ✅
11. Dark mode ✅
12. Reverse tethering (Gnirehtet) ✅
13. Camera mirroring ✅
14. Multi-screen collaboration ✅
15. File push, screen rotation, audio control ✅
16. Batch connect historical devices ✅
17. Built-in terminal ✅
18. Auto-execute mirroring ✅
19. Flexible mirroring launch ✅
20. Batch processing ✅
21. Scheduled tasks ✅
22. Graphical file manager ✅
23. Floating control bar ✅
24. Enhanced recording ✅
25. Start APP(Multi-threaded) ✅
26. Main window edge hidden ✅
27. Group devices (by filtering remarks) ✅
28. Improved history device connection experience ✅  
29. File management supports uploading directories ✅
30. Better operation progress display 🚧
31. Improved method for setting the position and size of the mirroring window 🚧
32. Support for batch starting devices 🚧
33. Improved experience for batch connecting devices 🚧

## FAQ

### Computer cannot detect device after connecting

1. Please unplug and reconnect your device, and make sure the device has granted USB debugging authorization.
2. If it still doesn't work, your computer may be missing necessary drivers. Please install drivers using third-party tools such as DriverWizard and try again.

### Unable to enter Chinese

> In Scrcpy@2.4+ and above, the solution is as follows:

1. Escrcpy Settings: Go to `Preferences` → `Input Control` → `Keyboard Mode` and select `uhid` mode.
2. Device Input Method Preparation: Install an input method that supports physical keyboards (WeChat Input Method is recommended) and complete the setup.
3. Start Mirroring: Click `Start Mirroring` in Escrcpy. Verification: The device’s `Settings` → `System` → `Language & Input` should display options for `Physical Keyboard` and `On-screen Keyboard`.
4. Device Input Settings: Enable WeChat Input Method in the `On-screen Keyboard` settings. Configure the keyboard layout in the `Physical Keyboard` settings to match the computer keyboard (only needs to be done once).
5. Computer Input Preparation: Set the input mode to English (important).
6. Switch Input Language: Use `Ctrl` + `Shift` to switch between English and Chinese.
7. Start Using.

[Download WeChat Input Method](https://z.weixin.qq.com/)

### Wireless connection prompts: The target computer actively refuses access

The first wireless connection may require pairing. Alternatively, insert USB to ensure connection establishment and authorization success before using wireless.

### Clicking wireless mode after connecting via data cable has no response

Please click again, or click refresh devices. Generally it will not exceed two clicks. If still not working, please provide device model and Android version to [Issues](https://github.com/viarotel-org/escrcpy/issues)

### Why is the device interaction control bar not designed as an automatically sticking floating menu?

It is important to note that, in principle, Escrcpy is just a GUI version based on Scrcpy, although it does extend some functionality. However, these extensions do not affect the core of Scrcpy. To implement this particular feature, I would have to modify the underlying Scrcpy code, which would make it more difficult for Escrcpy to stay in sync with Scrcpy's updates, and the drawbacks would outweigh the benefits.

Therefore, after careful consideration, we have decided to adopt the existing solution and look forward to Scrcpy adding native support for an interactive control bar in the future.

### Some devices can see screenshots after connecting but cannot operate

> Note: For Xiaomi phones in particular, it requires not only enabling USB debugging but also enabling USB debugging (Security Settings), which is to allow modifying permissions or simulating clicks via USB debugging.

Please refer to the detailed instructions under [Reasons why mouse and keyboard do not work](https://github.com/Genymobile/scrcpy/blob/master/FAQ.md#mouse-and-keyboard-do-not-work)

### Downloading prompts antivirus detection causing unable to download normally

> After feedback, Windows Defender may occasionally block the software packages from being downloaded due to lack of certificate signing. You can try the following solutions:

1. Open `Windows Security Center`.
2. Select `Virus & threat protection`.
3. In the `Virus & threat protection settings`, click `Manage settings`.
4. Find `Real-time protection`, you can try clicking Disable if permission allows. If unable to disable real-time protection, please skip this step.
5. Scroll down the page, find `Exclusions`, click `Add or remove exclusions`.
6. Add the folder path where you download the software packages as an exclusion item, i.e. add the folder to the `Excluded list`.

### Failed to get device list or error when starting mirroring/recording

> This is generally caused by an incorrect path for `Adb` or `Scrcpy`, you can try the following solutions:

1. In the menu, select `Preferences` and then click the reset configuration button in the top right corner of `Global Mode`.
2. Go to the `Device List` page and try enabling mirroring again.
3. Make sure you have downloaded and installed the latest version of `Escrcpy`.
4. Press `Ctrl` + `Shift` + `I` to open the developer tools and check for any error messages.
5. If there are errors, take a screenshot and submit your issue with the screenshot on the [Feedback Issues](https://github.com/viarotel-org/escrcpy/issues) page.

### macOS window minimized to system tray icon not found

> This is generally caused by too many icons in the system tray overflowing and hiding the Escrcpy icon. Try using the following tools:

- [iBar](https://www.better365.cn/ibar.html)
- [Bartender](https://www.macbartender.com/)

### After a successful installation of macOS, when I try to open it, I receive a prompt saying the file is damaged.

> This is usually due to the software package not being signed. You can try the following solutions:

1. Open Terminal and execute `sudo spctl --master-disable` to allow software from any source.
2. Open Terminal and execute `sudo xattr -r -d com.apple.quarantine /Applications/Escrcpy.app` to attempt fixing the damaged software package prompt.

### Unable to locate the input point DiscardvirtualMemory on the dynamic link library Kernel32.dll.

Only support `Windows 10` and above versions.

### Audio capture exception causing mirroring failure.

> This usually happens because your computer lacks audio output or you have a low Android version (Android 11+).

Please try `disabling audio forwarding` feature through the `preferences settings` to resolve this issue.

### Microsoft Store version mirror startup error

> This is caused by files in the installation directory lacking executable permissions.

You need to customize the file paths for `scrcpy` and `adb` (ensuring they have executable permissions). If using reverse tethering, configure `gnirehtet` similarly.

### Could not execute "adb start-server"

This might be due to Chinese or special characters in the installation path. Please try changing the installation path.


### Unable to Open After Installation in Linux System

> New restrictions have been implemented for AppImage applications in some popular distributions, such as Ubuntu 24.04, limiting the use of sandboxes. A temporary workaround is as follows:

```shell
sudo chmod 4755 /opt/Escrcpy/chrome-sandbox
```

## Getting Help

> As this is an open source project run entirely by donations, support is limited and updates may not be on a fixed schedule.

- Issues: [Submit Feedback](https://github.com/viarotel-org/escrcpy/issues)
- Email: viarotel@qq.com

## Acknowledgements

This project would not be possible without the following open source projects:

- [scrcpy](https://github.com/Genymobile/scrcpy)
- [adbkit](https://github.com/DeviceFarmer/adbkit)
- [electron](https://www.electronjs.org/)
- [vue](https://vuejs.org/)
- [gnirehtet](https://github.com/Genymobile/gnirehtet/)

## Sponsor Project

> If this project has helped you, you can buy me a coffee to keep me energized and improving the project! 😛

<div style="display:flex;">
  <img src="https://cdn.jsdelivr.net/gh/viarotel-org/escrcpy@main/src/assets/sponsor/viarotel-wepay.png" alt="viarotel-wepay" width="30%">
  <img src="https://cdn.jsdelivr.net/gh/viarotel-org/escrcpy@main/src/assets/sponsor/viarotel-alipay.png" alt="viarotel-alipay" width="30%">
  <a href="https://www.paypal.com/paypalme/viarotel" target="_blank" rel="noopener noreferrer">
    <img src="https://cdn.jsdelivr.net/gh/viarotel-org/escrcpy@main/src/assets/sponsor/viarotel-paypal.png" alt="viarotel-paypal" width="30%">
  </a>
</div>

## Contributors

Thanks for all their contributions!

[Contributors](https://github.com/viarotel/escrcpy/graphs/contributors)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=viarotel-org/escrcpy&type=Date)](https://star-history.com/#viarotel-org/escrcpy&Date)
