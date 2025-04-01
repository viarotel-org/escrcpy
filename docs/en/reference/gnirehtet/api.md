---
title: API
---

# Gnirehtet API

`gnirehtet` is a tool used to enable reverse tethering on Android devices, allowing the device to share the computer's internet connection via USB. Below is the detailed usage of each command along with examples.

## gnirehtet install [serial]

**Description**: Install the client on the specified Android device and exit. If multiple devices are connected, the `serial` parameter must be provided.

**Example Usage**:
```bash
gnirehtet install
```
If multiple devices are connected, specify the device:
```bash
gnirehtet install 1234567890ABCDEF
```

## gnirehtet uninstall [serial]

**Description**: Uninstall the client from the specified Android device and exit. If multiple devices are connected, the `serial` parameter must be provided.

**Example Usage**:
```bash
gnirehtet uninstall
```
If multiple devices are connected, specify the device:
```bash
gnirehtet uninstall 1234567890ABCDEF
```

## gnirehtet reinstall [serial]

**Description**: Uninstall then install the client.

**Example Usage**:
```bash
gnirehtet reinstall
```
If multiple devices are connected, specify the device:
```bash
gnirehtet reinstall 1234567890ABCDEF
```

## gnirehtet run [serial] [-d DNS[,DNS2,...]] [-p PORT] [-r ROUTE[,ROUTE2,...]]

**Description**: Enable reverse tethering for exactly one device:
- Install the client if necessary.
- Start the client.
- Start the relay server.
- On Ctrl+C, stop both the relay server and the client.

**Example Usage**:
```bash
gnirehtet run
```
Specify DNS:
```bash
gnirehtet run -d 8.8.8.8,8.8.4.4
```
Specify port:
```bash
gnirehtet run -p 8080
```
Specify route:
```bash
gnirehtet run -r 192.168.1.0/24
```

## gnirehtet autorun [-d DNS[,DNS2,...]] [-p PORT] [-r ROUTE[,ROUTE2,...]]

**Description**: Enable reverse tethering for all devices:
- Monitor devices and start clients (autostart).
- Start the relay server.

**Example Usage**:
```bash
gnirehtet autorun
```
Specify DNS:
```bash
gnirehtet autorun -d 8.8.8.8,8.8.4.4
```
Specify port:
```bash
gnirehtet autorun -p 8080
```
Specify route:
```bash
gnirehtet autorun -r 192.168.1.0/24
```

## gnirehtet start [serial] [-d DNS[,DNS2,...]] [-p PORT] [-r ROUTE[,ROUTE2,...]]

**Description**: Start a client on the Android device and exit.
- If `-d` is specified, the device will use the specified DNS servers.
- If `-r` is specified, only reverse tether the specified routes.
- If `-p` is specified, the relay server will listen on the specified port.

**Example Usage**:
```bash
gnirehtet start
```
Specify device serial:
```bash
gnirehtet start 1234567890ABCDEF
```
Specify DNS:
```bash
gnirehtet start -d 8.8.8.8,8.8.4.4
```
Specify port:
```bash
gnirehtet start -p 8080
```
Specify route:
```bash
gnirehtet start -r 192.168.1.0/24
```

## gnirehtet autostart [-d DNS[,DNS2,...]] [-p PORT] [-r ROUTE[,ROUTE2,...]]

**Description**: Listen for device connections and start a client on each detected device.
- Accepts the same parameters as the `start` command (excluding the serial, which will be taken from the detected device).

**Example Usage**:
```bash
gnirehtet autostart
```
Specify DNS:
```bash
gnirehtet autostart -d 8.8.8.8,8.8.4.4
```
Specify port:
```bash
gnirehtet autostart -p 8080
```
Specify route:
```bash
gnirehtet autostart -r 192.168.1.0/24
```

## gnirehtet stop [serial]

**Description**: Stop the client on the specified Android device and exit.

**Example Usage**:
```bash
gnirehtet stop
```
Specify device serial:
```bash
gnirehtet stop 1234567890ABCDEF
```

## gnirehtet restart [serial] [-d DNS[,DNS2,...]] [-p PORT] [-r ROUTE[,ROUTE2,...]]

**Description**: Stop the current client and restart it.

**Example Usage**:
```bash
gnirehtet restart
```
Specify device serial:
```bash
gnirehtet restart 1234567890ABCDEF
```
Specify DNS:
```bash
gnirehtet restart -d 8.8.8.8,8.8.4.4
```
Specify port:
```bash
gnirehtet restart -p 8080
```
Specify route:
```bash
gnirehtet restart -r 192.168.1.0/24
```

## gnirehtet tunnel [serial] [-p PORT]

**Description**: Set up the `adb reverse` tunnel. If a device is unplugged and plugged back in while gnirehtet is active, resetting the tunnel will restore the connection.

**Example Usage**:
```bash
gnirehtet tunnel
```
Specify device serial:
```bash
gnirehtet tunnel 1234567890ABCDEF
```
Specify port:
```bash
gnirehtet tunnel -p 8080
```

## gnirehtet relay [-p PORT]

**Description**: Start the relay server in the current terminal.

**Example Usage**:
```bash
gnirehtet relay
```
Specify port:
```bash
gnirehtet relay -p 8080
```