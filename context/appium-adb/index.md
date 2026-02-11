# appium-adb

Appium ADB is a comprehensive wrapper over the Android Debug Bridge (ADB) implemented in TypeScript with async/await support. It provides a complete interface for interacting with Android devices and emulators, enabling device management, application installation, file system operations, shell command execution, and emulator control. This package is primarily used by Appium to perform all ADB operations on Android devices but can be used independently for Android automation and testing tasks.

The library exposes a main `ADB` class that encapsulates all ADB functionality including device connection management, application lifecycle control, APK installation and signing, keyboard/input management, device settings manipulation, network configuration, logcat streaming, and emulator-specific commands like GSM/SMS simulation. It supports both real devices and emulators, with specialized APIs for each platform.

## Creating ADB Instance

The main entry point for using the library. Creates and initializes an ADB instance with optional configuration options.

```javascript
import { ADB } from 'appium-adb';

// Basic initialization
const adb = await ADB.createADB();

// With custom options
const adb = await ADB.createADB({
  sdkRoot: '/path/to/android/sdk',
  udid: 'emulator-5554',
  adbPort: 5037,
  adbExecTimeout: 60000,
  suppressKillServer: false,
  remoteAdbHost: '192.168.1.100',
  allowOfflineDevices: false
});

// Clone an existing instance with modified options
const adb2 = adb.clone({ udid: 'device-serial-2' });
```

## Getting Connected Devices

Retrieves the list of all devices visible to ADB, including both physical devices and emulators.

```javascript
import { ADB } from 'appium-adb';

const adb = await ADB.createADB();

// Get list of connected devices
const devices = await adb.getConnectedDevices();
// Returns: [{ udid: 'emulator-5554', state: 'device' }, { udid: 'ABC123', state: 'device' }]

// Get devices with verbose info
const devicesVerbose = await adb.getConnectedDevices({ verbose: true });
// Returns: [{ udid: 'emulator-5554', state: 'device', product: 'sdk_gphone', model: 'Pixel_4', device: 'generic_x86' }]

// Get devices with retry (waits up to 20 seconds)
const devicesWithRetry = await adb.getDevicesWithRetry(20000);

// Get only connected emulators
const emulators = await adb.getConnectedEmulators();
// Returns: [{ udid: 'emulator-5554', state: 'device', port: 5554 }]

// Set device for subsequent operations
adb.setDeviceId('emulator-5554');
```

## Installing and Managing Applications

Install, uninstall, and manage Android applications on devices.

```javascript
import { ADB } from 'appium-adb';

const adb = await ADB.createADB();
adb.setDeviceId('emulator-5554');

// Install an APK
await adb.install('/path/to/app.apk', {
  replace: true,           // Replace existing app
  timeout: 60000,          // Installation timeout
  allowTestPackages: true, // Allow test packages
  grantPermissions: true,  // Auto-grant runtime permissions
  noIncremental: false     // Disable incremental install
});

// Install or upgrade (smart install)
const result = await adb.installOrUpgrade('/path/to/app.apk', 'com.example.app', {
  enforceCurrentBuild: true // Force install even if same version exists
});
// Returns: { appState: 'olderVersionInstalled', wasUninstalled: false }

// Check installation state
const state = await adb.getApplicationInstallState('/path/to/app.apk', 'com.example.app');
// Returns: 'notInstalled' | 'sameVersionInstalled' | 'newerVersionInstalled' | 'olderVersionInstalled'

// Check if app is installed
const isInstalled = await adb.isAppInstalled('com.example.app');
// Returns: true or false

// Uninstall an app
const wasUninstalled = await adb.uninstallApk('com.example.app', {
  keepData: false,    // Keep app data after uninstall
  timeout: 20000
});

// Get APK info from local file
const apkInfo = await adb.getApkInfo('/path/to/app.apk');
// Returns: { name: 'com.example.app', versionCode: 1, versionName: '1.0.0' }

// Get package info from installed app
const pkgInfo = await adb.getPackageInfo('com.example.app');
// Returns: { name: 'com.example.app', versionName: '1.0.0', versionCode: 1, isInstalled: true }
```

## Starting and Managing Applications

Launch, stop, and monitor Android applications.

```javascript
import { ADB } from 'appium-adb';

const adb = await ADB.createADB();
adb.setDeviceId('emulator-5554');

// Start an application
await adb.startApp({
  pkg: 'com.example.app',
  activity: '.MainActivity',
  waitForLaunch: true,
  stopApp: true,          // Force stop before starting
  retry: true,            // Retry with modified activity name if fails
  waitActivity: '.MainActivity',
  waitDuration: 20000
});

// Activate app (bring to foreground or launch)
await adb.activateApp('com.example.app');

// Start a URI
await adb.startUri('https://example.com', 'com.android.chrome', {
  waitForLaunch: true
});

// Get focused package and activity
const focused = await adb.getFocusedPackageAndActivity();
// Returns: { appPackage: 'com.example.app', appActivity: '.MainActivity' }

// Wait for activity to appear
await adb.waitForActivity('com.example.app', '.MainActivity', 20000);

// Wait for activity to disappear
await adb.waitForNotActivity('com.example.app', '.SplashActivity', 10000);

// Force stop an application (puts in "stopped" state)
await adb.forceStop('com.example.app');

// Kill app process gracefully
await adb.killPackage('com.example.app');

// Clear app data
await adb.clear('com.example.app');

// Stop and clear app data
await adb.stopAndClear('com.example.app');

// Check if app is running
const isRunning = await adb.isAppRunning('com.example.app');

// Get process IDs for an app
const pids = await adb.listAppProcessIds('com.example.app');
// Returns: [1234, 1235]
```

## Permission Management

Grant and revoke runtime permissions for Android applications (API 23+).

```javascript
import { ADB } from 'appium-adb';

const adb = await ADB.createADB();
adb.setDeviceId('emulator-5554');

// Grant all requested permissions
await adb.grantAllPermissions('com.example.app', '/path/to/app.apk');

// Grant specific permissions
await adb.grantPermissions('com.example.app', [
  'android.permission.CAMERA',
  'android.permission.READ_CONTACTS',
  'android.permission.ACCESS_FINE_LOCATION'
]);

// Grant single permission
await adb.grantPermission('com.example.app', 'android.permission.CAMERA');

// Revoke a permission
await adb.revokePermission('com.example.app', 'android.permission.CAMERA');

// Get granted permissions
const granted = await adb.getGrantedPermissions('com.example.app');
// Returns: ['android.permission.INTERNET', 'android.permission.CAMERA']

// Get denied permissions
const denied = await adb.getDeniedPermissions('com.example.app');

// Get all requested permissions (from manifest)
const requested = await adb.getReqPermissions('com.example.app');
```

## Shell Command Execution

Execute shell commands on the connected device.

```javascript
import { ADB } from 'appium-adb';

const adb = await ADB.createADB();
adb.setDeviceId('emulator-5554');

// Execute shell command
const output = await adb.shell(['ls', '-la', '/sdcard']);

// Execute shell command with options
const result = await adb.shell(['cat', '/proc/meminfo'], {
  timeout: 10000,
  privileged: true  // Run as root if available
});

// Execute raw adb command
const version = await adb.adbExec(['version']);

// Get full output (stdout and stderr)
const fullResult = await adb.adbExec(['shell', 'ls', '/sdcard'], {
  outputFormat: 'full'
});
// Returns: { stdout: '...', stderr: '...' }

// Create a subprocess for long-running commands
const proc = adb.createSubProcess(['logcat']);
await proc.start(0);
proc.on('line-stdout', (line) => console.log(line));
// Later: proc.stop();
```

## File System Operations

Transfer files and manage the device file system.

```javascript
import { ADB } from 'appium-adb';

const adb = await ADB.createADB();
adb.setDeviceId('emulator-5554');

// Push file to device
await adb.push('/local/path/file.txt', '/sdcard/file.txt', {
  timeout: 60000
});

// Pull file from device
await adb.pull('/sdcard/file.txt', '/local/path/file.txt', {
  timeout: 60000
});

// Check if remote file exists
const exists = await adb.fileExists('/sdcard/file.txt');

// Get file size
const size = await adb.fileSize('/sdcard/file.txt');
// Returns: 1024 (bytes)

// List directory contents
const files = await adb.ls('/sdcard', ['-la']);
// Returns: ['drwxr-xr-x  2 root root 4096 Jan  1 00:00 Download', ...]

// Create directory
await adb.mkdir('/sdcard/myapp/data');

// Remove file or directory recursively
await adb.rimraf('/sdcard/myapp');

// Cache APK on device for faster subsequent installs
const remotePath = await adb.cacheApk('/local/app.apk', { timeout: 120000 });
// Returns: '/data/local/tmp/appium_cache/abc123.apk'
```

## Device Settings and Properties

Read and modify device settings and system properties.

```javascript
import { ADB } from 'appium-adb';

const adb = await ADB.createADB();
adb.setDeviceId('emulator-5554');

// Get device property
const model = await adb.getModel();
const manufacturer = await adb.getManufacturer();
const platformVersion = await adb.getPlatformVersion();
const apiLevel = await adb.getApiLevel();
const timezone = await adb.getTimeZone();

// Get/set arbitrary device property
const prop = await adb.getDeviceProperty('ro.build.version.sdk');
await adb.setDeviceProperty('debug.my.property', 'value', { privileged: true });

// Screen info
const screenSize = await adb.getScreenSize();    // Returns: '1080x1920'
const density = await adb.getScreenDensity();    // Returns: 480
const orientation = await adb.getScreenOrientation(); // Returns: 0, 1, 2, or 3

// Get/set settings
const wifiSetting = await adb.getSetting('global', 'wifi_on');
await adb.setSetting('global', 'airplane_mode_on', 1);

// Locale settings
const language = await adb.getDeviceLanguage();
const country = await adb.getDeviceCountry();
const locale = await adb.getDeviceLocale();

// Check and set locale
const isCorrectLocale = await adb.ensureCurrentLocale('en', 'US');

// HTTP Proxy
await adb.setHttpProxy('proxy.example.com', 8080);
await adb.deleteHttpProxy();

// Hidden API policy (for accessing non-SDK APIs)
await adb.setHiddenApiPolicy(1);  // 0=disable, 1=warn, 2=disallow
await adb.setDefaultHiddenApiPolicy();
```

## Network and Connectivity

Manage WiFi, data, airplane mode, Bluetooth, and NFC settings.

```javascript
import { ADB } from 'appium-adb';

const adb = await ADB.createADB();
adb.setDeviceId('emulator-5554');

// WiFi control
const wifiOn = await adb.isWifiOn();
await adb.setWifiState(true, false);  // (enabled, isEmulator)

// Mobile data control
const dataOn = await adb.isDataOn();
await adb.setDataState(true, false);  // (enabled, isEmulator)

// Airplane mode
const airplaneOn = await adb.isAirplaneModeOn();
await adb.setAirplaneMode(true);
await adb.broadcastAirplaneMode(true);  // Required for API < 30

// Bluetooth (API 30+)
await adb.setBluetoothOn(true);

// NFC
await adb.setNfcOn(true);

// GPS/Location providers
const providers = await adb.getLocationProviders();
await adb.toggleGPSLocationProvider(true);

// Port forwarding
await adb.forwardPort(8080, 8080);  // local -> remote
const forwards = await adb.getForwardList();
await adb.removePortForward(8080);

// Reverse port forwarding
await adb.reversePort(8080, 8080);  // remote -> local
const reverses = await adb.getReverseList();
await adb.removePortReverse(8080);

// Ping device
await adb.ping();
```

## Keyboard and Input

Control the software keyboard and send input to the device.

```javascript
import { ADB } from 'appium-adb';

const adb = await ADB.createADB();
adb.setDeviceId('emulator-5554');

// Send text input
await adb.inputText('Hello World');

// Send key events
await adb.keyevent(4);   // Back button
await adb.keyevent(3);   // Home button
await adb.keyevent(66);  // Enter key

// Navigation shortcuts
await adb.back();
await adb.goToHome();

// Keyboard management
const keyboardShown = await adb.isSoftKeyboardPresent();
// Returns: { isKeyboardShown: true, canCloseKeyboard: true }

await adb.hideKeyboard();

// IME (Input Method Editor) management
const availableIMEs = await adb.availableIMEs();
const enabledIMEs = await adb.enabledIMEs();
const defaultIME = await adb.defaultIME();

await adb.enableIME('com.example.keyboard/.KeyboardService');
await adb.disableIME('com.example.keyboard/.KeyboardService');
await adb.setIME('com.example.keyboard/.KeyboardService');

// Run code with specific IME context
await adb.runInImeContext('io.appium.settings/.UnicodeIME', async () => {
  await adb.inputText('Unicode text here');
});

// Clear text field
await adb.clearTextField(10);  // Press delete 10 times
```

## Lock Screen Management

Control device lock screen and credentials.

```javascript
import { ADB } from 'appium-adb';

const adb = await ADB.createADB();
adb.setDeviceId('emulator-5554');

// Check screen lock state
const isLocked = await adb.isScreenLocked();

// Lock the device
await adb.lock();

// Dismiss keyguard (unlock screen without credentials)
await adb.dismissKeyguard();

// Wake up device
await adb.cycleWakeUp();

// Lock credential management (API 23+)
const isLockSupported = await adb.isLockManagementSupported();
const isLockEnabled = await adb.isLockEnabled();

// Set lock credential (PIN, password, or pattern)
await adb.setLockCredential('PIN', '1234');
await adb.setLockCredential('PASSWORD', 'mypassword');

// Verify lock credential
const isValid = await adb.verifyLockCredential('PIN', '1234');

// Clear lock credential
await adb.clearLockCredential('1234');
```

## Emulator Commands

Control Android emulators with specialized commands for GSM, SMS, power, sensors, and more.

```javascript
import { ADB } from 'appium-adb';

const adb = await ADB.createADB();
adb.setDeviceId('emulator-5554');

// Launch an emulator
const proc = await adb.launchAVD('Pixel_4_API_30', {
  launchTimeout: 120000,
  readyTimeout: 60000,
  args: ['-no-snapshot-load'],
  language: 'en',
  country: 'US'
});

// Kill emulator
await adb.killEmulator('Pixel_4_API_30');
await adb.killAllEmulators();

// Check emulator connection
const isConnected = await adb.isEmulatorConnected();
await adb.verifyEmulatorConnected();

// Power simulation
await adb.powerAC('on');   // or 'off'
await adb.powerCapacity(50);  // Set battery to 50%
await adb.powerOFF();      // Set AC off and battery to 0%

// GSM/Phone simulation
await adb.gsmCall('5551234567', 'call');    // Incoming call
await adb.gsmCall('5551234567', 'accept');  // Accept call
await adb.gsmCall('5551234567', 'cancel');  // End call
await adb.gsmSignal(4);    // Signal strength 0-4
await adb.gsmVoice('home'); // 'unregistered', 'home', 'roaming', 'searching', 'denied'

// SMS simulation
await adb.sendSMS('5551234567', 'Hello from Appium!');

// Network speed
await adb.networkSpeed('lte');  // 'gsm', 'hscsd', 'gprs', 'edge', 'umts', 'hsdpa', 'lte', 'full'

// Sensor simulation
await adb.sensorSet('acceleration', '10:0:0');
// Sensors: acceleration, magnetic-field, orientation, temperature, proximity

// Fingerprint simulation (API 23+)
await adb.fingerprint('1');

// Rotate display
await adb.rotate();

// Execute telnet console command
const result = await adb.execEmuConsoleCommand(['avd', 'name']);

// Get emulator info
const emuVersion = await adb.getEmuVersionInfo();
// Returns: { revision: '30.0.0', buildId: 12345678 }

const imageProps = await adb.getEmuImageProperties('Pixel_4_API_30');
// Returns: { 'avd.ini.encoding': 'UTF-8', path: '...', target: 'android-30' }
```

## Logcat Operations

Stream and manage Android system logs.

```javascript
import { ADB } from 'appium-adb';

const adb = await ADB.createADB();
adb.setDeviceId('emulator-5554');

// Start logcat capture
await adb.startLogcat({
  format: 'threadtime',
  filterSpecs: ['*:I'],  // Info level and above
});

// Get captured logs
const logs = adb.getLogcatLogs();

// Add listener for real-time logs
adb.setLogcatListener((logLine) => {
  console.log('Log:', logLine);
});

// Remove listener
adb.removeLogcatListener(myListener);

// Stop logcat capture
await adb.stopLogcat();
```

## APK Signing

Sign and verify APK files.

```javascript
import { ADB } from 'appium-adb';

const adb = await ADB.createADB();

// Sign APK with default certificate
await adb.signWithDefaultCert('/path/to/app.apk');

// Sign APK with custom keystore
await adb.signWithCustomCert('/path/to/app.apk', {
  keystorePath: '/path/to/keystore.jks',
  keystorePassword: 'password',
  keyAlias: 'mykey',
  keyPassword: 'keypassword'
});

// Generic sign method (uses instance keystore config)
adb.keystorePath = '/path/to/keystore.jks';
adb.keystorePassword = 'password';
adb.keyAlias = 'mykey';
adb.keyPassword = 'keypassword';
await adb.sign('/path/to/app.apk');

// Check APK certificate
const certInfo = await adb.checkApkCert('/path/to/app.apk', 'com.example.app');

// Zip align APK (optimization)
await adb.zipAlignApk('/path/to/app.apk');
```

## Device Management

Root access, reboot, and device lifecycle management.

```javascript
import { ADB } from 'appium-adb';

const adb = await ADB.createADB();
adb.setDeviceId('emulator-5554');

// Root access
const rootResult = await adb.root();
// Returns: { isSuccessful: true, wasAlreadyRooted: false }

const isRoot = await adb.isRoot();
await adb.unroot();

// Reboot device
await adb.reboot(90);  // Wait up to 90 retries (1 second each)

// Wait for device to be ready
await adb.waitForDevice(30);  // Timeout in seconds

// Wait for emulator to be fully booted
await adb.waitForEmulatorReady(60000);  // Timeout in ms

// Restart ADB server
await adb.restartAdb();
await adb.killServer();

// Reconnect device
await adb.reconnect();

// Get ADB version info
const version = await adb.getVersion();
// Returns: { binary: { version: '1.0.41', build: 123 }, bridge: { version: '1.0.41' } }

// Take screenshot
const screenshotBuffer = await adb.takeScreenshot();

// Record screen
await adb.screenrecord('/sdcard/recording.mp4', {
  timeLimit: 180,
  bitRate: 4000000,
  size: '1280x720'
});

// Get bugreport
await adb.bugreport('/local/path/bugreport.zip');

// Install MITM certificate (requires root)
const cert = Buffer.from('base64-encoded-cert');
await adb.installMitmCertificate(cert);
const isCertInstalled = await adb.isMitmCertificateInstalled(cert);
```

## Summary

Appium ADB provides a complete toolkit for Android device automation through the Android Debug Bridge. The library is essential for mobile test automation frameworks, enabling seamless control over device state, application lifecycle, user input simulation, and system configuration. Its async/await architecture makes it easy to integrate into modern JavaScript/TypeScript automation projects.

Common integration patterns include using `ADB.createADB()` to initialize a connection, calling `setDeviceId()` to target a specific device, then using the various command methods for installation (`install`, `installOrUpgrade`), app control (`startApp`, `forceStop`), input (`inputText`, `keyevent`), and verification (`isAppInstalled`, `getFocusedPackageAndActivity`). For emulator testing, specialized methods like `gsmCall`, `sendSMS`, and `powerCapacity` enable comprehensive mobile scenario simulation. The library handles connection management, command timeouts, and error recovery automatically, making it reliable for both local development and CI/CD pipelines.
