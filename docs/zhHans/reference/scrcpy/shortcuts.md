---
title: Shortcuts（快捷键）
---

# 快捷键

在 scrcpy 窗口中可以通过键盘和鼠标快捷键执行操作。

以下列表中，<kbd>MOD</kbd> 是快捷键修饰键。默认情况下是（左）<kbd>Alt</kbd> 或（左）<kbd>Super</kbd>。

可以使用 `--shortcut-mod` 修改修饰键。可选键包括 `lctrl`、`rctrl`、`lalt`、`ralt`、`lsuper` 和 `rsuper`。例如：

```bash
# 使用右Ctrl作为快捷键修饰键
scrcpy --shortcut-mod=rctrl

# 使用左Ctrl或左Super作为快捷键修饰键
scrcpy --shortcut-mod=lctrl,lsuper
```

_<kbd>[Super]</kbd> 通常是 <kbd>Windows</kbd> 或 <kbd>Cmd</kbd> 键。_

[Super]: https://en.wikipedia.org/wiki/Super_key_(keyboard_button)

| 操作                                         | 快捷键                                                         |
| -------------------------------------------- | -------------------------------------------------------------- |
| 切换全屏模式                                 | <kbd>MOD</kbd>+<kbd>f</kbd>                                   |
| 向左旋转屏幕                                 | <kbd>MOD</kbd>+<kbd>←</kbd> _(左)_                            |
| 向右旋转屏幕                                 | <kbd>MOD</kbd>+<kbd>→</kbd> _(右)_                            |
| 水平翻转屏幕                                 | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>←</kbd> _(左)_ \| <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>→</kbd> _(右)_ |
| 垂直翻转屏幕                                 | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>↑</kbd> _(上)_ \| <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>↓</kbd> _(下)_ |
| 暂停或恢复显示                               | <kbd>MOD</kbd>+<kbd>z</kbd>                                   |
| 恢复显示                                     | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>z</kbd>                  |
| 重置视频捕获/编码                           | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>r</kbd>                  |
| 调整窗口至1:1（像素级显示）                 | <kbd>MOD</kbd>+<kbd>g</kbd>                                   |
| 调整窗口以去除黑边                          | <kbd>MOD</kbd>+<kbd>w</kbd> \| _双击左键¹_                    |
| 点击 `HOME`                                  | <kbd>MOD</kbd>+<kbd>h</kbd> \| _中键点击_                     |
| 点击 `BACK`                                  | <kbd>MOD</kbd>+<kbd>b</kbd> \| <kbd>MOD</kbd>+<kbd>Backspace</kbd> \| _右键点击²_ |
| 点击 `APP_SWITCH`                            | <kbd>MOD</kbd>+<kbd>s</kbd> \| _第4键点击³_                   |
| 点击 `MENU`（解锁屏幕）⁴                    | <kbd>MOD</kbd>+<kbd>m</kbd>                                   |
| 点击 `VOLUME_UP`                             | <kbd>MOD</kbd>+<kbd>↑</kbd> _(上)_                            |
| 点击 `VOLUME_DOWN`                           | <kbd>MOD</kbd>+<kbd>↓</kbd> _(下)_                            |
| 点击 `POWER`                                 | <kbd>MOD</kbd>+<kbd>p</kbd>                                   |
| 开机                                         | _右键点击²_                                                    |
| 关闭设备屏幕（保持镜像）                     | <kbd>MOD</kbd>+<kbd>o</kbd>                                   |
| 打开设备屏幕                                 | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>o</kbd>                  |
| 旋转设备屏幕                                 | <kbd>MOD</kbd>+<kbd>r</kbd>                                   |
| 展开通知面板                                 | <kbd>MOD</kbd>+<kbd>n</kbd> \| _第5键点击³_                   |
| 展开设置面板                                 | <kbd>MOD</kbd>+<kbd>n</kbd>+<kbd>n</kbd> \| _双击第5键³_      |
| 折叠面板                                     | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>n</kbd>                  |
| 复制到剪贴板⁵                                | <kbd>MOD</kbd>+<kbd>c</kbd>                                   |
| 剪切到剪贴板⁵                                | <kbd>MOD</kbd>+<kbd>x</kbd>                                   |
| 同步剪贴板并粘贴⁵                            | <kbd>MOD</kbd>+<kbd>v</kbd>                                   |
| 注入计算机剪贴板文本                         | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>v</kbd>                  |
| 打开键盘设置（仅限HID键盘）                  | <kbd>MOD</kbd>+<kbd>k</kbd>                                   |
| 启用/禁用FPS计数器（输出到stdout）           | <kbd>MOD</kbd>+<kbd>i</kbd>                                   |
| 捏合缩放/旋转                                | <kbd>Ctrl</kbd>+_点击并移动_                                   |
| 垂直倾斜（双指滑动）                         | <kbd>Shift</kbd>+_点击并移动_                                  |
| 水平倾斜（双指滑动）                         | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+_点击并移动_                  |
| 拖放APK文件                                  | 从电脑安装APK                                                  |
| 拖放非APK文件                                | [推送文件到设备](/zhHans/reference/scrcpy/control#push-file-to-device)               |

_¹双击黑边以去除它们。_  
_²右键点击会在屏幕关闭时唤醒屏幕，否则执行BACK操作。_  
_³第4和第5鼠标按键（如果您的鼠标支持）。_  
_⁴对于开发中的React Native应用，`MENU` 会触发开发菜单。_  
_⁵仅在Android 7及以上版本支持。_

重复按键的快捷键需要在释放后再次按下该键来执行。例如，执行“展开设置面板”：

1. 按下并保持按住 <kbd>MOD</kbd>。
2. 然后双击 <kbd>n</kbd>。
3. 最后释放 <kbd>MOD</kbd>。

所有 <kbd>Ctrl</kbd>+_按键_ 的快捷键会被转发到设备，由当前活动应用处理。