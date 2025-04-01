---
title: Escrcpy
---

# Escrcpy

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