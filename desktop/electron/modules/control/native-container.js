import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { screen } from 'electron'
import { controlBarWidth, controlTitleBarHeight } from '$control/configs/index.js'

const containerStates = new WeakMap()

export function getNativeParentWindowHandle(win) {
  const handle = win.getNativeWindowHandle()

  if (handle.length >= 8) {
    return handle.readBigUInt64LE().toString()
  }

  return String(handle.readUInt32LE())
}

function createChildWatcherScript(containerHandle, containerProcessId) {
  return String.raw`
$ErrorActionPreference = 'Stop'

$source = @'
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;

public static class EscrcpyNativeContainer {
    public delegate bool EnumWindowsCallback(IntPtr window, IntPtr value);

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {
        public int Left;
        public int Top;
        public int Right;
        public int Bottom;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct POINT {
        public int X;
        public int Y;
    }

    [DllImport("user32.dll")]
    public static extern bool EnumChildWindows(
        IntPtr parent,
        EnumWindowsCallback callback,
        IntPtr value
    );

    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr window, out uint processId);

    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool IsWindow(IntPtr window);

    [DllImport("user32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool GetClientRect(IntPtr window, out RECT rect);

    [DllImport("user32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool GetWindowRect(IntPtr window, out RECT rect);

    [DllImport("user32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool ClientToScreen(IntPtr window, ref POINT point);

    [DllImport("user32.dll", EntryPoint = "GetWindowLongPtrW", SetLastError = true)]
    public static extern IntPtr GetWindowLongPtr(IntPtr window, int index);

    [DllImport("user32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool SetWindowPos(
        IntPtr window,
        IntPtr insertAfter,
        int x,
        int y,
        int width,
        int height,
        uint flags
    );

    [DllImport("gdi32.dll", SetLastError = true)]
    public static extern IntPtr CreateRectRgn(
        int left,
        int top,
        int right,
        int bottom
    );

    [DllImport("user32.dll", SetLastError = true)]
    public static extern int SetWindowRgn(
        IntPtr window,
        IntPtr region,
        [MarshalAs(UnmanagedType.Bool)] bool redraw
    );

    [DllImport("gdi32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool DeleteObject(IntPtr value);

    [DllImport("user32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool PostMessage(
        IntPtr window,
        uint message,
        IntPtr wParam,
        IntPtr lParam
    );

    [DllImport("user32.dll")]
    public static extern IntPtr SetFocus(IntPtr window);

    public delegate IntPtr LowLevelKeyboardProc(
        int code, IntPtr wParam, IntPtr lParam
    );

    [StructLayout(LayoutKind.Sequential)]
    public struct MSG {
        public IntPtr Window;
        public uint Message;
        public UIntPtr WParam;
        public IntPtr LParam;
        public uint Time;
        public POINT Point;
        public uint Private;
    }

    [DllImport("user32.dll", SetLastError = true)]
    public static extern IntPtr SetWindowsHookEx(
        int idHook, LowLevelKeyboardProc callback, IntPtr module, uint threadId
    );

    [DllImport("kernel32.dll", CharSet = CharSet.Auto)]
    public static extern IntPtr GetModuleHandle(string moduleName);

    [DllImport("user32.dll")]
    public static extern IntPtr CallNextHookEx(
        IntPtr hook, int code, IntPtr wParam, IntPtr lParam
    );

    [DllImport("user32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool UnhookWindowsHookEx(IntPtr hook);

    [DllImport("user32.dll")]
    public static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool IsChild(IntPtr parent, IntPtr child);

    [DllImport("user32.dll")]
    public static extern IntPtr GetAncestor(IntPtr window, uint flags);

    [DllImport("user32.dll")]
    public static extern int GetMessage(
        out MSG message, IntPtr window, uint minimum, uint maximum
    );

    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool TranslateMessage(ref MSG message);

    [DllImport("user32.dll")]
    public static extern IntPtr DispatchMessage(ref MSG message);

    private static IntPtr keyboardParent = IntPtr.Zero;
    private static IntPtr keyboardHook = IntPtr.Zero;
    private static LowLevelKeyboardProc keyboardCallback;
    private static int pressedModifierMask = 0;
    private static readonly object keyboardLock = new object();
    private static readonly HashSet<int> pressedKeys = new HashSet<int>();
    private static readonly Dictionary<int, List<string>> activeKeys =
        new Dictionary<int, List<string>>();
    private static List<KeyboardBinding> keyboardBindings =
        new List<KeyboardBinding>();

    private sealed class KeyboardBinding {
        public string Accelerator;
        public int Key;
        public int Modifiers;
    }

    public static void SetKeyboardBindings(string value) {
        List<KeyboardBinding> next = new List<KeyboardBinding>();
        foreach (string rawAccelerator in (value ?? "").Split(';')) {
            string accelerator = rawAccelerator.Trim();
            if (accelerator.Length == 0) continue;
            string[] parts = accelerator.Split('+');
            int modifiers = 0;
            int key = 0;
            int lastModifier = 0;
            foreach (string rawPart in parts) {
                string part = rawPart.Trim();
                int modifier = ModifierNameMask(part);
                if (modifier != 0) {
                    modifiers |= modifier;
                    lastModifier = modifier;
                } else {
                    key = VirtualKey(part);
                }
            }
            if (key == 0 && lastModifier != 0) {
                key = ModifierVirtualKey(lastModifier);
                modifiers &= ~lastModifier;
            }
            if (key != 0) {
                next.Add(new KeyboardBinding {
                    Accelerator = accelerator,
                    Key = key,
                    Modifiers = modifiers
                });
            }
        }
        lock (keyboardLock) {
            keyboardBindings = next;
            pressedKeys.Clear();
            activeKeys.Clear();
            pressedModifierMask = 0;
        }
    }

    private static int ModifierNameMask(string value) {
        if (String.Equals(value, "Shift", StringComparison.OrdinalIgnoreCase)) return 1;
        if (String.Equals(value, "Ctrl", StringComparison.OrdinalIgnoreCase)
            || String.Equals(value, "Control", StringComparison.OrdinalIgnoreCase)) return 2;
        if (String.Equals(value, "Alt", StringComparison.OrdinalIgnoreCase)) return 4;
        if (String.Equals(value, "Meta", StringComparison.OrdinalIgnoreCase)
            || String.Equals(value, "Command", StringComparison.OrdinalIgnoreCase)
            || String.Equals(value, "Super", StringComparison.OrdinalIgnoreCase)) return 8;
        return 0;
    }

    private static int ModifierVirtualKey(int mask) {
        if (mask == 1) return 0x10;
        if (mask == 2) return 0x11;
        if (mask == 4) return 0x12;
        if (mask == 8) return 0x5B;
        return 0;
    }

    private static int VirtualKey(string value) {
        string key = (value ?? "").Trim();
        if (key.Length == 1) {
            char character = Char.ToUpperInvariant(key[0]);
            if ((character >= 'A' && character <= 'Z')
                || (character >= '0' && character <= '9')) return (int) character;
            if (character == ';') return 0xBA;
            if (character == '=') return 0xBB;
            if (character == ',') return 0xBC;
            if (character == '-') return 0xBD;
            if (character == '.') return 0xBE;
            if (character == '/') return 0xBF;
            if (character == (char) 0x60) return 0xC0;
            if (character == '[') return 0xDB;
            if (character == (char) 0x5C) return 0xDC;
            if (character == ']') return 0xDD;
            if (character == (char) 0x27) return 0xDE;
        }
        if (String.Equals(key, "Space", StringComparison.OrdinalIgnoreCase)) return 0x20;
        if (String.Equals(key, "Tab", StringComparison.OrdinalIgnoreCase)) return 0x09;
        if (String.Equals(key, "Enter", StringComparison.OrdinalIgnoreCase)
            || String.Equals(key, "Return", StringComparison.OrdinalIgnoreCase)) return 0x0D;
        if (String.Equals(key, "Escape", StringComparison.OrdinalIgnoreCase)
            || String.Equals(key, "Esc", StringComparison.OrdinalIgnoreCase)) return 0x1B;
        if (String.Equals(key, "Up", StringComparison.OrdinalIgnoreCase)) return 0x26;
        if (String.Equals(key, "Down", StringComparison.OrdinalIgnoreCase)) return 0x28;
        if (String.Equals(key, "Left", StringComparison.OrdinalIgnoreCase)) return 0x25;
        if (String.Equals(key, "Right", StringComparison.OrdinalIgnoreCase)) return 0x27;
        if (String.Equals(key, "Home", StringComparison.OrdinalIgnoreCase)) return 0x24;
        if (String.Equals(key, "End", StringComparison.OrdinalIgnoreCase)) return 0x23;
        if (String.Equals(key, "PageUp", StringComparison.OrdinalIgnoreCase)) return 0x21;
        if (String.Equals(key, "PageDown", StringComparison.OrdinalIgnoreCase)) return 0x22;
        if (String.Equals(key, "Delete", StringComparison.OrdinalIgnoreCase)) return 0x2E;
        if (String.Equals(key, "Backspace", StringComparison.OrdinalIgnoreCase)) return 0x08;
        if (String.Equals(key, "Insert", StringComparison.OrdinalIgnoreCase)) return 0x2D;
        if (key.Length >= 2 && (key[0] == 'F' || key[0] == 'f')) {
            int number;
            if (Int32.TryParse(key.Substring(1), out number)
                && number >= 1 && number <= 24) return 0x70 + number - 1;
        }
        return 0;
    }

    private static int ModifierMask(int virtualKey) {
        if (virtualKey == 0x10 || virtualKey == 0xA0 || virtualKey == 0xA1) return 1;
        if (virtualKey == 0x11 || virtualKey == 0xA2 || virtualKey == 0xA3) return 2;
        if (virtualKey == 0x12 || virtualKey == 0xA4 || virtualKey == 0xA5) return 4;
        if (virtualKey == 0x5B || virtualKey == 0x5C) return 8;
        return 0;
    }

    private static bool KeyMatches(int configuredKey, int actualKey) {
        int configuredModifier = ModifierMask(configuredKey);
        return configuredModifier != 0
            ? configuredModifier == ModifierMask(actualKey)
            : configuredKey == actualKey;
    }

    private static void EmitKey(string phase, string accelerator) {
        Console.Out.WriteLine("K|" + phase + "|" + accelerator);
        Console.Out.Flush();
    }

    private static bool ParentHasFocus() {
        IntPtr foreground = GetForegroundWindow();
        if (foreground == IntPtr.Zero || keyboardParent == IntPtr.Zero) {
            return false;
        }
        return foreground == keyboardParent
            || IsChild(keyboardParent, foreground)
            || GetAncestor(foreground, 2) == GetAncestor(keyboardParent, 2);
    }

    private static IntPtr OnKeyboard(
        int code, IntPtr wParam, IntPtr lParam
    ) {
        const int HC_ACTION = 0;
        const int WM_KEYDOWN = 0x0100;
        const int WM_KEYUP = 0x0101;
        const int WM_SYSKEYDOWN = 0x0104;
        const int WM_SYSKEYUP = 0x0105;

        if (code == HC_ACTION && ParentHasFocus()) {
            int message = wParam.ToInt32();
            int virtualKey = Marshal.ReadInt32(lParam);
            int modifier = ModifierMask(virtualKey);
            bool down = message == WM_KEYDOWN || message == WM_SYSKEYDOWN;
            bool up = message == WM_KEYUP || message == WM_SYSKEYUP;
            if (down || up) {
                lock (keyboardLock) {
                    if (down) {
                        if (pressedKeys.Contains(virtualKey)) {
                            if (activeKeys.ContainsKey(virtualKey)) return new IntPtr(1);
                            return CallNextHookEx(keyboardHook, code, wParam, lParam);
                        }
                        pressedKeys.Add(virtualKey);
                        if (modifier != 0) pressedModifierMask |= modifier;

                        List<string> matched = new List<string>();
                        foreach (KeyboardBinding binding in keyboardBindings) {
                            if (KeyMatches(binding.Key, virtualKey)
                                && binding.Modifiers
                                    == (pressedModifierMask & ~modifier)) {
                                matched.Add(binding.Accelerator);
                            }
                        }
                        if (matched.Count > 0) {
                            activeKeys[virtualKey] = matched;
                            foreach (string accelerator in matched) {
                                EmitKey("D", accelerator);
                            }
                            return new IntPtr(1);
                        }
                    }
                    if (up) {
                        List<string> active;
                        bool handled = activeKeys.TryGetValue(virtualKey, out active);
                        if (handled) {
                            foreach (string accelerator in active) {
                                EmitKey("U", accelerator);
                            }
                            activeKeys.Remove(virtualKey);
                        }
                        pressedKeys.Remove(virtualKey);
                        if (modifier != 0) pressedModifierMask &= ~modifier;
                        if (handled) return new IntPtr(1);
                    }
                }
            }
        }
        return CallNextHookEx(keyboardHook, code, wParam, lParam);
    }

    public static void StartKeyboardHook(IntPtr parent) {
        keyboardParent = parent;
        Thread thread = new Thread(delegate() {
            keyboardCallback = OnKeyboard;
            keyboardHook = SetWindowsHookEx(
                13, keyboardCallback, GetModuleHandle(null), 0
            );
            MSG message;
            while (keyboardHook != IntPtr.Zero
                && GetMessage(out message, IntPtr.Zero, 0, 0) > 0) {
                TranslateMessage(ref message);
                DispatchMessage(ref message);
            }
            if (keyboardHook != IntPtr.Zero) {
                UnhookWindowsHookEx(keyboardHook);
                keyboardHook = IntPtr.Zero;
            }
        });
        thread.IsBackground = true;
        thread.Start();
    }

    public static bool PostMouseMessage(
        IntPtr window,
        uint message,
        uint buttonState,
        int x,
        int y
    ) {
        if (message == 0x0201 || message == 0x0204) {
            SetFocus(window);
        }
        long packedPoint = ((long) (y & 0xffff) << 16) | (uint) (x & 0xffff);
        return PostMessage(
            window,
            message,
            new IntPtr((long) buttonState),
            new IntPtr(packedPoint)
        );
    }

    [DllImport("user32.dll", SetLastError = true)]
    public static extern IntPtr SetProcessDpiAwarenessContext(IntPtr value);

    [DllImport("dwmapi.dll")]
    public static extern int DwmSetWindowAttribute(
        IntPtr window, int attribute, ref int value, int size
    );

    public static IntPtr FindVisibleScrcpyChild(IntPtr parent) {
        const int GWL_STYLE = -16;
        const long WS_VISIBLE = 0x10000000L;
        IntPtr result = IntPtr.Zero;

        EnumChildWindows(parent, delegate(IntPtr window, IntPtr value) {
            uint processId;
            GetWindowThreadProcessId(window, out processId);

            try {
                using (Process process = Process.GetProcessById((int)processId)) {
                    if (!String.Equals(
                        process.ProcessName,
                        "scrcpy",
                        StringComparison.OrdinalIgnoreCase
                    )) {
                        return true;
                    }
                }
            }
            catch {
                return true;
            }

            long style = GetWindowLongPtr(window, GWL_STYLE).ToInt64();
            if ((style & WS_VISIBLE) == 0) {
                return true;
            }

            RECT rect;
            if (!GetClientRect(window, out rect)
                || rect.Right - rect.Left <= 1
                || rect.Bottom - rect.Top <= 1) {
                return true;
            }

            result = window;
            return false;
        }, IntPtr.Zero);

        return result;
    }
}
'@

Add-Type -TypeDefinition $source

try {
    [EscrcpyNativeContainer]::SetProcessDpiAwarenessContext([IntPtr]::new(-4)) | Out-Null
}
catch {}

$container = [IntPtr]::new([Int64]${containerHandle})
$expectedContainerProcessId = [uint32]${containerProcessId}
$target = [IntPtr]::Zero
$deadline = [DateTime]::UtcNow.AddSeconds(15)

# Use the same DWM-owned outer frame as the main application window. This
# clips the Electron surface and the native SDL child as one container.
try {
    $cornerPreference = 2 # DWMWCP_ROUND
    [EscrcpyNativeContainer]::DwmSetWindowAttribute(
        $container,
        33, # DWMWA_WINDOW_CORNER_PREFERENCE
        [ref]$cornerPreference,
        4
    ) | Out-Null
}
catch {}

[EscrcpyNativeContainer]::StartKeyboardHook($container)

while ($target -eq [IntPtr]::Zero) {
    $actualContainerProcessId = [uint32]0
    [EscrcpyNativeContainer]::GetWindowThreadProcessId(
        $container,
        [ref]$actualContainerProcessId
    ) | Out-Null

    if (
        -not [EscrcpyNativeContainer]::IsWindow($container) -or
        $actualContainerProcessId -ne $expectedContainerProcessId
    ) {
        exit 0
    }

    if ([DateTime]::UtcNow -ge $deadline) {
        throw 'Timed out waiting for the embedded scrcpy child window.'
    }

    $target = [EscrcpyNativeContainer]::FindVisibleScrcpyChild($container)

    if ($target -eq [IntPtr]::Zero) {
        Start-Sleep -Milliseconds 25
    }
}

$client = [EscrcpyNativeContainer+RECT]::new()
[EscrcpyNativeContainer]::GetClientRect($target, [ref]$client) | Out-Null
$sourceWidth = [Math]::Max(1, $client.Right - $client.Left)
$sourceHeight = [Math]::Max(1, $client.Bottom - $client.Top)
$inputOffsetX = 0
$inputOffsetY = 0

$attached = 'A|{0}|{1}' -f $sourceWidth, $sourceHeight
[Console]::Out.WriteLine($attached)

while (($command = [Console]::In.ReadLine()) -ne $null) {
    $parts = $command.Split('|')

    if ($parts[0] -eq 'S' -and $parts.Length -eq 5) {
        $containerClient = [EscrcpyNativeContainer+RECT]::new()
        [EscrcpyNativeContainer]::GetClientRect(
            $container,
            [ref]$containerClient
        ) | Out-Null
        $titleHeight = [int]$parts[1]
        $toolbarWidth = [int]$parts[2]
        $containerBorder = [int]$parts[3]
        $containVideo = [int]$parts[4] -eq 1
        try {
            $cornerPreference = if ($containVideo) { 1 } else { 2 }
            [EscrcpyNativeContainer]::DwmSetWindowAttribute(
                $container,
                33,
                [ref]$cornerPreference,
                4
            ) | Out-Null
        }
        catch {}
        $targetWindow = [EscrcpyNativeContainer+RECT]::new()
        $targetClient = [EscrcpyNativeContainer+RECT]::new()
        $clientOrigin = [EscrcpyNativeContainer+POINT]::new()
        [EscrcpyNativeContainer]::GetWindowRect(
            $target,
            [ref]$targetWindow
        ) | Out-Null
        [EscrcpyNativeContainer]::GetClientRect(
            $target,
            [ref]$targetClient
        ) | Out-Null
        [EscrcpyNativeContainer]::ClientToScreen(
            $target,
            [ref]$clientOrigin
        ) | Out-Null
        $borderLeft = $clientOrigin.X - $targetWindow.Left
        $borderTop = $clientOrigin.Y - $targetWindow.Top
        $borderRight = $targetWindow.Right - (
            $clientOrigin.X + $targetClient.Right
        )
        $borderBottom = $targetWindow.Bottom - (
            $clientOrigin.Y + $targetClient.Bottom
        )
        $videoWidth = [Math]::Max(
            1,
            $containerClient.Right - $toolbarWidth - 2 * $containerBorder
        )
        $videoHeight = [Math]::Max(
            1,
            $containerClient.Bottom - $titleHeight - 2 * $containerBorder
        )

        if ($containVideo) {
            # Maximized/fullscreen windows keep every source pixel visible.
            # The opaque container base supplies any required letterbox area.
            $videoScale = [Math]::Min(
                $videoWidth / [Math]::Max(1, $sourceWidth),
                $videoHeight / [Math]::Max(1, $sourceHeight)
            )
            $childWidth = [Math]::Max(
                1,
                [Math]::Floor($sourceWidth * $videoScale)
            )
            $childHeight = [Math]::Max(
                1,
                [Math]::Floor($sourceHeight * $videoScale)
            )
            $childX = $containerBorder + [Math]::Floor(
                ($videoWidth - $childWidth) / 2
            )
            $childY = $titleHeight + $containerBorder + [Math]::Floor(
                ($videoHeight - $childHeight) / 2
            )
            # The transparent input overlay is trimmed to this exact child
            # rectangle, so its pointer coordinates already start at (0, 0).
            $inputOffsetX = 0
            $inputOffsetY = 0
        }
        else {
            # Normal windows use cover so transient native resizing never
            # exposes grey bars at either side.
            $videoScale = [Math]::Max(
                $videoWidth / [Math]::Max(1, $sourceWidth),
                $videoHeight / [Math]::Max(1, $sourceHeight)
            )
            $childWidth = [Math]::Max(
                $videoWidth,
                [Math]::Ceiling($sourceWidth * $videoScale)
            )
            $childHeight = [Math]::Max(
                $videoHeight,
                [Math]::Ceiling($sourceHeight * $videoScale)
            )
            $childX = $containerBorder - [Math]::Floor(
                ($childWidth - $videoWidth) / 2
            )
            # Never extend the native child into the title bar.
            $childY = $titleHeight + $containerBorder
            $inputOffsetX = $containerBorder - $childX
            $inputOffsetY = 0
        }
        $windowX = $childX - $borderLeft
        $windowY = $childY - $borderTop

        [EscrcpyNativeContainer]::SetWindowPos(
            $target,
            [IntPtr]::Zero,
            $windowX,
            $windowY,
            $childWidth + $borderLeft + $borderRight,
            $childHeight + $borderTop + $borderBottom,
            0x0050
        ) | Out-Null

        $clipRegion = [EscrcpyNativeContainer]::CreateRectRgn(
            $containerBorder - $windowX,
            $titleHeight + $containerBorder - $windowY,
            $containerBorder + $videoWidth - $windowX,
            $titleHeight + $containerBorder + $videoHeight - $windowY
        )
        if ($clipRegion -ne [IntPtr]::Zero) {
            $clipResult = [EscrcpyNativeContainer]::SetWindowRgn(
                $target,
                $clipRegion,
                $true
            )
            if ($clipResult -eq 0) {
                [EscrcpyNativeContainer]::DeleteObject($clipRegion) | Out-Null
            }
        }
    }
    elseif ($parts[0] -eq 'V' -and $parts.Length -eq 3) {
        $sourceWidth = [Math]::Max(1, [int]$parts[1])
        $sourceHeight = [Math]::Max(1, [int]$parts[2])
    }
    elseif ($parts[0] -eq 'Z' -and $parts.Length -eq 2) {
        # A Chromium overlay (the mapping menu/editor) must receive pointer
        # events while it is visible. Keep scrcpy above the renderer normally,
        # but put it below the renderer for that short, explicit interval.
        $insertAfter = if ($parts[1] -eq '1') { [IntPtr]::new(1) } else { [IntPtr]::Zero }
        [EscrcpyNativeContainer]::SetWindowPos(
            $target,
            $insertAfter,
            0,
            0,
            0,
            0,
            0x0013
        ) | Out-Null
    }
    elseif ($parts[0] -eq 'M' -and $parts.Length -eq 6) {
        [EscrcpyNativeContainer]::PostMouseMessage(
            $target,
            [uint32]$parts[1],
            [uint32]$parts[2],
            [int]$parts[3] + $inputOffsetX,
            [int]$parts[4] + $inputOffsetY
        ) | Out-Null
    }
    elseif ($parts[0] -eq 'B' -and $parts.Length -eq 2) {
        [EscrcpyNativeContainer]::SetKeyboardBindings($parts[1])
    }
    elseif ($parts[0] -eq 'C') {
        [EscrcpyNativeContainer]::PostMessage(
            $target,
            0x0010,
            [IntPtr]::Zero,
            [IntPtr]::Zero
        ) | Out-Null
        break
    }
    elseif ($parts[0] -eq 'Q') {
        break
    }
}
`
}

function flagEnabled(args, name) {
  const escapedName = name.replaceAll('-', '\\-')
  const enabled = new RegExp(`(?:^|\\s)--${escapedName}(?:=true)?(?=\\s|$)`).test(args)
  const disabled = new RegExp(`(?:^|\\s)--no-${escapedName}(?=\\s|$)`).test(args)
  return enabled && !disabled
}

function clampBounds(bounds, workArea) {
  return {
    ...bounds,
    x: Math.min(Math.max(bounds.x, workArea.x), workArea.x + workArea.width - bounds.width),
    y: Math.min(Math.max(bounds.y, workArea.y), workArea.y + workArea.height - bounds.height),
  }
}

export async function embedNativeWindow(win, { targetWindowTitle, scrcpyArgs = '' } = {}) {
  if (process.platform !== 'win32' || !targetWindowTitle) {
    return null
  }

  const state = {
    attached: false,
    closing: false,
    editorWidth: 0,
    expanded: false,
    popoverOpen: false,
    layoutPending: false,
    process: null,
    sourcePixelWidth: 0,
    sourcePixelHeight: 0,
  }

  win.setOpacity(0)
  win.setTitle(targetWindowTitle)
  win.setAlwaysOnTop(flagEnabled(scrcpyArgs, 'always-on-top'))

  const script = createChildWatcherScript(
    getNativeParentWindowHandle(win),
    process.pid,
  )
  // Passing the whole watcher through -EncodedCommand exceeds Windows' command
  // line limit once the helper grows beyond a few dozen KB. Keep stdin free for
  // its live layout commands and execute a short-lived temporary script file.
  const scriptDirectory = await mkdtemp(join(tmpdir(), 'escrcpy-native-container-'))
  const scriptPath = join(scriptDirectory, 'watcher.ps1')
  await writeFile(scriptPath, `\uFEFF${script}`, 'utf8')
  const helper = spawn('powershell.exe', [
    '-NoLogo',
    '-NoProfile',
    '-NonInteractive',
    '-ExecutionPolicy',
    'Bypass',
    '-File',
    scriptPath,
  ], {
    windowsHide: true,
    stdio: ['pipe', 'pipe', 'pipe'],
  })

  state.process = helper
  state.scriptDirectory = scriptDirectory
  containerStates.set(win, state)

  let output = ''
  let helperError = ''

  function send(command) {
    if (!helper.killed && helper.stdin.writable) {
      helper.stdin.write(`${command}\n`)
    }
  }

  function layout() {
    if (!state.attached || win.isDestroyed()) {
      return
    }

    const display = screen.getDisplayNearestPoint(win.getBounds())
    const scaleFactor = display.scaleFactor || 1
    send([
      'S',
      Math.round(controlTitleBarHeight * scaleFactor),
      Math.round((controlBarWidth + state.editorWidth) * scaleFactor),
      state.expanded ? 0 : Math.max(1, Math.round(scaleFactor)),
      state.expanded ? 1 : 0,
    ].join('|'))

    send(`Z|${state.editorOpen ? 1 : 0}`)
  }

  function scheduleLayout() {
    if (state.layoutPending) {
      return
    }

    state.layoutPending = true
    setImmediate(() => {
      state.layoutPending = false
      layout()
    })
  }

  function restoreChildZOrder() {
    if (!state.attached || win.isDestroyed()) {
      return
    }

    send(`Z|${state.editorOpen ? 1 : 0}`)
  }

  function syncWindowState() {
    if (win.isDestroyed())
      return

    state.expanded = win.isMaximized() || win.isFullScreen()
    win.webContents.send('control:window-state', {
      expanded: state.expanded,
    })
    win.emit('control-video-bounds-changed')
    scheduleLayout()
  }

  function handleAttached(parts) {
    const values = parts.slice(1).map(Number)

    if (values.length !== 2 || !values.every(Number.isFinite) || win.isDestroyed()) {
      return
    }

    const [attachedPixelWidth, attachedPixelHeight] = values
    const sourcePixelWidth = state.sourcePixelWidth || attachedPixelWidth
    const sourcePixelHeight = state.sourcePixelHeight || attachedPixelHeight
    state.sourcePixelWidth = sourcePixelWidth
    state.sourcePixelHeight = sourcePixelHeight
    win.emit('control-video-bounds-changed')
    send(`V|${sourcePixelWidth}|${sourcePixelHeight}`)
    const currentBounds = win.getBounds()
    const display = screen.getDisplayNearestPoint(currentBounds)
    const { scaleFactor = 1, workArea } = display
    const sourceWidth = Math.max(1, sourcePixelWidth / scaleFactor)
    const sourceHeight = Math.max(1, sourcePixelHeight / scaleFactor)
    win.setAspectRatio(sourcePixelWidth / sourcePixelHeight, {
      // Electron already accounts for the native resize frame. extraSize is
      // only the part of our content which is not video.
      width: controlBarWidth,
      height: controlTitleBarHeight,
    })
    const availableVideoWidth = Math.max(1, workArea.width - controlBarWidth)
    const availableVideoHeight = Math.max(1, workArea.height - controlTitleBarHeight)
    const fitScale = Math.min(
      1,
      availableVideoWidth / sourceWidth,
      availableVideoHeight / sourceHeight,
    )
    const width = Math.round(sourceWidth * fitScale) + controlBarWidth
    const height = Math.round(sourceHeight * fitScale) + controlTitleBarHeight
    const bounds = clampBounds({
      x: currentBounds.x,
      y: currentBounds.y,
      width,
      height,
    }, workArea)

    state.attached = true
    win.setContentBounds(bounds)
    layout()
    win.setOpacity(1)
    win.show()
    win.focus()

    if (flagEnabled(scrcpyArgs, 'fullscreen')) {
      win.setFullScreen(true)
    }
  }

  function handleLine(line) {
    const parts = line.trim().split('|')

    if (parts[0] === 'A') {
      handleAttached(parts)
    }
    else if (parts[0] === 'K' && parts.length === 3 && !win.isDestroyed()) {
      win.webContents.send('keyboard-mapping:native-key', {
        phase: parts[1] === 'U' ? 'up' : 'down',
        accelerator: parts[2],
      })
    }
  }

  helper.stdout.on('data', (data) => {
    output += data.toString()
    const lines = output.split(/\r?\n/)
    output = lines.pop() || ''

    for (const line of lines) {
      handleLine(line)
    }
  })

  helper.stderr.on('data', (data) => {
    helperError += data.toString()
  })

  helper.once('error', (error) => {
    console.warn('[control-window] Native child watcher failed:', error.message)
  })

  helper.once('exit', (code) => {
    rm(scriptDirectory, { recursive: true, force: true }).catch(() => {})
    if (!state.closing && code !== 0) {
      console.warn(
        '[control-window] Native child watcher exited:',
        helperError.trim() || code,
      )
    }
  })

  win.on('resize', scheduleLayout)
  // A native child normally follows its parent move without a layout event,
  // but explicitly refreshing its region avoids SDL exposing a stale
  // letterbox frame while Windows is dragging the transparent container.
  win.on('move', scheduleLayout)
  win.on('focus', restoreChildZOrder)
  win.on('show', restoreChildZOrder)
  win.on('restore', restoreChildZOrder)
  win.on('maximize', syncWindowState)
  win.on('unmaximize', syncWindowState)
  win.on('enter-full-screen', syncWindowState)
  win.on('leave-full-screen', syncWindowState)
  win.webContents.on('did-finish-load', syncWindowState)

  state.layout = scheduleLayout
  state.send = send

  return state
}

export function setKeyboardMappingEditorOpen(win, open) {
  const state = containerStates.get(win)

  if (!state) {
    return false
  }

  // The editor is now an overlay on top of the video, rather than a side
  // panel, so it must not change the scrcpy viewport geometry.
  state.editorWidth = 0
  state.editorOpen = Boolean(open)
  state.layout?.()
  state.send?.(`Z|${state.editorOpen ? 1 : 0}`)
  return true
}

export function setKeyboardMappingOverlayOpen(win, open) {
  const state = containerStates.get(win)

  if (!state) {
    return false
  }

  state.popoverOpen = Boolean(open)
  // The profile popup is an independent BrowserWindow, so it does not need
  // to alter the embedded video's z-order or geometry.
  return true
}

export function setNativeKeyBindings(win, accelerators = []) {
  const state = containerStates.get(win)
  if (!state)
    return false
  state.send?.(`B|${accelerators.join(';')}`)
  return true
}

export function getEmbeddedVideoBounds(win) {
  const state = containerStates.get(win)

  if (!state || win.isDestroyed())
    return null

  const bounds = win.getContentBounds()
  const border = state.expanded ? 0 : 1
  const viewport = {
    x: bounds.x + border,
    y: bounds.y + controlTitleBarHeight + border,
    width: Math.max(1, bounds.width - controlBarWidth - 2 * border),
    height: Math.max(1, bounds.height - controlTitleBarHeight - 2 * border),
  }

  if (!state.expanded || !state.sourcePixelWidth || !state.sourcePixelHeight)
    return viewport

  const sourceRatio = state.sourcePixelWidth / state.sourcePixelHeight
  const viewportRatio = viewport.width / viewport.height

  if (viewportRatio > sourceRatio) {
    const width = Math.max(1, Math.floor(viewport.height * sourceRatio))
    return {
      x: viewport.x + Math.floor((viewport.width - width) / 2),
      y: viewport.y,
      width,
      height: viewport.height,
    }
  }

  const height = Math.max(1, Math.floor(viewport.width / sourceRatio))
  return {
    x: viewport.x,
    y: viewport.y + Math.floor((viewport.height - height) / 2),
    width: viewport.width,
    height,
  }
}

export function setEmbeddedVideoSize(win, width, height) {
  const state = containerStates.get(win)
  const sourcePixelWidth = Math.round(Number(width))
  const sourcePixelHeight = Math.round(Number(height))

  if (!state
    || sourcePixelWidth <= 0
    || sourcePixelHeight <= 0
    || (state.sourcePixelWidth === sourcePixelWidth
      && state.sourcePixelHeight === sourcePixelHeight)) {
    return false
  }

  state.sourcePixelWidth = sourcePixelWidth
  state.sourcePixelHeight = sourcePixelHeight
  win.emit('control-video-bounds-changed')

  // scrcpy may print its Texture size just before the helper reports that the
  // HWND has attached. Keep it and let handleAttached apply it in that case.
  if (!state.attached) {
    return true
  }

  state.send?.(`V|${sourcePixelWidth}|${sourcePixelHeight}`)
  win.setAspectRatio(sourcePixelWidth / sourcePixelHeight, {
    width: controlBarWidth,
    height: controlTitleBarHeight,
  })

  // Snap the current content rectangle to the real video ratio immediately;
  // this also removes any letterbox produced before scrcpy reported Texture.
  const bounds = win.getContentBounds()
  const videoWidth = Math.max(1, bounds.width - controlBarWidth)
  const videoHeight = Math.max(1, bounds.height - controlTitleBarHeight)
  const heightFromWidth = Math.round(videoWidth * sourcePixelHeight / sourcePixelWidth)
  const widthFromHeight = Math.round(videoHeight * sourcePixelWidth / sourcePixelHeight)
  const nextBounds = Math.abs(heightFromWidth - videoHeight)
    <= Math.abs(widthFromHeight - videoWidth)
    ? { ...bounds, height: heightFromWidth + controlTitleBarHeight }
    : { ...bounds, width: widthFromHeight + controlBarWidth }

  win.setContentBounds(nextBounds)
  state.layout?.()
  return true
}

export function forwardNativePointer(win, payload = {}) {
  const state = containerStates.get(win)

  if (!state?.attached || state.editorOpen) {
    return false
  }

  const messageMap = {
    move: 0x0200,
    leftDown: 0x0201,
    leftUp: 0x0202,
    rightDown: 0x0204,
    rightUp: 0x0205,
  }
  const message = messageMap[payload.type]
  const x = Math.max(0, Math.round(Number(payload.x) || 0))
  const y = Math.max(0, Math.round(Number(payload.y) || 0))
  const buttonState = Math.max(0, Math.round(Number(payload.buttonState) || 0))

  if (!message) {
    return false
  }

  // The final field is reserved so the PowerShell command has a stable shape
  // if wheel/button metadata is added later.
  state.send?.(`M|${message}|${buttonState}|${x}|${y}|0`)
  return true
}

export function closeEmbeddedWindow(win) {
  const state = containerStates.get(win)

  if (!state || state.closing) {
    return false
  }

  state.closing = true
  state.send?.('C')
  return true
}

export function disposeEmbeddedWindow(win) {
  const state = containerStates.get(win)

  if (!state) {
    return
  }

  const closeWasRequested = state.closing
  state.closing = true

  if (!closeWasRequested) {
    state.send?.('Q')
  }

  setTimeout(() => {
    if (!state.process?.killed) {
      state.process?.kill()
    }
  }, closeWasRequested ? 500 : 50)

  containerStates.delete(win)
}
