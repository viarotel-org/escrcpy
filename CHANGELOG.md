# Changelog

## [1.32.2](https://github.com/viarotel-org/escrcpy/compare/v1.32.1...v1.32.2) (2025-09-29)


### Performance Improvements

* 🚀 Update to scrcpy v3.3.3 ([8566644](https://github.com/viarotel-org/escrcpy/commit/8566644a156fbfae538eb1a5a8136d330a1b4568))

## [1.32.1](https://github.com/viarotel-org/escrcpy/compare/v1.32.0...v1.32.1) (2025-09-10)


### Performance Improvements

* 🌱 UI details and documentation optimization ([5b5bbf7](https://github.com/viarotel-org/escrcpy/commit/5b5bbf7a680142bdbfca869048feab60e70938f0))

## [1.32.0](https://github.com/viarotel-org/escrcpy/compare/v1.31.3...v1.32.0) (2025-09-08)


### Features

* ✨ Now supports copying device screenshots and recording files to the clipboard ([bdb3644](https://github.com/viarotel-org/escrcpy/commit/bdb364486292ecc382821b28cf523fdbf5ce4cce))
* 🚀 Update to scrcpy v3.3.2 ([462536c](https://github.com/viarotel-org/escrcpy/commit/462536ce60d0c2340561ad397dd187f871845677))


### Bug Fixes

* 🐛 Fixed the issue where recorded files could not be copied to the clipboard under Windows ([119b518](https://github.com/viarotel-org/escrcpy/commit/119b518eb9099e641f99eb37f4bc7feaabe1e753))
* 🔧 Fixed button loading prompt conflict issue ([c323ad6](https://github.com/viarotel-org/escrcpy/commit/c323ad60059f1a18ebb9486f860e088584da6b26))


### Performance Improvements

* ✅ Provides the function of detecting and migrating configurations when deleting a device ([39e0533](https://github.com/viarotel-org/escrcpy/commit/39e05334a899d6157ff3a9b96bab3faae298007f))
* 📌 Standardize the device list lifecycle processing flow. IPv6 addresses must be enclosed in [] and the port number cannot be omitted for wireless connections. ([93c059d](https://github.com/viarotel-org/escrcpy/commit/93c059dc9d79949609f8537e161522acfa658f66))
* 🚀 Modify the adb connection method to be compatible with scan connection ([e6e8a09](https://github.com/viarotel-org/escrcpy/commit/e6e8a09dfcbd0dfec1a2c8afe58384cd8189f2b4))
* 🚀 Optimize device list connection behavior and configuration migration strategy ([8237058](https://github.com/viarotel-org/escrcpy/commit/82370583224a351ae15040a8cf70861a34342e1b))

## [1.31.3](https://github.com/viarotel-org/escrcpy/compare/v1.31.2...v1.31.3) (2025-09-01)


### Performance Improvements

* 💄 Window layout adapted to dark mode theme ([eab402b](https://github.com/viarotel-org/escrcpy/commit/eab402ba8bc7f6f72d7f4758fa60b32deeaefd1d))

## [1.31.2](https://github.com/viarotel-org/escrcpy/compare/v1.31.1...v1.31.2) (2025-09-01)


### Bug Fixes

* 🐛 Resolved the issue where the device list could not be displayed due to compatibility issues with certain devices ([2c53b77](https://github.com/viarotel-org/escrcpy/commit/2c53b77745cc289edc0de1a404ecd9f037c28523))


### Performance Improvements

* 🚀 Optimization of window arrangement function ([33786ab](https://github.com/viarotel-org/escrcpy/commit/33786ab46095727d027a5cb7206c093e9e7a06d2))

## [1.31.1](https://github.com/viarotel-org/escrcpy/compare/v1.31.0...v1.31.1) (2025-08-29)


### Performance Improvements

* 👷 Remove redundant code comments ([ca4e826](https://github.com/viarotel-org/escrcpy/commit/ca4e8267942ec78cf600d67ef2741a2bbe0f8034))

## [1.31.0](https://github.com/viarotel-org/escrcpy/compare/v1.30.2...v1.31.0) (2025-08-29)


### Features

* ✨ Device lists will now intelligently merge duplicate device entries and share device configurations ([52cc4b1](https://github.com/viarotel-org/escrcpy/commit/52cc4b1a65f753074bba188bb2a31f1e3f4628f3))
* ✨ Now you can arrange your device windows through a graphical interface ([91ad249](https://github.com/viarotel-org/escrcpy/commit/91ad249bf1b85bddbbc697b182a5f47b04074c05))


### Bug Fixes

* 🐛 Fix typos ([a7a3a17](https://github.com/viarotel-org/escrcpy/commit/a7a3a17e022f3d8ed5e8db2b1aadfaa5c7b84a46))
* 🐛 Fixed possible sandbox issues on Linux ([ff9f9bd](https://github.com/viarotel-org/escrcpy/commit/ff9f9bdd24841d6f0ad0c94f8331a337e011fcac))
* 🐛 Fixed the issue of saving exceptions after adjusting parameters in preference settings ([4a18f61](https://github.com/viarotel-org/escrcpy/commit/4a18f61034bd7be9b6b3ae05f66427d50b359ac6))
* 🐛 Issue not taking effect after restarting the application after switching themes ([857c480](https://github.com/viarotel-org/escrcpy/commit/857c4806a40760186be80233133d89330707cf4c))


### Performance Improvements

* ♻️ Improve the stability of window arrangement function ([7ae3f21](https://github.com/viarotel-org/escrcpy/commit/7ae3f21788634f6ce9d893a54494b16bc5a6cee5))
* ♻️ Simplify sandbox automatic configuration manager code to improve performance ([1b82336](https://github.com/viarotel-org/escrcpy/commit/1b823362e5cc9888f39901538d4444b1fbba402e))
* 💄 Improve space utilization of device window layout tools ([939a2d2](https://github.com/viarotel-org/escrcpy/commit/939a2d2c07d2de8d79f92bfbd228497c9a995ab9))
* 🔖 Adjust the order of quick entry functions ([ccb59e1](https://github.com/viarotel-org/escrcpy/commit/ccb59e15ecf352a4f2121b31678b26ce57d51664))
* 🔨 Improve the reliability of the linux sandbox configuration tool ([6de2538](https://github.com/viarotel-org/escrcpy/commit/6de25382d5a8b9479ecf2b75980af5d34ea54462))
* 🚀 After getting the device list, query and save the SerialNo of each device in preparation for subsequent integration ([4464e7e](https://github.com/viarotel-org/escrcpy/commit/4464e7e80995493a53e9e5e6b155a0e138ef84bb))
* 🚀 Improve performance by asynchronously storing main interface boundary information ([d230c15](https://github.com/viarotel-org/escrcpy/commit/d230c150be23df27a1e91166aae70f47af6b91e0))
* 🚀 Optimize the default behavior when adding new widgets to the device window arrangement ([1be470a](https://github.com/viarotel-org/escrcpy/commit/1be470ad83e012857318172d634023abca034e68))
* 🚀 Optimize the layout effect of the task list ([044cfcd](https://github.com/viarotel-org/escrcpy/commit/044cfcde2ede413248f236be7e39dc3a3fbba8aa))
* 🚀 Optimize the storage strategy for preference Settings ([359b9b9](https://github.com/viarotel-org/escrcpy/commit/359b9b9f97e218dc4e3ed74fe184da8512121238))

## [1.30.2](https://github.com/viarotel-org/escrcpy/compare/v1.30.1...v1.30.2) (2025-07-15)


### Performance Improvements

* ♻️ Optimize device list interaction logic ([3812061](https://github.com/viarotel-org/escrcpy/commit/381206179311ad47594ecdc08170d26cd3c9eeca))
* 📝 Add Japanese language support ([969378f](https://github.com/viarotel-org/escrcpy/commit/969378fa04292d07ad889e4113b556f9d3d5d2d9))

## [1.30.1](https://github.com/viarotel-org/escrcpy/compare/v1.30.0...v1.30.1) (2025-07-14)


### Bug Fixes

* 🐛 Fixed the issue where all configurations would be cleared when resetting the category configuration in preferences ([6ee9a92](https://github.com/viarotel-org/escrcpy/commit/6ee9a92bd3cd0d5b7a03419827b05346c605321c))
* 🐛 Solve the problem of abnormal display timing when recording related functions are successful ([67d279e](https://github.com/viarotel-org/escrcpy/commit/67d279e162c21d3f2160ec9b51cfdf437b645e39))
* 📝 Fixed the issue that special characters in Windows prevented the creation of app shortcut launch ([301dac5](https://github.com/viarotel-org/escrcpy/commit/301dac5d5ee3a99e4eb1386a1658cbda4b19cf2e))


### Performance Improvements

* 📝 Optimized startup app package name display ([22eb718](https://github.com/viarotel-org/escrcpy/commit/22eb718fa5821a40b414ec548342c2f05057e123))
* 🔧 Optimized startup APP function interaction ([468af22](https://github.com/viarotel-org/escrcpy/commit/468af22bf84bcb5cc50a9ff77d2a70cb0d23c227))

## [1.30.0](https://github.com/viarotel-org/escrcpy/compare/v1.29.9...v1.30.0) (2025-07-14)


### Features

* 🔍️ Optimize the search function of the app ([94ccb7b](https://github.com/viarotel-org/escrcpy/commit/94ccb7be41c7d13b63a716a4245cf8552f66528d))
* 🚀 Supports dragging the device control bar to sort ([64a98b2](https://github.com/viarotel-org/escrcpy/commit/64a98b2c490cdd648fb21216cf9c2759a74ce7b0))


### Bug Fixes

* 🐛 Fixed the issue of layout flickering when refreshing the device list page ([608b8f3](https://github.com/viarotel-org/escrcpy/commit/608b8f3120182c7031e075d3268fcda39bfb4c15))
* 🐛 Fixed the issue where activating the program on macOS in certain situations would cause the tray to be created repeatedly ([cf8e183](https://github.com/viarotel-org/escrcpy/commit/cf8e183eb6db7215268346742e070b9955d07696))
* 🐛 Fixed the issue where there is a chance of an error when closing the floating control bar on macOS ([5c2c711](https://github.com/viarotel-org/escrcpy/commit/5c2c71131caa131ec00505bf114e6e0dc2cba989))
* 🚀 Fix the issue of abnormal program exit behavior under windows ([705f8be](https://github.com/viarotel-org/escrcpy/commit/705f8be589434375b86d3c6e57a4d3010440bcdb))


### Performance Improvements

* ♻️ Code structure optimization ([595216b](https://github.com/viarotel-org/escrcpy/commit/595216b8b5bf6240f8debbc7c714f46792330adc))
* 👥 Control bar sorting supports state synchronization ([88abe95](https://github.com/viarotel-org/escrcpy/commit/88abe9515360408a860dccc11d01338631387c41))
* 📝 Optimize the title of the control interface to solve the problem of duplicate device names ([06a151d](https://github.com/viarotel-org/escrcpy/commit/06a151dddb2584f82a9323524113d475974fee63))
* 🔀 Optimize the storage policy configured in preferences ([b9faabf](https://github.com/viarotel-org/escrcpy/commit/b9faabfb46066e150915538747f4a689fe38a7c6))
* 🚀 Supports opening using the main monitor when starting the APP ([aec9b78](https://github.com/viarotel-org/escrcpy/commit/aec9b78823acaf1c5705b51691eb20a11ddc8dfd))

## [1.29.9](https://github.com/viarotel-org/escrcpy/compare/v1.29.8...v1.29.9) (2025-06-27)


### Performance Improvements

* 🚀 Update to scrcpy  v3.3.1 ([a2bb039](https://github.com/viarotel-org/escrcpy/commit/a2bb039131f807e4e9904048ea04ce4d6fb7109b))

## [1.29.8](https://github.com/viarotel-org/escrcpy/compare/v1.29.7...v1.29.8) (2025-06-20)


### Bug Fixes

* 🐛 Update scrcpy-server file to solve the problem of not being able to obtain device APP list ([63f7135](https://github.com/viarotel-org/escrcpy/commit/63f7135a818f9ab7e13b9dacb7a6f283bed03bcc))

## [1.29.7](https://github.com/viarotel-org/escrcpy/compare/v1.29.6...v1.29.7) (2025-06-16)


### Performance Improvements

* 🚀 Update to scrcpy v3.3 ([bbf2335](https://github.com/viarotel-org/escrcpy/commit/bbf2335e0162d4cb53aff556cf733fae499366e9))

## [1.29.6](https://github.com/viarotel-org/escrcpy/compare/v1.29.5...v1.29.6) (2025-04-27)


### Performance Improvements

* 📝 Added Arabic language support ([f6c9fa4](https://github.com/viarotel-org/escrcpy/commit/f6c9fa44b009359790b90ee9dae534f876cfef46))
* 🚀 File management supports returning to the root directory ([2e27443](https://github.com/viarotel-org/escrcpy/commit/2e274436e66262fb7251fa3d95a9979c6831652b))

## [1.29.5](https://github.com/viarotel-org/escrcpy/compare/v1.29.4...v1.29.5) (2025-04-17)


### Bug Fixes

* 🐛 Fix the problem of build failure caused by missing dependencies ([e34e1c2](https://github.com/viarotel-org/escrcpy/commit/e34e1c295a0e9567f87a9b5141e80fec65ce2dc1))

## [1.29.4](https://github.com/viarotel-org/escrcpy/compare/v1.29.3...v1.29.4) (2025-04-17)


### Bug Fixes

* 🐛 Fixed an issue where some options in preferences could not be turned off ([269bd29](https://github.com/viarotel-org/escrcpy/commit/269bd29d1edf445be8d11353bc93438591be5f3e))


### Performance Improvements

* 💫 Adjust gnirehtet configuration behavior to make it consistent with user operation habits ([7507915](https://github.com/viarotel-org/escrcpy/commit/75079150ee92fb91dd34cbe4189404bc6ae6f932))
* 🔍️ Optimize QR code style to avoid scanning problems on some devices ([dd3ad6c](https://github.com/viarotel-org/escrcpy/commit/dd3ad6cc5c91659f163e6e906f711c291fafc28b))
* 🩹 Add an option to enable keyboard fix on app startup to be compatible with older versions of scrcpy ([be89b36](https://github.com/viarotel-org/escrcpy/commit/be89b360f891350710527fcb49dd920183d696b2))

## [1.29.3](https://github.com/viarotel-org/escrcpy/compare/v1.29.2...v1.29.3) (2025-04-02)


### Performance Improvements

* 📝 Add docs entry to the program ([db5d157](https://github.com/viarotel-org/escrcpy/commit/db5d1576a90c00b8ac3d8c9f42616c9850f5801e))
* 🚚 Reduce some unnecessary verifications and increase the speed at which equipment starts reverse network supply ([c17aaba](https://github.com/viarotel-org/escrcpy/commit/c17aabaf4d0b792111ce975c269072b69c6ef734))

## [1.29.2](https://github.com/viarotel-org/escrcpy/compare/v1.29.1...v1.29.2) (2025-03-31)


### Performance Improvements

* 🔨 Fixed the problem that some models could not reversely supply the network due to the blocking of installation detection when using Gnirehtet ([c5369af](https://github.com/viarotel-org/escrcpy/commit/c5369afc8a1160de5cacc306bd228e11846082f1))

## [1.29.1](https://github.com/viarotel-org/escrcpy/compare/v1.29.0...v1.29.1) (2025-03-31)


### Performance Improvements

* 🔊 Expanded audio source options ([fc91f07](https://github.com/viarotel-org/escrcpy/commit/fc91f0706022bf93b8efca5c5c4211cc5a8950ff))
* 🩹 Closing a screen via the control bar no longer requires creating a help window ([84c7be7](https://github.com/viarotel-org/escrcpy/commit/84c7be784e3e7808af0ac020ec961687d61db5a9))
* 🚀 Update to scrcpy v3.2 ([57c11af](https://github.com/viarotel-org/escrcpy/commit/57c11afc1c4984ef930ee83f8d2eb12001a27429))

## [1.29.0](https://github.com/viarotel-org/escrcpy/compare/v1.28.7...v1.29.0) (2025-03-27)


### Features

* 🚀 Support adding the open application action to the desktop shortcut. (Not supported on macOS) ([add251f](https://github.com/viarotel-org/escrcpy/commit/add251ff1d88f62559f8ff1e6cb728bdb04c49eb))
* 🚚 Support batch startup mirroring ([fcfd78e](https://github.com/viarotel-org/escrcpy/commit/fcfd78e3b77d81655b4c03e709b630d70ab20d64))


### Bug Fixes

* 🐛 Solve the conflict between floating navigation bar and quick APP launch ([460aca1](https://github.com/viarotel-org/escrcpy/commit/460aca1ef0c26d8cf86fb19ba526802a88c6fe54))
* 🐛 Solve the problem of startup error of development mode under Linux ([5c4f65e](https://github.com/viarotel-org/escrcpy/commit/5c4f65e3b025d0f85594ea1863dd57c53986e40b))


### Performance Improvements

* ✨ The floating control bar supports transparent display when inactive ([34f27c5](https://github.com/viarotel-org/escrcpy/commit/34f27c52ca6821ee3bed17e7a57afa3c53d8a98e))
* 👷 Explicitly clean up unnecessary child processes on exit ([0549dda](https://github.com/viarotel-org/escrcpy/commit/0549ddabb6020f670aece6e628bd08327b679c5c))
* 👽️ Experimental support for adding open application actions to linux desktop shortcuts ([6897c0e](https://github.com/viarotel-org/escrcpy/commit/6897c0e16c4d5fb0f9154aac3ce0b274bdc95a2a))
* 👽️ Experimentally add linux arm64 support ([5b033fd](https://github.com/viarotel-org/escrcpy/commit/5b033fd2a1a6c9cf397b2a9178f3cde03df83266))
* 💄 Optimization of display effect of device list page ([305187d](https://github.com/viarotel-org/escrcpy/commit/305187dcca3d654697fcb597e9a8c4cad1ffe3cb))
* 💫 Support appending gnirehtet custom parameters in configuration ([206a030](https://github.com/viarotel-org/escrcpy/commit/206a030d73f7344d2b6fecf791d1b76fe645d143))
* 🚀 Provide feedback on the application shortcut addition ([d7eca8d](https://github.com/viarotel-org/escrcpy/commit/d7eca8df930b3e66ba38964a49a81d71db8e6035))

## [1.28.7](https://github.com/viarotel-org/escrcpy/compare/v1.28.6...v1.28.7) (2025-02-17)


### Bug Fixes

* 🐛 Fixed the issue of duplicate filter conditions in the device list ([6c4242c](https://github.com/viarotel-org/escrcpy/commit/6c4242c40a878472862170ef3514870881c30b11))
* 🐛 Solved the problem that the main window could not be restored after being moved off the screen in some cases ([d054f8d](https://github.com/viarotel-org/escrcpy/commit/d054f8df6c78bd678589164acaa5847016740953))


### Performance Improvements

* ⬆️ Improved performance of automated mirroring ([33a03c3](https://github.com/viarotel-org/escrcpy/commit/33a03c3f636c0a7d7010ddffec381b44612a2534))
* 💄 Optimize the display effect of horizontal screen screenshots ([90c7163](https://github.com/viarotel-org/escrcpy/commit/90c716302d58c7484cc6aba4a55e54a103d5f8ef))
* 🚀 The main panel supports single instance startup ([c49d22c](https://github.com/viarotel-org/escrcpy/commit/c49d22cabf17d4539549db01914fddb44b73530f))

## [1.28.6](https://github.com/viarotel-org/escrcpy/compare/v1.28.5...v1.28.6) (2025-02-05)


### Bug Fixes

* 🐛 Resolving build errors ([d21fa29](https://github.com/viarotel-org/escrcpy/commit/d21fa290dcaa7fbe7bb61979542feb6b22b2c863))

## [1.28.5](https://github.com/viarotel-org/escrcpy/compare/v1.28.4...v1.28.5) (2025-02-05)


### Performance Improvements

* ✅ File management supports selecting directories for uploading ([fd2e639](https://github.com/viarotel-org/escrcpy/commit/fd2e639d1b04f1e3b65b04eb02343830d1302238))
* ⬆️ Improve QR code connection performance ([b413889](https://github.com/viarotel-org/escrcpy/commit/b413889ed32d1b39387cbdb2844a18fb0349f17b))

## [1.28.4](https://github.com/viarotel-org/escrcpy/compare/v1.28.3...v1.28.4) (2025-01-13)


### Bug Fixes

* 🐛 Fix the display ID value type error ([2b7ee79](https://github.com/viarotel-org/escrcpy/commit/2b7ee795a077a6e9197d0a5db3a847aee8144ea8))
* 🐛 Solve the problem of IPV6 address connection failure ([1a95325](https://github.com/viarotel-org/escrcpy/commit/1a95325884845441987113fbb17c58289a816346))


### Performance Improvements

* ♻️ Improve wireless connection stability ([85be898](https://github.com/viarotel-org/escrcpy/commit/85be8980d441c0046ae0854a6fdc88998be7b24c))
* ⚡️ Optimize the method of obtaining the available displays of the device ([9e31c84](https://github.com/viarotel-org/escrcpy/commit/9e31c847fe91e0d5ccad512e863f9a2746554383))
* 🐛 Improve wireless connection verification method ([69fecc3](https://github.com/viarotel-org/escrcpy/commit/69fecc3bc59f8f4a968368e48f1f06174255e62c))
* 👷 Added edge hiding function switch ([d25714a](https://github.com/viarotel-org/escrcpy/commit/d25714a43f0676ab35204d6b4bc7564464eeb3c2))

## [1.28.3](https://github.com/viarotel-org/escrcpy/compare/v1.28.2...v1.28.3) (2024-12-28)


### Performance Improvements

* ♻️ Optimize device details performance ([38d1433](https://github.com/viarotel-org/escrcpy/commit/38d1433a82d6c22c9bb6db681533c93e788e4cff))

## [1.28.2](https://github.com/viarotel-org/escrcpy/compare/v1.28.1...v1.28.2) (2024-12-27)


### Performance Improvements

* 👷 Optimize the edge hiding function ([d5caaa9](https://github.com/viarotel-org/escrcpy/commit/d5caaa915c5e979c2217357cf74efe20d477c5ba))
* 📸 Support viewing real-time images and power information of the device ([d262adf](https://github.com/viarotel-org/escrcpy/commit/d262adf54df2a28c734b3db1a5d17bbccd983db9))

## [1.28.1](https://github.com/viarotel-org/escrcpy/compare/v1.28.0...v1.28.1) (2024-12-20)


### Performance Improvements

* ♻️ Optimize QR code connection experience ([86f5e69](https://github.com/viarotel-org/escrcpy/commit/86f5e6909b9db949c8611496940aeb9599ced2ec))

## [1.28.0](https://github.com/viarotel-org/escrcpy/compare/v1.27.7...v1.28.0) (2024-12-20)


### Features

* ✨ Support pairing and connecting to devices via QR code ([14306b2](https://github.com/viarotel-org/escrcpy/commit/14306b2353b2d70999c6b13ea8715dcf19314be5))
* 🚀 Supports connecting historical devices via device list ([e0687e8](https://github.com/viarotel-org/escrcpy/commit/e0687e895a5092ed79f6fad3a03fe33f4205c18e))


### Bug Fixes

* 🐛 Solve the problem of Windows disabling video forwarding and crashing ([10b902a](https://github.com/viarotel-org/escrcpy/commit/10b902a97bcd86f4f43866279e269ab8be84d2df))


### Performance Improvements

* ♻️ Update mirror icon ([c214e5a](https://github.com/viarotel-org/escrcpy/commit/c214e5add6746cf7ec299158cf0e77c7eed21f12))
* ✅ A new method is adopted to solve the problem of IP type configuration storage ([5488a1e](https://github.com/viarotel-org/escrcpy/commit/5488a1e826e795fbd644a4204ea018f8662adf2e))
* 🚀 Optimize device connection experience ([0690f2d](https://github.com/viarotel-org/escrcpy/commit/0690f2d4c07b50a162b5c1aa3fdf2d21fe2a83f9))
* 🚀 Supports display of offline devices ([dcf817f](https://github.com/viarotel-org/escrcpy/commit/dcf817feeeb306a6b1b534c8b7f85e1223af5420))

## [1.27.7](https://github.com/viarotel-org/escrcpy/compare/v1.27.6...v1.27.7) (2024-12-10)


### Performance Improvements

* 🚀 Update to scrcpy v3.1 ([7c74c71](https://github.com/viarotel-org/escrcpy/commit/7c74c712112ca80fe818c5f38d4f4f227b0f2590))

## [1.27.6](https://github.com/viarotel-org/escrcpy/compare/v1.27.5...v1.27.6) (2024-12-05)


### Bug Fixes

* ♻️ Fixed repeated dependency issues ([9777622](https://github.com/viarotel-org/escrcpy/commit/9777622830e2160ce84511052a79951638ff0771))


### Performance Improvements

* ♻️ Optimized contextBridge related improvements for stability ([0e098c3](https://github.com/viarotel-org/escrcpy/commit/0e098c37393b1410584f793bc15d1f76d246c05f))
* ♻️ Reduce build package size by removing redundant dependencies ([7b61b25](https://github.com/viarotel-org/escrcpy/commit/7b61b25f4e5eadff28bf112e6039b648491d36c1))
* 🚀 Update to scrcpy v3.0.2 ([7510548](https://github.com/viarotel-org/escrcpy/commit/75105484ab1d2e31b9bce70f8fc03b7c543e190a))

## [1.27.5](https://github.com/viarotel-org/escrcpy/compare/v1.27.4...v1.27.5) (2024-11-29)


### Performance Improvements

* ➖ Remove redundant console ([9a67142](https://github.com/viarotel-org/escrcpy/commit/9a67142af64820495da46f46891e222968beeacc))

## [1.27.4](https://github.com/viarotel-org/escrcpy/compare/v1.27.3...v1.27.4) (2024-11-29)


### Bug Fixes

* 🐛 Fix automatic release ([c2254aa](https://github.com/viarotel-org/escrcpy/commit/c2254aa27dc0a3ea0223dceb79ac64440a085e33))
* 🐛 Fixed an issue where macos built-in updates failed ([432eceb](https://github.com/viarotel-org/escrcpy/commit/432ecebea6c8c8c6236fb5ebf9ad84e84201046d))

## [1.27.3](https://github.com/viarotel-org/escrcpy/compare/v1.27.2...v1.27.3) (2024-11-28)


### Bug Fixes

* 🐛 Fix for built-in scrcpy not supporting x64 macos ([0d60655](https://github.com/viarotel-org/escrcpy/commit/0d606550d437aaf81094a0783ff4986a8135d74a))


### Performance Improvements

* ♻️ Improved device connection stability ([1d603ab](https://github.com/viarotel-org/escrcpy/commit/1d603abb3e591bc0a0a3fed9b7e6c104525e186e))
* ♻️ Optimized the adb daemon startup failure detection mechanism ([ca6be85](https://github.com/viarotel-org/escrcpy/commit/ca6be8590199f851e09bdf9a61daa0ee8a20bde3))
* 🧑‍💻 Improve device-based terminal experience ([88a0356](https://github.com/viarotel-org/escrcpy/commit/88a03564a5d7affd5b827b19bf4abfc2e76e4c39))

## [1.27.2](https://github.com/viarotel-org/escrcpy/compare/v1.27.1...v1.27.2) (2024-11-26)


### Bug Fixes

* 🐛 Start app to adapt to dark mode ([ae13fde](https://github.com/viarotel-org/escrcpy/commit/ae13fdea07e33953973a8561c6bc4e458811560e))

## [1.27.1](https://github.com/viarotel-org/escrcpy/compare/v1.27.0...v1.27.1) (2024-11-25)


### Bug Fixes

* 🐛 Make StartApp compatible with scrcpy v3.0 ([1082e0d](https://github.com/viarotel-org/escrcpy/commit/1082e0d6623a5e91af37ff206c4dc4e6023b64fa))


### Performance Improvements

* 🚀 Adjust options to support scrcpy v3.0 ([0602676](https://github.com/viarotel-org/escrcpy/commit/0602676a3e6b06ae1de1a8d7dd2d365646222245))
* 🚀 Update to scrcpy v3.0 ([bf06382](https://github.com/viarotel-org/escrcpy/commit/bf06382b3a66a7efbf01975f1eac0b092e78d034))

## [1.27.0](https://github.com/viarotel-org/escrcpy/compare/v1.26.4...v1.27.0) (2024-11-21)


### Features

* ✨ Support edge hiding function ([14a81de](https://github.com/viarotel-org/escrcpy/commit/14a81de211ec19b9533c8fa57180ba3bf4d8ae3d))


### Performance Improvements

* ⬆️ Optimize edge hiding performance ([74a91a4](https://github.com/viarotel-org/escrcpy/commit/74a91a4058692165aaaac77d753df6c78c6e5901))

## [1.26.4](https://github.com/viarotel-org/escrcpy/compare/v1.26.3...v1.26.4) (2024-11-14)


### Bug Fixes

* 🐛 Temporarily disable scrcpy integration in macOS ([9bf4d5c](https://github.com/viarotel-org/escrcpy/commit/9bf4d5cfed66466d1c8111cf8b0a44050e727f2a))

## [1.26.3](https://github.com/viarotel-org/escrcpy/compare/v1.26.2...v1.26.3) (2024-11-08)


### Bug Fixes

* 🐛 Fix device support audio and video encoding cannot be parsed ([9b7f6a9](https://github.com/viarotel-org/escrcpy/commit/9b7f6a98c28b44fcb9cc8cc8d9011ebe335ba73a))
* 🐛 Restore the --display-buffer parameter to solve the mirroring problem ([0f3d869](https://github.com/viarotel-org/escrcpy/commit/0f3d869d07ab379e3d735e6c910be19c8c2fb5f1))


### Performance Improvements

* ♻️ Support interruption during waiting for wireless connection ([344b385](https://github.com/viarotel-org/escrcpy/commit/344b385d33010d9fcfc53e8759e9f6419bbbfba3))
* ♻️ Supports retrieving a list of applications ([b1a6ba7](https://github.com/viarotel-org/escrcpy/commit/b1a6ba7ae46f74ef0c9bef3b9a88df0ad65db33f))
* ⚡️ Optimize startup application performance ([8e94494](https://github.com/viarotel-org/escrcpy/commit/8e94494e43945a611edeef0466d5c4d581b25e05))

## [1.26.2](https://github.com/viarotel-org/escrcpy/compare/v1.26.1...v1.26.2) (2024-11-06)


### Bug Fixes

* 🐛 Fix linux build errors ([9b43dc0](https://github.com/viarotel-org/escrcpy/commit/9b43dc0a9c0208520904acedcc6e561d7f64db77))

## [1.26.1](https://github.com/viarotel-org/escrcpy/compare/v1.26.0...v1.26.1) (2024-11-06)


### Performance Improvements

* ♻️ No longer building universal packages for macOS ([db5deb4](https://github.com/viarotel-org/escrcpy/commit/db5deb4183ac2a024e054443aee4003237167c58))

## [1.26.0](https://github.com/viarotel-org/escrcpy/compare/v1.25.5...v1.26.0) (2024-11-06)


### Features

* ✨ Integrate scrcpy binaries for macos ([85bf096](https://github.com/viarotel-org/escrcpy/commit/85bf0961e5886db80e622cc512d32cff1c83524c))
* ✨ Supports starting applications for mirroring ([d19e781](https://github.com/viarotel-org/escrcpy/commit/d19e78147152550b0d9f006765e09c955ab0951e))


### Bug Fixes

* 🐛 Rename --display-buffer to --video-buffer ([b2bb0ae](https://github.com/viarotel-org/escrcpy/commit/b2bb0aeb72e8359523bf9f108ec6bd4c7823a22c))
* 🐛 Repair floating action bar start application error ([487e7e2](https://github.com/viarotel-org/escrcpy/commit/487e7e2ec4dc57e6b17132210804f1e2021d67d4))
* 🩹 Restore the windows build configuration ([9491069](https://github.com/viarotel-org/escrcpy/commit/9491069716a7bf1a79dbfa97b3aa066116951feb))


### Performance Improvements

* ♻️ Adjust the position of the start application button ([9833932](https://github.com/viarotel-org/escrcpy/commit/9833932be3fa0e49cf5ba5bfbe5247e0d467aa90))
* ♻️ When the application fails to start, display the error message ([dbc34d6](https://github.com/viarotel-org/escrcpy/commit/dbc34d63add3cd05ca9327831509e21d7513a04c))
* ⚡️ Improve the start APP experience ([29e5e1b](https://github.com/viarotel-org/escrcpy/commit/29e5e1b6ebf73777b61e36e223905998a219daa9))

## [1.25.5](https://github.com/viarotel-org/escrcpy/compare/v1.25.4...v1.25.5) (2024-11-05)


### Performance Improvements

* ⚡️ Optimize the stability of options that need to dynamically obtain parameters in preference settings ([39bbc98](https://github.com/viarotel-org/escrcpy/commit/39bbc9850bde77aa21d9fdc4f58119541cde2b8f))

## [1.25.4](https://github.com/viarotel-org/escrcpy/compare/v1.25.3...v1.25.4) (2024-10-31)


### Performance Improvements

* ♻️ Enhance recording stability ([3dd7525](https://github.com/viarotel-org/escrcpy/commit/3dd75252591b8ea24ff2c02f12355b01b888c650))
* ♻️ Optimize camera recording stability ([952b2a7](https://github.com/viarotel-org/escrcpy/commit/952b2a72508cc0d9e32089c7c5a17fdb61ec84de))
* 💄 Normalize control window titles and generated file names ([ccc7f0e](https://github.com/viarotel-org/escrcpy/commit/ccc7f0e734c8ac98d3917a7cc5aefd086d46523f))

## [1.25.3](https://github.com/viarotel-org/escrcpy/compare/v1.25.2...v1.25.3) (2024-10-29)


### Bug Fixes

* 🔧 Camera recording and screen off configuration conflict ([4508758](https://github.com/viarotel-org/escrcpy/commit/4508758fb3c7304ccba8936a9b1cecaf001bc6ba))


### Performance Improvements

* 🔧 Temporarily disable scheduled tasks that are too far away ([be5e639](https://github.com/viarotel-org/escrcpy/commit/be5e6396e13a86ec1ae0cf09012c954b8a256c4c))

## [1.25.2](https://github.com/viarotel-org/escrcpy/compare/v1.25.1...v1.25.2) (2024-10-29)


### Bug Fixes

* 🐛 Resolve default recording error ([358064e](https://github.com/viarotel-org/escrcpy/commit/358064ecd487dd69b635531eb0e2611f14ae5c7c))

## [1.25.1](https://github.com/viarotel-org/escrcpy/compare/v1.25.0...v1.25.1) (2024-10-28)


### Miscellaneous Chores

* release 1.25.1 ([f60245b](https://github.com/viarotel-org/escrcpy/commit/f60245b11d9f38d5a61d9e3c59932de95ecef4b0))

## [1.25.0](https://github.com/viarotel-org/escrcpy/compare/v1.24.3...v1.25.0) (2024-10-28)


### Features

* ✨ Support to close the device screen when controlling ([a84c775](https://github.com/viarotel-org/escrcpy/commit/a84c775fa1ca507f551c4b0a1499d40d9bc2aedd))
* 📸 Enhanced recording ([7f10161](https://github.com/viarotel-org/escrcpy/commit/7f10161ad7be72ddcdfcb8bda2aa075e6d748932))


### Performance Improvements

* ♻️ Optimize camera recording ([4be2cf4](https://github.com/viarotel-org/escrcpy/commit/4be2cf4f144ffe5694a4abbb35f14dc5bac0bace))
* ♻️ Script and directory structure optimization ([68378ef](https://github.com/viarotel-org/escrcpy/commit/68378efb51c89095e6b2802bf9936608a156d17a))
* ⚗️ Experimental support for turning off screen controls ([9555f58](https://github.com/viarotel-org/escrcpy/commit/9555f58df5f1c4bc4a263ddf586c605785a094ef))
* ⚡️ Optimize scrcpy parameter conversion performance ([18dcd24](https://github.com/viarotel-org/escrcpy/commit/18dcd24e656801fbb811ccc46496e4037d28a137))
* 💄 Improved Russian display ([ca79e1b](https://github.com/viarotel-org/escrcpy/commit/ca79e1b57d507ba0fc4b2c3dd2411682b3b87105))
* 📸 Recording camera support ([10d0370](https://github.com/viarotel-org/escrcpy/commit/10d0370b663bc08028633e9dad910a637ea373b6))

## [1.24.3](https://github.com/viarotel-org/escrcpy/compare/v1.24.2...v1.24.3) (2024-10-21)


### Performance Improvements

* 💄 Optimize Russian display effect ([5ca39ae](https://github.com/viarotel-org/escrcpy/commit/5ca39ae188ba15af8000a573fc015b51e8c615d0))

## [1.24.2](https://github.com/viarotel-org/escrcpy/compare/v1.24.1...v1.24.2) (2024-09-16)


### Bug Fixes

* 🐛 Fix the mirror group bug ([cd7d9cd](https://github.com/viarotel-org/escrcpy/commit/cd7d9cdd3c006f7d73bc70a1730870f277cb0dff))

## [1.24.1](https://github.com/viarotel-org/escrcpy/compare/v1.24.0...v1.24.1) (2024-09-16)


### Performance Improvements

* ✨ Update to scrcpy@2.7 to support the gamepad ([0053e87](https://github.com/viarotel-org/escrcpy/commit/0053e87f1a345502430f8f1ce94a59d1c399ddda))
* ⬆️ Optimize the performance of the floating control bar ([a1c60ec](https://github.com/viarotel-org/escrcpy/commit/a1c60ecd787d2c05bd15109d71a557eb8d58e443))
* 🚀 Extended floating control bar function ([790e703](https://github.com/viarotel-org/escrcpy/commit/790e70349ac8b938a77cbde3560c410c8fc2a05b))

## [1.24.0](https://github.com/viarotel-org/escrcpy/compare/v1.23.6...v1.24.0) (2024-09-12)


### Features

* ✨ Support floating control bar ([8807e50](https://github.com/viarotel-org/escrcpy/commit/8807e5041399acd228ee739c610778272e431bdd))


### Performance Improvements

* ✅ Support switching devices on the floating control bar ([50440f5](https://github.com/viarotel-org/escrcpy/commit/50440f5f4b98eed2ceabd0c4fda706ef66eabedd))
* 💄 Optimize preference setting button layout ([47ae53d](https://github.com/viarotel-org/escrcpy/commit/47ae53d623bf0c8f7a08df2cc2cc5a54bfc8a917))

## [1.23.6](https://github.com/viarotel-org/escrcpy/compare/v1.23.5...v1.23.6) (2024-09-09)


### Bug Fixes

* 🐛 Fixed the problem of minimizing the visibility of tray icons ([b0f42aa](https://github.com/viarotel-org/escrcpy/commit/b0f42aa474686649fc7eb4736329539530a3b85a))
* 🐛 Repair ADB timeout problems ([b5bffc5](https://github.com/viarotel-org/escrcpy/commit/b5bffc562df339851ae68baf3e78cf4dd2ea2cf0))

## [1.23.5](https://github.com/viarotel-org/escrcpy/compare/v1.23.4...v1.23.5) (2024-09-09)


### Performance Improvements

* ♻️ Improve ADB connection stability ([7655ba6](https://github.com/viarotel-org/escrcpy/commit/7655ba637c21500e6aaf633aa8ab8132d3687b33))

## [1.23.4](https://github.com/viarotel-org/escrcpy/compare/v1.23.3...v1.23.4) (2024-09-08)


### Bug Fixes

* 🐛 Repair part of internationalization Lost dynamics ([d18444f](https://github.com/viarotel-org/escrcpy/commit/d18444f28ba1046018bc419e0068ce12c73b2d48))

## [1.23.3](https://github.com/viarotel-org/escrcpy/compare/v1.23.2...v1.23.3) (2024-09-08)


### Performance Improvements

* ♻️ Optimize the performance of equipment interaction column and file manager ([41ffcf5](https://github.com/viarotel-org/escrcpy/commit/41ffcf56603d799f41b0a2292267b504e200de12))

## [1.23.2](https://github.com/viarotel-org/escrcpy/compare/v1.23.1...v1.23.2) (2024-09-07)


### Performance Improvements

* 🚀 Support file manager upload to the current directory ([737c2a3](https://github.com/viarotel-org/escrcpy/commit/737c2a36e263de69d5b7c6250bc2489eba11d6dd))

## [1.23.1](https://github.com/viarotel-org/escrcpy/compare/v1.23.0...v1.23.1) (2024-09-07)


### Performance Improvements

* ⬆️ Update dependencies ([8b03862](https://github.com/viarotel-org/escrcpy/commit/8b0386258a900d841e712413358f5df86457a021))

## [1.23.0](https://github.com/viarotel-org/escrcpy/compare/v1.22.4...v1.23.0) (2024-09-07)


### Features

* ✨ Support graphic file manager ([8155723](https://github.com/viarotel-org/escrcpy/commit/815572303aef8400dc08b35c1bdce5608dfd2cb6))
* 🚀 Initially add a new file manager ([94ee007](https://github.com/viarotel-org/escrcpy/commit/94ee0070efa19688e9ec3ec90c9301cc958bae35))


### Performance Improvements

* ➖ Remove copilot ([6ca7612](https://github.com/viarotel-org/escrcpy/commit/6ca7612c0244b7a7d92d96c723cc7faa2462928b))

## [1.22.4](https://github.com/viarotel-org/escrcpy/compare/v1.22.3...v1.22.4) (2024-08-03)


### Bug Fixes

* 🐛 plan task Remove operation bug ([5205935](https://github.com/viarotel-org/escrcpy/commit/520593554f7224a4bb143aaa4b84db52b077421d))


### Performance Improvements

* 💄 Dark mode effect ([00d3495](https://github.com/viarotel-org/escrcpy/commit/00d34953832eec22ee4ac44f61f1fbc029f4ed84))

## [1.22.3](https://github.com/viarotel-org/escrcpy/compare/v1.22.2...v1.22.3) (2024-08-03)


### Performance Improvements

* ♻️ Update scrcpy to 2.6.1 ([1eef9d2](https://github.com/viarotel-org/escrcpy/commit/1eef9d23e4ed1576a0120102132440ef294f8c71))

## [1.22.2](https://github.com/viarotel-org/escrcpy/compare/v1.22.1...v1.22.2) (2024-07-25)


### Performance Improvements

* 💄 Optimize the display effect of the dark mode ([38f854b](https://github.com/viarotel-org/escrcpy/commit/38f854b6db8bf94b31a1f1f6db54fc55a99d8e8c))
* 💄 Optimize the display effect of the quick operation bar ([7b3c4db](https://github.com/viarotel-org/escrcpy/commit/7b3c4db83a285dc14a5f440843a3c162cee2d163))
* 💄 Optimize the display effect of the tabs bar ([5b2d41c](https://github.com/viarotel-org/escrcpy/commit/5b2d41c75a506edd25e4d6073bc4d1b12b593bf3))

## [1.22.1](https://github.com/viarotel-org/escrcpy/compare/v1.22.0...v1.22.1) (2024-07-25)


### Bug Fixes

* 🐛 Fixed asset publishing issues ([222f626](https://github.com/viarotel-org/escrcpy/commit/222f6260e12a8891e51ca9c86160d45c751dc255))

## [1.22.0](https://github.com/viarotel-org/escrcpy/compare/v1.21.4...v1.22.0) (2024-07-25)


### Features

* 🚀 Add a scheduled task list ([d72202b](https://github.com/viarotel-org/escrcpy/commit/d72202b3117fd5b98b5a96dd95fad37579fc7abe))
* 🚀 Add basic timing task function ([04a7608](https://github.com/viarotel-org/escrcpy/commit/04a760897e7dccc91acc1d15af016fbcc1acc380))
* 🚀 Add timing task entrance ([8393c85](https://github.com/viarotel-org/escrcpy/commit/8393c854b312abf616367f797c3d300217dcd9d3))
* 🚀 添加定时任务入口 ([6ce66d4](https://github.com/viarotel-org/escrcpy/commit/6ce66d4d6349554333988505cf072f913d57532c))


### Bug Fixes

* 🐛 The internationalization problem of repairing path selector ([8e6af20](https://github.com/viarotel-org/escrcpy/commit/8e6af2087e86a649ff0b89394978add4dc2328e2))
* 💄 Optimize wireless connection user interface ([50ae742](https://github.com/viarotel-org/escrcpy/commit/50ae7426c0d2c329173d9d7b8e160d1faddaef00))


### Performance Improvements

* 💄 Optimization of the operation bar at the top of the equipment list ([81bd3d9](https://github.com/viarotel-org/escrcpy/commit/81bd3d986bc091113cac3536af3e108653813b39))
* 💄 Optimized operation button layout ([16f9535](https://github.com/viarotel-org/escrcpy/commit/16f953538b819b9cfaad59e9c8f3eb9d32d0f5b1))

## [1.21.4](https://github.com/viarotel-org/escrcpy/compare/v1.21.3...v1.21.4) (2024-07-14)


### Performance Improvements

* ♻️ Optimize custom startup performance ([abd468b](https://github.com/viarotel-org/escrcpy/commit/abd468bd433e14bdda737f42e748ca7a947b2917))
* ♻️ Perfect allSettledWrapper method ([5b7d0af](https://github.com/viarotel-org/escrcpy/commit/5b7d0af683a56ef93bda8708e83bbda0258d531a))

## [1.21.3](https://github.com/viarotel-org/escrcpy/compare/v1.21.2...v1.21.3) (2024-07-13)


### Bug Fixes

* Fix the width problem of custom startup pop-up windows ([9a7e56b](https://github.com/viarotel-org/escrcpy/commit/9a7e56b8ebc08fb20eadf0b2f853441ea28c6a80))

## [1.21.2](https://github.com/viarotel-org/escrcpy/compare/v1.21.1...v1.21.2) (2024-07-13)


### Bug Fixes

* 🐛 Fix terminal style abnormalities in dark theme ([3d4dc7c](https://github.com/viarotel-org/escrcpy/commit/3d4dc7c98164fd01780989e892948c06f30018a3))


### Performance Improvements

* ♻️ Improve code robustness ([2f389af](https://github.com/viarotel-org/escrcpy/commit/2f389af834413b9018cad1b3ae977902386fb5da))
* 🚀 Optimize batch operation interaction ([343eab2](https://github.com/viarotel-org/escrcpy/commit/343eab2e110d065869ff95140b2ba98a365dd65d))

## [1.21.1](https://github.com/viarotel-org/escrcpy/compare/v1.21.0...v1.21.1) (2024-07-13)


### Bug Fixes

* 🐛 Fix dependency build errors ([5b02621](https://github.com/viarotel-org/escrcpy/commit/5b026215a9f964b08fd86503d3e5204a60b559ef))

## [1.21.0](https://github.com/viarotel-org/escrcpy/compare/v1.20.1...v1.21.0) (2024-07-13)


### Features

* 🎉 Support batch execution script function ([8097022](https://github.com/viarotel-org/escrcpy/commit/8097022798ca3ea95ed6530a722f321a862f2e23))
* 🚀 Support execution script function ([2013413](https://github.com/viarotel-org/escrcpy/commit/2013413611b3efe44811b230ceea036eba310026))


### Bug Fixes

* 🐛 Repair the problem of equipment width in the English state ([25c42d9](https://github.com/viarotel-org/escrcpy/commit/25c42d94ec38210c519db78ad60b32813e9ff2f5))
* 📝 Update Translation ([33b0181](https://github.com/viarotel-org/escrcpy/commit/33b018110cc7727a822f61b97ae5c5f1211adb0c))


### Performance Improvements

* ✅ Support batch screenshot and other performance optimization ([db9e3e7](https://github.com/viarotel-org/escrcpy/commit/db9e3e791e3a168c2f3cdef75d5cf1f834bce484))
* ✨ Support for custom startup mirroring ([677f30c](https://github.com/viarotel-org/escrcpy/commit/677f30cdc2ab87aef1cf2c3ec1b1d3bc066342c6))
* 🐛 Fix the problem of frequently trigger preservation of preferences ([8261916](https://github.com/viarotel-org/escrcpy/commit/826191617215db3cf027f0ec22530052c8dd97fe))

## [1.20.1](https://github.com/viarotel-org/escrcpy/compare/v1.20.0...v1.20.1) (2024-07-04)


### Bug Fixes

* 🐛 Fix batch text spelling errors ([062c689](https://github.com/viarotel-org/escrcpy/commit/062c689755df5bcc5f8e38605c7f101762d7ada0))

## [1.20.0](https://github.com/viarotel-org/escrcpy/compare/v1.19.4...v1.20.0) (2024-07-04)


### Features

* ✨ Add batch installation application function ([37ce245](https://github.com/viarotel-org/escrcpy/commit/37ce2457bce9a1b661c6db7162023f53268833f5))


### Performance Improvements

* 🚀 Add mouse binding options ([7ee4ba4](https://github.com/viarotel-org/escrcpy/commit/7ee4ba4f2b177e6dbfce85036425b51bfa35ecff))

## [1.19.4](https://github.com/viarotel-org/escrcpy/compare/v1.19.3...v1.19.4) (2024-07-02)


### Bug Fixes

* 🐛 Fix terminal style problems ([9fc1ded](https://github.com/viarotel-org/escrcpy/commit/9fc1ded583fd1c48bdb1890e7b27021920716cbc))
* Update Chinese language translations ([b8d77e3](https://github.com/viarotel-org/escrcpy/commit/b8d77e39214823b6c7903f926d68aead4f00274b))


### Performance Improvements

* 🚀 Update to scrcpy v2.5 ([22cc5a3](https://github.com/viarotel-org/escrcpy/commit/22cc5a3bc722d882a70e70ea2f45aa7577b01df5))

## [1.19.3](https://github.com/viarotel-org/escrcpy/compare/v1.19.2...v1.19.3) (2024-06-13)


### Bug Fixes

* 🐛 Abnormal operations cause the program that cannot be closed ([b989140](https://github.com/viarotel-org/escrcpy/commit/b9891404f4251b7fa22cc0481d1cda29c11092dd))

## [1.19.2](https://github.com/viarotel-org/escrcpy/compare/v1.19.1...v1.19.2) (2024-06-03)


### Bug Fixes

* 🐛 Automatically apply local languages ([0cc8208](https://github.com/viarotel-org/escrcpy/commit/0cc8208dd1bb51f700dcab213bd598ba07186bbb))

## [1.19.1](https://github.com/viarotel-org/escrcpy/compare/v1.19.0...v1.19.1) (2024-05-26)


### Bug Fixes

* 🐛 In some cases, the light mode is abnormal ([ea227e0](https://github.com/viarotel-org/escrcpy/commit/ea227e0792b4938c8763efc833c34e8e7d587323))
* 🐛 Search for shortcut key conflicts ([c70e6ca](https://github.com/viarotel-org/escrcpy/commit/c70e6ca2fc716ecea495b032ec0c9f4c2fc7e421))


### Performance Improvements

* ♻️ Search prompts ([0d963aa](https://github.com/viarotel-org/escrcpy/commit/0d963aab65297964a19b5e7ed1982732e96bcfcb))

## [1.19.0](https://github.com/viarotel-org/escrcpy/compare/v1.18.4...v1.19.0) (2024-05-15)


### Features

* 🚀 Add page search function ([6dd8244](https://github.com/viarotel-org/escrcpy/commit/6dd8244ed58b8bb4cde17c9fe991ad5704e55057))
* 🚀 Update dependencies to support ESM ([9f1696f](https://github.com/viarotel-org/escrcpy/commit/9f1696f289bbc8f833e9a6494d18f1d5d025bf9c))


### Bug Fixes

* 🐛 Resolving build failures ([8460945](https://github.com/viarotel-org/escrcpy/commit/8460945bd62de0d9be0b9767a3a0ece809ef05f0))
* 🐛 Tips unavailable ([603e4e9](https://github.com/viarotel-org/escrcpy/commit/603e4e98d251a14ffdde2b48f1f064522154e6fe))


### Performance Improvements

* ♻️ FindInPage API ([fcf8269](https://github.com/viarotel-org/escrcpy/commit/fcf8269e0eba3638d8f9364e5c238c406b6fc9fe))
* ♻️ Optimize dark mode ([2f2e1cf](https://github.com/viarotel-org/escrcpy/commit/2f2e1cfcd6ff6eae376bd260dc16d1e674e34286))
* ♻️ Search interaction ([a195b7e](https://github.com/viarotel-org/escrcpy/commit/a195b7ead7c6664e0138f99a58b67f6800fb681f))
* ♻️ Search variable name ([7c55e50](https://github.com/viarotel-org/escrcpy/commit/7c55e50edc1afc162696b9581ae5d25c01580ffc))
* 🐛 Global search error ([091d503](https://github.com/viarotel-org/escrcpy/commit/091d5035dd7d6d91f7377d3cfb738c21d0c8e4f3))
* 🚀 优化页面查找工具性能 ([8587977](https://github.com/viarotel-org/escrcpy/commit/8587977627ba1c8635b6b536dc88aeb5c067da5c))

## [1.18.4](https://github.com/viarotel-org/escrcpy/compare/v1.18.3...v1.18.4) (2024-05-04)


### Bug Fixes

* 🐛 Wireless adb does not support Spaces ([1f27597](https://github.com/viarotel-org/escrcpy/commit/1f27597ff3c31fa88867199ca13e43ba20ffa088))

## [1.18.3](https://github.com/viarotel-org/escrcpy/compare/v1.18.2...v1.18.3) (2024-04-12)


### Performance Improvements

* ♻️ i18n configuration ([1ca0469](https://github.com/viarotel-org/escrcpy/commit/1ca0469ff2df2ecf66b07bb3a24040490cd8563b))

## [1.18.2](https://github.com/viarotel-org/escrcpy/compare/v1.18.1...v1.18.2) (2024-04-11)


### Bug Fixes

* 🐛 zh_TW Language support ([885af3a](https://github.com/viarotel-org/escrcpy/commit/885af3aa1d238a18487727ca13a6bf739dca6934))

## [1.18.1](https://github.com/viarotel-org/escrcpy/compare/v1.18.0...v1.18.1) (2024-04-11)


### Bug Fixes

* 🔧 Repair merge zh-TW failed ([81ff63f](https://github.com/viarotel-org/escrcpy/commit/81ff63f1fb2703616b6fb195e0bb510a597514a8))


### Performance Improvements

* 🔧 Update workflows ([343423e](https://github.com/viarotel-org/escrcpy/commit/343423ea77418561f156cfd9f9e3a6bc559b0baa))

## [1.18.0](https://github.com/viarotel-org/escrcpy/compare/v1.17.8...v1.18.0) (2024-04-11)


### Features

* Add a simple zh_TW Traditional Chinese locale ([cec6539](https://github.com/viarotel-org/escrcpy/commit/cec6539c1dde2551edf284d5e8aca1a101a583b6))

## [1.17.8](https://github.com/viarotel-org/escrcpy/compare/v1.17.7...v1.17.8) (2024-03-29)


### Bug Fixes

* 🐛 Camera configuration conflict ([07cc5f3](https://github.com/viarotel-org/escrcpy/commit/07cc5f3cc2140a0fa90ae1d72608cc2c468bb80e))
* 🐛 OTG configuration conflict ([576d287](https://github.com/viarotel-org/escrcpy/commit/576d287cf4636564d526d2af6aa4e9c5aaa1f83b))
* 🐛 OTG mode: could not turn screen off ([c5bed0e](https://github.com/viarotel-org/escrcpy/commit/c5bed0e895461c21e3588314b6e244074403610e))

## [1.17.7](https://github.com/viarotel-org/escrcpy/compare/v1.17.6...v1.17.7) (2024-03-27)


### Bug Fixes

* ♻️ Remove the redundant imports ([a06708f](https://github.com/viarotel-org/escrcpy/commit/a06708ff19f31ea9231e620a5f780b8c714b0feb))


### Performance Improvements

* ♻️ Optimize delete history logic ([780e3b9](https://github.com/viarotel-org/escrcpy/commit/780e3b9abc199800b0cdb10c5d48d591cf91cf29))
* ♻️ Support delete historical connection ([c82560f](https://github.com/viarotel-org/escrcpy/commit/c82560f205321653d51d74ea3e3b44e96c41a96f))
* 💄 Wireless style optimization ([ba51fe3](https://github.com/viarotel-org/escrcpy/commit/ba51fe3db79c8beb81a237baf2454a0a5c1eb041))

## [1.17.6](https://github.com/viarotel-org/escrcpy/compare/v1.17.5...v1.17.6) (2024-03-21)


### Performance Improvements

* ♻️ Supports automatic execution of mirrors on devices ([11e0884](https://github.com/viarotel-org/escrcpy/commit/11e0884c1128ec431f31f5025571eecbd3065a82))

## [1.17.5](https://github.com/viarotel-org/escrcpy/compare/v1.17.4...v1.17.5) (2024-03-17)


### Performance Improvements

* 🌐 Improve i8n ([4fe55a3](https://github.com/viarotel-org/escrcpy/commit/4fe55a3329f325cb254515f364867e107dfdb278))

## [1.17.4](https://github.com/viarotel-org/escrcpy/compare/v1.17.3...v1.17.4) (2024-03-14)


### Performance Improvements

* ♻️ Options in the preference settings ([dc711cb](https://github.com/viarotel-org/escrcpy/commit/dc711cbb64ff12e542974c07a817ec46a2f15700))

## [1.17.3](https://github.com/viarotel-org/escrcpy/compare/v1.17.2...v1.17.3) (2024-03-13)


### Performance Improvements

* ♻️ Remove console log ([6e25eb7](https://github.com/viarotel-org/escrcpy/commit/6e25eb7ad6888065fa35bee3cddf33a55cc9fb70))

## [1.17.2](https://github.com/viarotel-org/escrcpy/compare/v1.17.1...v1.17.2) (2024-03-10)


### Bug Fixes

* 🐛 Abnormal built-in terminal adb command ([368551a](https://github.com/viarotel-org/escrcpy/commit/368551a954664548f6b60ce7f9c6b8be30923edd))


### Performance Improvements

* ♻️ Update eslint config ([bf2d2b4](https://github.com/viarotel-org/escrcpy/commit/bf2d2b47b41d63f5d6ba69c5c11c46494a71813f))

## [1.17.1](https://github.com/viarotel-org/escrcpy/compare/v1.17.0...v1.17.1) (2024-03-05)


### Performance Improvements

* ♻️ Interactive logic optimization ([193f80a](https://github.com/viarotel-org/escrcpy/commit/193f80a2a4611bb718ab3754249ed2b3d688e5a2))
* ♻️ Optimize design and code ([d507c2d](https://github.com/viarotel-org/escrcpy/commit/d507c2d0dbf5699ab0f311d78d1686ea36332b51))
* ♻️ Optimize equipment operation ([389ac33](https://github.com/viarotel-org/escrcpy/commit/389ac335b8801076ff9bb89c0c5f4899d142ff1b))
* ➖ Remove redundant packages ([f9e4a0e](https://github.com/viarotel-org/escrcpy/commit/f9e4a0e77465e3e89e5058553383dec104fc096f))
* 💄 Optimize dark mode styles ([1cac054](https://github.com/viarotel-org/escrcpy/commit/1cac054d413e3f1b56e9dd8e430671805d7fe3ae))

## [1.17.0](https://github.com/viarotel-org/escrcpy/compare/v1.16.8...v1.17.0) (2024-03-04)


### Features

* 🎉 Update to scrcpy v2.4 ([02a4d39](https://github.com/viarotel-org/escrcpy/commit/02a4d398208fdb14a6935eb1994e23a8364a9f7a))

## [1.16.8](https://github.com/viarotel-org/escrcpy/compare/v1.16.7...v1.16.8) (2023-12-27)


### Bug Fixes

* 🐛 The maximum size description error ([01fd926](https://github.com/viarotel-org/escrcpy/commit/01fd9264a6f5ad03a0ab2de3cfba5e1d1e4c0924))

## [1.16.7](https://github.com/viarotel-org/escrcpy/compare/v1.16.6...v1.16.7) (2023-12-19)


### Performance Improvements

* ♻️ Options describe ([1349b2a](https://github.com/viarotel-org/escrcpy/commit/1349b2a1f66c99413420a4fa93fcada62863a6cb))

## [1.16.6](https://github.com/viarotel-org/escrcpy/compare/v1.16.5...v1.16.6) (2023-12-19)


### Miscellaneous Chores

* release 1.16.6 ([6d7778a](https://github.com/viarotel-org/escrcpy/commit/6d7778a6ca557d0605835893f767faeab4fc8656))

## [1.16.5](https://github.com/viarotel-org/escrcpy/compare/v1.16.4...v1.16.5) (2023-12-19)


### Performance Improvements

* 📝 Control in stop charging ([8707eb5](https://github.com/viarotel-org/escrcpy/commit/8707eb54096d589a33b4ee138710033aa60071ed))

## [1.16.4](https://github.com/viarotel-org/escrcpy/compare/v1.16.3...v1.16.4) (2023-12-19)


### Bug Fixes

* 🐛 Pairing code type issue ([889fe8c](https://github.com/viarotel-org/escrcpy/commit/889fe8c805e968feefc73661aa125ee0e197c006))

## [1.16.3](https://github.com/viarotel-org/escrcpy/compare/v1.16.2...v1.16.3) (2023-12-03)


### Performance Improvements

* 🚀 Update scrcpy v2.3.1 ([3566655](https://github.com/viarotel-org/escrcpy/commit/3566655f46b7221973386ff423d91c426907386d))

## [1.16.2](https://github.com/viarotel-org/escrcpy/compare/v1.16.1...v1.16.2) (2023-12-02)


### Bug Fixes

* 🐛 Bps unit error ([07f7ded](https://github.com/viarotel-org/escrcpy/commit/07f7ded0b5e1a2404b89217816d08eac5c904ba2))

## [1.16.1](https://github.com/viarotel-org/escrcpy/compare/v1.16.0...v1.16.1) (2023-11-26)


### Bug Fixes

* 🐛 linux build error ([802f16f](https://github.com/viarotel-org/escrcpy/commit/802f16f7f00f28cc3319af6da9883c9efa299559))

## [1.16.0](https://github.com/viarotel-org/escrcpy/compare/v1.15.0...v1.16.0) (2023-11-26)


### Performance Improvements

* ⚡️ Add webSocket ([ae96df0](https://github.com/viarotel-org/escrcpy/commit/ae96df03d40c8f2d2543910c3d6e1bc85978fedd))
* ✨ Update to scrcpy v2.3 ([9e4f432](https://github.com/viarotel-org/escrcpy/commit/9e4f432333a41d56c9393853ea35b48375583d00))
* 🍻 Update base copilot ([5ac5ee6](https://github.com/viarotel-org/escrcpy/commit/5ac5ee6e970ed7523fd27280a92ccb105da26b26))


### Miscellaneous Chores

* release 1.16.0 ([64d4486](https://github.com/viarotel-org/escrcpy/commit/64d44863c5942c8e9a9b42a42bab2cb04b22c2d3))

## [1.15.0](https://github.com/viarotel-org/escrcpy/compare/v1.14.3...v1.15.0) (2023-11-18)


### Features

* 添加投屏窗口大小控制 ([97d7868](https://github.com/viarotel-org/escrcpy/commit/97d7868abaf321a5693b621b97af82ecf3fa9ada))


### Performance Improvements

* 🚀 Add window position option ([866aa2c](https://github.com/viarotel-org/escrcpy/commit/866aa2cfd253f702112367a857c88c40714c1065))

## [1.14.3](https://github.com/viarotel-org/escrcpy/compare/v1.14.2...v1.14.3) (2023-11-17)


### Performance Improvements

* ♻️ Add context menu ([f0f25a7](https://github.com/viarotel-org/escrcpy/commit/f0f25a79ab8f85d590cbe83de742ae4ea32ad5a5))
* ♻️ Optimize extended menu bar interaction ([de9352c](https://github.com/viarotel-org/escrcpy/commit/de9352cf8ee21c9a8feac4da711dc5c8c1640c76))
* 📝 Optimization preferences description ([30eca50](https://github.com/viarotel-org/escrcpy/commit/30eca508373c32b44628dcc455d1315ac6e34253))

## [1.14.2](https://github.com/viarotel-org/escrcpy/compare/v1.14.1...v1.14.2) (2023-11-16)


### Performance Improvements

* ♻️ Optimize autoConnect historical devices ([755a130](https://github.com/viarotel-org/escrcpy/commit/755a130ec0a0756c85d077ee1723c50457285802))
* 💡 Add autoConnect option ([a57b847](https://github.com/viarotel-org/escrcpy/commit/a57b847dd910a16ebdbdfa93683e5e2540849aa7))

## [1.14.1](https://github.com/viarotel-org/escrcpy/compare/v1.14.0...v1.14.1) (2023-11-14)


### Bug Fixes

* 🐛 Abnormal terminal theme ([20d37c1](https://github.com/viarotel-org/escrcpy/commit/20d37c11b4e7a48a046e8b08b693d0191c4aaf77))

## [1.14.0](https://github.com/viarotel-org/escrcpy/compare/v1.13.5...v1.14.0) (2023-11-14)


### Features

* 🎉 Add Terminal Debugging ([fdf40c7](https://github.com/viarotel-org/escrcpy/commit/fdf40c70e87a7e6fa79acdde16b6222b19a66a30))


### Performance Improvements

* ♻️ Optimize terminal performance ([d3afc4b](https://github.com/viarotel-org/escrcpy/commit/d3afc4ba626332622a86aa46078016d5883960d2))
* 💄 Update terminal style ([5b6b8d1](https://github.com/viarotel-org/escrcpy/commit/5b6b8d11501b19772c26a6693e57938acfdb6590))
* 🚨 Optimization error prompt ([b759502](https://github.com/viarotel-org/escrcpy/commit/b75950298feb599fdfe7ff9cad9edcae1cd79871))

## [1.13.5](https://github.com/viarotel-org/escrcpy/compare/v1.13.4...v1.13.5) (2023-11-11)


### Performance Improvements

* ♻️ Mirror group shutdown logic ([296e21d](https://github.com/viarotel-org/escrcpy/commit/296e21dfcf5f2fb28eed1159757bddb15e00f515))
* ♻️ Optimize mirror group ([5793c24](https://github.com/viarotel-org/escrcpy/commit/5793c246fa7e678b49d8d3c4e388de04fa7e82fb))

## [1.13.4](https://github.com/viarotel-org/escrcpy/compare/v1.13.3...v1.13.4) (2023-11-10)


### Performance Improvements

* ♻️ Optimization updater ([61ccd4a](https://github.com/viarotel-org/escrcpy/commit/61ccd4a4690a1da46a492ef4b6f78ba0778619fd))
* ♻️ Optimize mirror group ([81c007f](https://github.com/viarotel-org/escrcpy/commit/81c007f9d0617371b717e5f6eba5a9fa474456d6))

## [1.13.3](https://github.com/viarotel-org/escrcpy/compare/v1.13.2...v1.13.3) (2023-11-10)


### Bug Fixes

* 🐛 Recording prompt and file format errors ([bfdad9e](https://github.com/viarotel-org/escrcpy/commit/bfdad9e8dee31f0c8e59078ebbed646bab499375))


### Performance Improvements

* ♻️ Optimize Batch connection performance ([36de67b](https://github.com/viarotel-org/escrcpy/commit/36de67b59077574c28bd99356b4582baee39c0a4))
* ♻️ Optimize file push prompts ([4a3575f](https://github.com/viarotel-org/escrcpy/commit/4a3575f8ed916bf1a9afc88169fd324c9bb90b35))
* ♻️ Optimize historical device connections ([83f8c04](https://github.com/viarotel-org/escrcpy/commit/83f8c041dec72996af932d1e18833a295646cdce))
* ✨ Support bulk connecting to historical devices ([b7eb1dd](https://github.com/viarotel-org/escrcpy/commit/b7eb1dd0d67dac779ca3dd1eaed41040b4124810))

## [1.13.2](https://github.com/viarotel-org/escrcpy/compare/v1.13.1...v1.13.2) (2023-11-09)


### Bug Fixes

* 🐛 Gnirehtet state ([e5f78e7](https://github.com/viarotel-org/escrcpy/commit/e5f78e7f86d4734b9f355cf1fb49c533e04a1b89))
* 📝 Operation description ([517091a](https://github.com/viarotel-org/escrcpy/commit/517091a5ca56a367fae17c535783f3025afa8af9))


### Performance Improvements

* ♻️ Configure Incompatible Handling Mechanism ([c0e6a01](https://github.com/viarotel-org/escrcpy/commit/c0e6a015446916d638c2888626408f966d378e2e))
* ♻️ Optimize gnirehtet ([de3555b](https://github.com/viarotel-org/escrcpy/commit/de3555ba1e6cb92e11306e96bed4fffeeb82dedc))
* 💄 Optimize volume control and gnirehtet ([b40bdcf](https://github.com/viarotel-org/escrcpy/commit/b40bdcfd7d583fb46441a6d97f5b1db7f15196e6))
* 🚀 Add File push function ([70f8b46](https://github.com/viarotel-org/escrcpy/commit/70f8b469b9458b0f19064b8b5a038431e6c02878))
* 🚀 Add screen rotation shortcut menu ([dd601df](https://github.com/viarotel-org/escrcpy/commit/dd601dfdfed50c427ab9e17bc928a7c1c3ff9d4a))

## [1.13.1](https://github.com/viarotel-org/escrcpy/compare/v1.13.0...v1.13.1) (2023-11-08)


### Performance Improvements

* ♻️ Adjust volume control position ([1b3f49e](https://github.com/viarotel-org/escrcpy/commit/1b3f49edb2e263766f0c2cb9d0f67f463457199f))
* ♻️ Optimize configuration file logic ([5f8cc5a](https://github.com/viarotel-org/escrcpy/commit/5f8cc5a01312b95bd177509b824f1f2c7a8a531e))
* 🚀 Add volume control ([1505518](https://github.com/viarotel-org/escrcpy/commit/15055188e1cf6296f8d73f772bad2f681996e9f3))

## [1.13.0](https://github.com/viarotel-org/escrcpy/compare/v1.12.4...v1.13.0) (2023-11-07)


### Features

* 🎉 Add mirror group function ([0c9d36f](https://github.com/viarotel-org/escrcpy/commit/0c9d36fddbd7989073c514bc56a136ad3dc6f98d))


### Bug Fixes

* 🐛 Repair style ([96bfc77](https://github.com/viarotel-org/escrcpy/commit/96bfc7770e5142965540fec2d19a84b74106629c))


### Performance Improvements

* ♻️ Optimize mirror group ([cf9c82d](https://github.com/viarotel-org/escrcpy/commit/cf9c82dcbcbfdd77f66242298a8309d2e5926044))
* ♻️ optimize mirror group tips ([46defbf](https://github.com/viarotel-org/escrcpy/commit/46defbf680330ef8efecc6fb5f7a553f7ac5692a))
* ♻️ Optimize preferences ([7a6417e](https://github.com/viarotel-org/escrcpy/commit/7a6417ecf42082798e5eaa93a2552ddff686ebda))
* ♻️ Optimize window control ([0530ed3](https://github.com/viarotel-org/escrcpy/commit/0530ed38efa22e36fa6f784bda073a7264d98471))
* 💄 Update styles ([37da97b](https://github.com/viarotel-org/escrcpy/commit/37da97bc30153f0e5cbf1330ee1b4f44c5850fd0))
* 🚀 Add camera options ([5a04b4c](https://github.com/viarotel-org/escrcpy/commit/5a04b4c3b89f3094a412d545948080ed9804f0a3))

## [1.12.4](https://github.com/viarotel-org/escrcpy/compare/v1.12.3...v1.12.4) (2023-11-03)


### Bug Fixes

* 🐛 MacOS reduced to the tray to evoke failure ([d7bf83b](https://github.com/viarotel-org/escrcpy/commit/d7bf83b488df11cd18478b837de2c2c141bba470))

## [1.12.3](https://github.com/viarotel-org/escrcpy/compare/v1.12.2...v1.12.3) (2023-11-03)


### Bug Fixes

* 🐛 MacOS reduced to the tray to evoke failure ([6153bc4](https://github.com/viarotel-org/escrcpy/commit/6153bc4c52c7fa9c5b848407d218c95ac253f7b7))

## [1.12.2](https://github.com/viarotel-org/escrcpy/compare/v1.12.1...v1.12.2) (2023-11-03)


### Bug Fixes

* 🐛 Linux build error ([c74f03d](https://github.com/viarotel-org/escrcpy/commit/c74f03dff6ed9eb2ffa7e928e2ee7825019fc679))

## [1.12.1](https://github.com/viarotel-org/escrcpy/compare/v1.12.0...v1.12.1) (2023-11-03)


### Bug Fixes

* 🐛 Add gnirehtet fix option ([f9c6c32](https://github.com/viarotel-org/escrcpy/commit/f9c6c321744bcf5ab4e7e2aaab6f9fef1aa72cc0))
* 🐛 Display options cannot be changed ([3046746](https://github.com/viarotel-org/escrcpy/commit/3046746de808d91e776c6176a5613e5f44309b36))
* 🐛 Preference style ([0f72090](https://github.com/viarotel-org/escrcpy/commit/0f7209064beb26301e3e1e90269938fba03c7d70))
* 🐛 Reset preferences language not restored ([d691780](https://github.com/viarotel-org/escrcpy/commit/d69178013359b7f2499e4a66c4c124dcb425cfe2))
* 🐛 Unable to update path selector ([3279c34](https://github.com/viarotel-org/escrcpy/commit/3279c34bf014780a83ea38b475ef0698490041c7))
* 🐛 Video codec preset error ([1af9abd](https://github.com/viarotel-org/escrcpy/commit/1af9abd8eafce1874e2f122b16bcc0dee56f28d3))


### Performance Improvements

* ♻️ optimize Codec ([6154ffc](https://github.com/viarotel-org/escrcpy/commit/6154ffcfaeb060dbf66bfdf08c7af00a93f5de2d))
* ♻️ Optimize recording ([f4dfb2c](https://github.com/viarotel-org/escrcpy/commit/f4dfb2ca983fbacc436f2ce99a5d02bf0027014f))
* 🎨 Update preferences style ([e9befea](https://github.com/viarotel-org/escrcpy/commit/e9befea886b4a9152605aafeb7691d0ba3d0982a))

## [1.12.0](https://github.com/viarotel-org/escrcpy/compare/v1.11.9...v1.12.0) (2023-11-02)


### Features

* 🎉 Update Scrcpy to v2.2 ([5c401a8](https://github.com/viarotel-org/escrcpy/commit/5c401a82ff44dc3f02d296c64c6fdd4ab1d9523d))


### Bug Fixes

* 📝 Translate problem ([994cb09](https://github.com/viarotel-org/escrcpy/commit/994cb094285cb3d1dc5d14ecbf40e45e057033b8))


### Performance Improvements

* ♻️ Optimize OTG ([d908d58](https://github.com/viarotel-org/escrcpy/commit/d908d588b046a54e425879ce0a5469234a2053bc))
* 🎉 Add OTG functions ([e249d84](https://github.com/viarotel-org/escrcpy/commit/e249d847e497eca9f69e73849923711d33c0b454))
* 💄 Disable spellcheck ([b864fab](https://github.com/viarotel-org/escrcpy/commit/b864faba4466410a3f01f5186d55a214f251b5fc))
* 🔊 Add audio-output-buffer option ([c210140](https://github.com/viarotel-org/escrcpy/commit/c2101405366df871d3958721168d8ab32a3bc79f))
* 🚀 Update Preferences ([34800cf](https://github.com/viarotel-org/escrcpy/commit/34800cf5c192b6daf9be1556e610a028d6c97632))

## [1.11.9](https://github.com/viarotel-org/escrcpy/compare/v1.11.8...v1.11.9) (2023-10-31)


### Performance Improvements

* ♻️ Optimization gnirehtet and scrcpy ([9cf800c](https://github.com/viarotel-org/escrcpy/commit/9cf800c2a0a12acda7465ec800257376ada7a102))
* ♻️ Optimize Gnirehtet interaction ([a90e570](https://github.com/viarotel-org/escrcpy/commit/a90e5705b26f9eb07c8c38492bdaf64ca0e1f98e))

## [1.11.8](https://github.com/viarotel-org/escrcpy/compare/v1.11.7...v1.11.8) (2023-10-31)


### Bug Fixes

* 🎨 修复 macOS 设置主题跟随系统后 某些情况下循环触发导致死循环的问题 ([1d7b188](https://github.com/viarotel-org/escrcpy/commit/1d7b188885998552b4fd371ba76b666243cd743c))

## [1.11.7](https://github.com/viarotel-org/escrcpy/compare/v1.11.6...v1.11.7) (2023-10-31)


### Bug Fixes

* 🐛 macOS x64ArchFiles Errors ([151cb29](https://github.com/viarotel-org/escrcpy/commit/151cb2967960f91d12137da7ee03306d6e5a1677))

## [1.11.6](https://github.com/viarotel-org/escrcpy/compare/v1.11.5...v1.11.6) (2023-10-31)


### Bug Fixes

* 🐛 macOS x64ArchFiles Errors ([7dbca01](https://github.com/viarotel-org/escrcpy/commit/7dbca016044b156c6fb76b4c2e14a6cf920af32c))

## [1.11.5](https://github.com/viarotel-org/escrcpy/compare/v1.11.4...v1.11.5) (2023-10-31)


### Bug Fixes

* 🐛 macOS x64ArchFiles Errors ([ad3f77f](https://github.com/viarotel-org/escrcpy/commit/ad3f77f8a12666503ade9ecc4be747e901e63567))

## [1.11.4](https://github.com/viarotel-org/escrcpy/compare/v1.11.3...v1.11.4) (2023-10-31)


### Bug Fixes

* 🐛 macOS x64ArchFiles Errors ([4b4e116](https://github.com/viarotel-org/escrcpy/commit/4b4e11642b5bd35e37c25f6eea58cec49355bfb3))

## [1.11.3](https://github.com/viarotel-org/escrcpy/compare/v1.11.2...v1.11.3) (2023-10-31)


### Bug Fixes

* 🐛 Unix permission issues ([1279994](https://github.com/viarotel-org/escrcpy/commit/12799943ffe01b6196928599c92021d10e9210d0))
* 🐛 Unix permission issues ([dc9a3c4](https://github.com/viarotel-org/escrcpy/commit/dc9a3c4ae0c87384381dd3bb3311c19eadddf334))
* 🐛 x64ArchFiles Error ([82a99d9](https://github.com/viarotel-org/escrcpy/commit/82a99d9c134639580b16fc54df3332e3b75f4f87))

## [1.11.2](https://github.com/viarotel-org/escrcpy/compare/v1.11.1...v1.11.2) (2023-10-30)


### Bug Fixes

* 🐛 修复 macOS 打包失败的问题 ([1b2236c](https://github.com/viarotel-org/escrcpy/commit/1b2236c908b2b27cf85a50ef4b1a056df102c7de))

## [1.11.1](https://github.com/viarotel-org/escrcpy/compare/v1.11.0...v1.11.1) (2023-10-30)


### Bug Fixes

* 🐛 修复 macOS 打包失败的问题 ([37e2837](https://github.com/viarotel-org/escrcpy/commit/37e283784ec0da4cc8f173bc8a90a3d675eafa9c))

## [1.11.0](https://github.com/viarotel-org/escrcpy/compare/v1.10.2...v1.11.0) (2023-10-30)


### Features

* 🎉 Add gnirehtet reverse tethering function ([2c97189](https://github.com/viarotel-org/escrcpy/commit/2c9718997b97919b681e31ceabd87b1f96b13c07))


### Bug Fixes

* 🐛 gnirehtet custom dependent paths error ([cfd0e1d](https://github.com/viarotel-org/escrcpy/commit/cfd0e1dc5f2e248923def25cebe0cffba56125b7))


### Performance Improvements

* ♻️ Optimize Gnirehtet interaction ([e1237cd](https://github.com/viarotel-org/escrcpy/commit/e1237cd0505d4587345e674e7a65c2b97192ccb5))
* ♻️ 拆分依赖文件禁用冗余的警告信息 ([93ad836](https://github.com/viarotel-org/escrcpy/commit/93ad83689f191ef60a9faf0b97c47157889edc40))
* ♻️ 目录结构及描述调整 ([f9a32d6](https://github.com/viarotel-org/escrcpy/commit/f9a32d6f28a657be6f1c91f354fd5677756f5cf5))
* ♻️ 补充依赖及目录结构调整 ([b18256b](https://github.com/viarotel-org/escrcpy/commit/b18256b6fc9fee4dd9830e72a9b9b6707022dfc4))

## [1.10.2](https://github.com/viarotel-org/escrcpy/compare/v1.10.1...v1.10.2) (2023-10-28)


### Bug Fixes

* 🐛 修复设置主题跟随系统后没有生效的问题 ([95a83f4](https://github.com/viarotel-org/escrcpy/commit/95a83f4072c9428ec12dd18cab9f6f8566f83a1f))

## [1.10.1](https://github.com/viarotel-org/escrcpy/compare/v1.10.0...v1.10.1) (2023-10-28)


### Bug Fixes

* 🐛 修复 linux 无法启动镜像或录制服务以及修改自定义依赖目录的问题 ([d815643](https://github.com/viarotel-org/escrcpy/commit/d8156437bc8aa77f8c40a4d3fb9bba587f927436))

## [1.10.0](https://github.com/viarotel-org/escrcpy/compare/v1.9.1...v1.10.0) (2023-10-27)


### Features

* 🚀 新增支持 深色模式、国际化语言、运行日志等功能 ([4b13f58](https://github.com/viarotel-org/escrcpy/commit/4b13f5892bf2b1197fdb460ab4b88ccd60eeabd1))


### Bug Fixes

* 🐛 修复 linux 打包后图标丢失的问题 ([217d82d](https://github.com/viarotel-org/escrcpy/commit/217d82d03e98f6e3a0a9e8b8f737eccbb3fa5350))
* 🐛 修复安装路径包含空格会导致无法启动服务的问题 ([29ae786](https://github.com/viarotel-org/escrcpy/commit/29ae786768bafdf72e68a5a7c17bc9fa4d75ba9e))
* 🐛 修复录制结束点击取消异常弹窗以及点击重启服务没有反应的问题 ([054c55b](https://github.com/viarotel-org/escrcpy/commit/054c55b26deeff7b5c90b93aa0ca588fa0a5ce43))
* 🔧 修复自定义路径功能没有生效的问题 ([894b581](https://github.com/viarotel-org/escrcpy/commit/894b581988995ad8e6e386041b231722ca9e7ffa))


### Performance Improvements

* 📝 翻译设备列表 ([aeae0c6](https://github.com/viarotel-org/escrcpy/commit/aeae0c65bb1d083a70a9d3f95e973264e4944ad4))
* 🚀 关于页面国际化 ([24e9399](https://github.com/viarotel-org/escrcpy/commit/24e939998e84c126f9a0689ad23809c708913036))

## [1.9.1](https://github.com/viarotel-org/escrcpy/compare/v1.9.0...v1.9.1) (2023-10-24)


### Performance Improvements

* 💄 窗口控制及交互逻辑优化 ([52514e2](https://github.com/viarotel-org/escrcpy/commit/52514e2daf07ea769dd53bc81ed7e9e0bfd64bb0))

## [1.9.0](https://github.com/viarotel-org/escrcpy/compare/v1.8.17...v1.9.0) (2023-10-24)


### Features

* 🚀 添加 i18n 初步支持 ([18d490f](https://github.com/viarotel-org/escrcpy/commit/18d490f3716b86f99c00cb3150e444ead2e69021))


### Bug Fixes

* 🐛 修复 macOS 最小化到托盘后状态栏图标不显示的问题 ([a789826](https://github.com/viarotel-org/escrcpy/commit/a78982673fe7ddb559c49d99453fd0a87a59981f))

## [1.8.17](https://github.com/viarotel-org/escrcpy/compare/v1.8.16...v1.8.17) (2023-10-23)


### Bug Fixes

* 🐛 尝试修复构建失败 ([daeb9e5](https://github.com/viarotel-org/escrcpy/commit/daeb9e5facfe9575182462f05106ed3b6cacee41))

## [1.8.16](https://github.com/viarotel-org/escrcpy/compare/v1.8.15...v1.8.16) (2023-10-23)


### Performance Improvements

* ✨ 采用新的 Logo 设计 ([3bf79d3](https://github.com/viarotel-org/escrcpy/commit/3bf79d37d1f5957abf8d50067f2eda64859131c1))

## [1.8.15](https://github.com/viarotel-org/escrcpy/compare/v1.8.14...v1.8.15) (2023-10-22)


### Bug Fixes

* 🐛 修复 Linux 平台启动白屏无法正常使用的问题 ([54e713b](https://github.com/viarotel-org/escrcpy/commit/54e713b1dfb1f1ed470e13f7ea512442a53764fc))

## [1.8.14](https://github.com/viarotel-org/escrcpy/compare/v1.8.13...v1.8.14) (2023-10-21)


### Bug Fixes

* 🐛 修复 linux 打包配置错误的问题 ([a9668d9](https://github.com/viarotel-org/escrcpy/commit/a9668d943f13ae77c22aa84d99f998d8c3086781))

## [1.8.13](https://github.com/viarotel-org/escrcpy/compare/v1.8.12...v1.8.13) (2023-10-21)


### Performance Improvements

* 🚀 为 windows 添加 ARM64 软件包编译 ([368e8ee](https://github.com/viarotel-org/escrcpy/commit/368e8ee45501b4c68f3509341421d797e5d249ca))
* 🚀 支持所有平台在点击关闭按钮时选择是否保存到托盘中的功能 ([8360198](https://github.com/viarotel-org/escrcpy/commit/83601984ec2015f007fbe635ea71e7866023102e))

## [1.8.12](https://github.com/viarotel-org/escrcpy/compare/v1.8.11...v1.8.12) (2023-10-21)


### Bug Fixes

* 🐛 修复 macOS 或 linux 下自定义依赖选项描述错误的问题 ([0d4b1ce](https://github.com/viarotel-org/escrcpy/commit/0d4b1cee13bb4d0df429cb89d53b979c142c0101))

## [1.8.11](https://github.com/viarotel-org/escrcpy/compare/v1.8.10...v1.8.11) (2023-10-21)


### Performance Improvements

* 🔨 优化窗口默认大小 ([393e899](https://github.com/viarotel-org/escrcpy/commit/393e899eebd684b16388797415b8c843baf110c2))

## [1.8.10](https://github.com/viarotel-org/escrcpy/compare/v1.8.9...v1.8.10) (2023-10-20)


### Bug Fixes

* 🐛 修复 macOS 窗口问题 ([f768566](https://github.com/viarotel-org/escrcpy/commit/f768566636f737bc98d89c443de27a69b343a21f))

## [1.8.9](https://github.com/viarotel-org/escrcpy/compare/v1.8.8...v1.8.9) (2023-10-20)


### Bug Fixes

* 🐛 修复 macOS 窗口过小导致出现横向滚动条的问题 ([8ee34ca](https://github.com/viarotel-org/escrcpy/commit/8ee34cafee6c3ddbb866b9c58731c16b4287648c))

## [1.8.8](https://github.com/viarotel-org/escrcpy/compare/v1.8.7...v1.8.8) (2023-10-20)


### Bug Fixes

* 🚀 修复 macOS 简单关闭应用重新打开时报错的问题 ([4b259c3](https://github.com/viarotel-org/escrcpy/commit/4b259c3771d8923dec55845b6070d06a36e83e3b))

## [1.8.7](https://github.com/viarotel-org/escrcpy/compare/v1.8.6...v1.8.7) (2023-10-20)


### Bug Fixes

* 🐛 修复打包多个平台时可能生成重复文件导致发布软件包失败的问题 ([e89a7a5](https://github.com/viarotel-org/escrcpy/commit/e89a7a564fe8b685e8057b398921eaa383af8ac2))

## [1.8.6](https://github.com/viarotel-org/escrcpy/compare/v1.8.5...v1.8.6) (2023-10-20)


### Bug Fixes

* 🔧 修复 macOS 无法正确获取系统依赖路径的问题 ([2352593](https://github.com/viarotel-org/escrcpy/commit/23525930a44c0e9bdd338fb55e11059ad7391484))

## [1.8.5](https://github.com/viarotel-org/escrcpy/compare/v1.8.4...v1.8.5) (2023-10-20)


### Bug Fixes

* 🚑️ 修复 Linux maintainer 问题 ([4e1542a](https://github.com/viarotel-org/escrcpy/commit/4e1542a54902a3177fe7448e59059b093168a653))

## [1.8.4](https://github.com/viarotel-org/escrcpy/compare/v1.8.3...v1.8.4) (2023-10-20)


### Bug Fixes

* 🚑️ 修复 Linux 打包失败的问题 ([96f85d8](https://github.com/viarotel-org/escrcpy/commit/96f85d8264d710b8b3b49da57d01981e4a08298b))

## [1.8.3](https://github.com/viarotel-org/escrcpy/compare/v1.8.2...v1.8.3) (2023-10-20)


### Bug Fixes

* 🚀 修复 MacOS 软件包安装后无线显示 Logo 的问题 ([77dd81b](https://github.com/viarotel-org/escrcpy/commit/77dd81b11533681bc0d9b62bfb77db8e40b27f71))

## [1.8.2](https://github.com/viarotel-org/escrcpy/compare/v1.8.1...v1.8.2) (2023-10-20)


### Bug Fixes

* 🔧 修复 Linux 及 MacOS 获取默认依赖路径异常的问题 ([87b533f](https://github.com/viarotel-org/escrcpy/commit/87b533f714204659f72b1d88c3fec895125ee590))
* 🔧 修复 MacOS ARM64 版本打包失败的问题 ([e9a8fc2](https://github.com/viarotel-org/escrcpy/commit/e9a8fc2a625c60707f842fd7bbb1ca41e777fad2))

## [1.8.1](https://github.com/viarotel-org/escrcpy/compare/v1.8.0...v1.8.1) (2023-10-20)


### Performance Improvements

* 🚀 支持创建更多架构的 MacOS 软件包格式 ([4780e7c](https://github.com/viarotel-org/escrcpy/commit/4780e7c5063fc2c103d1502c75a3fd3af6719d7b))

## [1.8.0](https://github.com/viarotel-org/escrcpy/compare/v1.7.1...v1.8.0) (2023-10-20)


### Features

* 🚀 初步添加对 Linux 以及 MacOS 的支持 ([569ed2e](https://github.com/viarotel-org/escrcpy/commit/569ed2e2fa13a48d9eeb3fa04b8346beca66414a))


### Bug Fixes

* 📝 偏好设置描述信息修改 ([23d68d4](https://github.com/viarotel-org/escrcpy/commit/23d68d475054ad2f82d5e90919ddc11934ae64fb))
* 🔧 设备列表标签显示细节调整 ([4f2f00e](https://github.com/viarotel-org/escrcpy/commit/4f2f00e3b54c944b39de991fbf59619bd40276ff))


### Performance Improvements

* 📝 设备备注文本框描述信息调整 ([379b325](https://github.com/viarotel-org/escrcpy/commit/379b3252f88410cda37abe90a32defd74cd8a1b2))

## [1.7.1](https://github.com/viarotel-org/escrcpy/compare/v1.7.0...v1.7.1) (2023-10-20)


### Bug Fixes

* 🚀 修复对设备进行独立配置时的一些问题 ([6ccd6d0](https://github.com/viarotel-org/escrcpy/commit/6ccd6d09a4220e16cf6c46d9502854028cfbc7c0))


### Performance Improvements

* 🎉 初步支持设置偏好设置的作用域范围 ([5dd328c](https://github.com/viarotel-org/escrcpy/commit/5dd328ceef1019ea00581f8bc34c2f3fbf9ae34a))

## [1.7.0](https://github.com/viarotel-org/escrcpy/compare/v1.6.10...v1.7.0) (2023-10-19)


### Features

* 🚀 新增支持导入及导出配置 ([326a133](https://github.com/viarotel-org/escrcpy/commit/326a13346050ac02a7b8ffab2aeadda3c803ec45))
* 🚀 新增支持添加设备备注 ([43f15be](https://github.com/viarotel-org/escrcpy/commit/43f15be265368766d122f752e59cd4ed623c695d))


### Performance Improvements

* ➕ 设备交互栏添加重启设备及打开通知栏功能 ([1341fb8](https://github.com/viarotel-org/escrcpy/commit/1341fb82ebaa3707c1f6661d750526ab3548a87c))

## [1.6.10](https://github.com/viarotel-org/escrcpy/compare/v1.6.9...v1.6.10) (2023-10-18)


### Performance Improvements

* 🚀 采用新的方法实现所有进程共享 isPackaged ([8a5f7d9](https://github.com/viarotel-org/escrcpy/commit/8a5f7d9f37cb371f4210149b880535ea677620ea))

## [1.6.9](https://github.com/viarotel-org/escrcpy/compare/v1.6.8...v1.6.9) (2023-10-17)


### Bug Fixes

* 🔧 优化 isPackaged 判断条件解决某些情况下资源路径解析异常的问题 ([fbd1885](https://github.com/viarotel-org/escrcpy/commit/fbd188511df20fffefa936d75edb812abe16baa0))

## [1.6.8](https://github.com/viarotel-org/escrcpy/compare/v1.6.7...v1.6.8) (2023-10-17)


### Performance Improvements

* 🚀 支持通过操作栏安装应用并提供相应安装反馈 ([3bd2075](https://github.com/viarotel-org/escrcpy/commit/3bd20753242c3f8b218bc23c4077495e0a1ecd7f))

## [1.6.7](https://github.com/viarotel-org/escrcpy/compare/v1.6.6...v1.6.7) (2023-10-17)


### Performance Improvements

* 📝 去除冗余的依赖项 ([a6744dc](https://github.com/viarotel-org/escrcpy/commit/a6744dc485d2abeba1f09a5c69e86d008c3c1c35))

## [1.6.6](https://github.com/viarotel-org/escrcpy/compare/v1.6.5...v1.6.6) (2023-10-17)


### Bug Fixes

* 🐛 build fix ([09c8dee](https://github.com/viarotel-org/escrcpy/commit/09c8deeca9d919502b77e3dfbd253ae8b77b651b))
* 🐛 修复 electron 资源路径问题 ([955756e](https://github.com/viarotel-org/escrcpy/commit/955756e114a485ec3595d39d5b45185a3970258f))

## [1.6.5](https://github.com/viarotel-org/escrcpy/compare/v1.6.4...v1.6.5) (2023-10-16)


### Bug Fixes

* 🐛 修复 App NextTick 错误 ([79d85eb](https://github.com/viarotel-org/escrcpy/commit/79d85ebeee8f7d93913f3f3f9aeeeb7d02fda292))

## [1.6.4](https://github.com/viarotel-org/escrcpy/compare/v1.6.3...v1.6.4) (2023-10-16)


### Bug Fixes

* 🐛 修复 electron-builder 配置异常导致打包的文件无法发布的问题 ([9a4efa5](https://github.com/viarotel-org/escrcpy/commit/9a4efa5e4ded0b1e4fc7dfe71f43eb953e8dc64e))
* 🚀 修复设备列表按钮状态变更影响布局变化的问题 ([83a8043](https://github.com/viarotel-org/escrcpy/commit/83a8043b2524b30d0c5993260a6f673d22563251))

## [1.6.3](https://github.com/viarotel-org/escrcpy/compare/v1.6.2...v1.6.3) (2023-10-16)


### Bug Fixes

* 🐛 修复打包后图标丢失的问题 ([58a66f1](https://github.com/viarotel-org/escrcpy/commit/58a66f1b8576bbaf1fc53649ccb786d4b62137d9))

## [1.6.2](https://github.com/viarotel-org/escrcpy/compare/v1.6.1...v1.6.2) (2023-10-13)


### Bug Fixes

* 🐛 修复USB未授权设备导致无线连接地址变为假值的问题 ([9c25325](https://github.com/viarotel-org/escrcpy/commit/9c25325d672a3447df21abe9bc01a7c22b440ec9))

## [1.6.1](https://github.com/viarotel-org/escrcpy/compare/v1.6.0...v1.6.1) (2023-10-13)


### Performance Improvements

* 🔨 自定义通用的文件存储路径相关逻辑完善 ([8455e86](https://github.com/viarotel-org/escrcpy/commit/8455e8692be67bc947f76ebcbd4ea4f476ccbca4))

## [1.6.0](https://github.com/viarotel-org/escrcpy/compare/v1.5.3...v1.6.0) (2023-10-13)


### Features

* 🚀 增加了对设备交互控制栏的支持 ([fd20736](https://github.com/viarotel-org/escrcpy/commit/fd207364a4cb68e352b594bf2d55905e53949a33))

## [1.5.3](https://github.com/viarotel-org/escrcpy/compare/v1.5.2...v1.5.3) (2023-10-13)


### Bug Fixes

* 🔧 修复点击无线模式没有反应的问题 ([9d55ef9](https://github.com/viarotel-org/escrcpy/commit/9d55ef9187c02099b9428de87f8e661b7b3d2163))

## [1.5.2](https://github.com/viarotel-org/escrcpy/compare/v1.5.1...v1.5.2) (2023-10-13)


### Bug Fixes

* 📝 修复高级配置标题语义不明的问题 ([218de1c](https://github.com/viarotel-org/escrcpy/commit/218de1c7a427f7348736d0c0207bd1c5592e8f3d))


### Performance Improvements

* 🚀 添加更多的高级配置并更新文档 ([922abd2](https://github.com/viarotel-org/escrcpy/commit/922abd2a1f051fe2ffbcc143aeb699f719a344f2))

## [1.5.1](https://github.com/viarotel-org/escrcpy/compare/v1.5.0...v1.5.1) (2023-10-12)


### Bug Fixes

* 🐛 去除页面组件冗余参数 ([8e5df15](https://github.com/viarotel-org/escrcpy/commit/8e5df15f6aad94e0eb783961605dc8032c253a7a))

## [1.5.0](https://github.com/viarotel-org/escrcpy/compare/v1.4.1...v1.5.0) (2023-10-12)


### Features

* 🚀 添加音视频录制功能以及更多的高级选项 ([b6986d1](https://github.com/viarotel-org/escrcpy/commit/b6986d14de2accee314dac1986f467fbd2893877))

## [1.4.1](https://github.com/viarotel-org/escrcpy/compare/v1.4.0...v1.4.1) (2023-10-12)


### Bug Fixes

* 🐛 修复检查更新失败没有提示的问题 ([6f733ea](https://github.com/viarotel-org/escrcpy/commit/6f733ea76d6ad805bc4c11f480f3bd07afc5615a))

## [1.4.0](https://github.com/viarotel-org/escrcpy/compare/v1.3.3...v1.4.0) (2023-10-11)


### Features

* 🚀 添加在线检查更新功能 ([8de04e0](https://github.com/viarotel-org/escrcpy/commit/8de04e0d6a178f159f2dbdeba888df54386dc64e))


### Bug Fixes

* 🔨 修复无线配对时表单验证错误 ([7cd9ea3](https://github.com/viarotel-org/escrcpy/commit/7cd9ea3ae5b6b264eb223d969770bae742aab4b1))
* 🔨 修复直接进行无线连接时没有处理配对设备的问题 ([4263d07](https://github.com/viarotel-org/escrcpy/commit/4263d07076647f8ce3a4d21db72deac73d3825a7))

## [1.3.3](https://github.com/viarotel-org/escrcpy/compare/v1.3.2...v1.3.3) (2023-09-26)


### Bug Fixes

* 🐛 修复触摸点配置描述错误的问题 ([4e2be23](https://github.com/viarotel-org/escrcpy/commit/4e2be23815418af1e693f53362948a6b6806a0a9))

## [1.3.2](https://github.com/viarotel-org/escrcpy/compare/v1.3.1...v1.3.2) (2023-09-19)


### Bug Fixes

* 🔧 修复旋转屏幕配置异常的问题 ([af7a319](https://github.com/viarotel-org/escrcpy/commit/af7a3192e4231be6dbc0bd681a14d7568b1e2ba2))

## [1.3.1](https://github.com/viarotel-org/escrcpy/compare/v1.3.0...v1.3.1) (2023-09-19)


### Bug Fixes

* 🔧 修复图标不透明的问题 ([24c011f](https://github.com/viarotel-org/escrcpy/commit/24c011f172eb8d4761090a0e036fae3f572d10bb))

## [1.3.0](https://github.com/viarotel-org/escrcpy/compare/v1.2.0...v1.3.0) (2023-09-19)


### Features

* ✨ 用户界面进行优化，制作了合适的 Logo ([1b96ffc](https://github.com/viarotel-org/escrcpy/commit/1b96ffca2ba8f1bf850ad428c02b2ca6cbc85db7))

## [1.2.0](https://github.com/viarotel-org/escrcpy/compare/v1.1.0...v1.2.0) (2023-09-19)


### Features

* 🎉 优化设备界面视图并添加虚拟控制栏配置 ([3be0682](https://github.com/viarotel-org/escrcpy/commit/3be0682078f9f6896fa9cd6a5128290820098889))

## [1.1.0](https://github.com/viarotel-org/escrcpy/compare/v1.0.2...v1.1.0) (2023-09-18)


### Features

* 🚀 增加了常用的 Scrcpy 高级配置 ([ac52df2](https://github.com/viarotel-org/escrcpy/commit/ac52df2add6b94d51a86576e40621d584f9c9832))

## [1.0.2](https://github.com/viarotel-org/escrcpy/compare/v1.0.1...v1.0.2) (2023-09-18)


### Performance Improvements

* 🚀 合并无线连接及有线连接到设备列表 ([e84f24e](https://github.com/viarotel-org/escrcpy/commit/e84f24e816e22cd83233dac240c2e384b50ae580))

## [1.0.1](https://github.com/viarotel-org/escrcpy/compare/v1.0.0...v1.0.1) (2023-09-16)


### Bug Fixes

* 🔧 去除未测试环境的打包以修复构建失败的问题 ([d6ec7fd](https://github.com/viarotel-org/escrcpy/commit/d6ec7fdfbe9a079619da5c97f8512cffb91491ce))

## 1.0.0 (2023-09-16)


### Features

* 📝 添加基本的有线连接支持 ([647a0c5](https://github.com/viarotel-org/escrcpy/commit/647a0c56062a930d6957d54495491580e36dca8b))
* 🚀 添加 Electron 基本支持 ([a46a5e1](https://github.com/viarotel-org/escrcpy/commit/a46a5e1154826079975e4e1a8b3a7e0955273f4d))
* 🚀 添加初步的构建及发布支持 ([c85f8fb](https://github.com/viarotel-org/escrcpy/commit/c85f8fb187c3f2d86c2f709e7aee839e74dfe090))
* 🚀 添加基本的无线连接功能 ([6dd2db9](https://github.com/viarotel-org/escrcpy/commit/6dd2db9da927beef6e298ebdaf47f45326fee513))


### Bug Fixes

* 🔧 修复 ADB 环境变量配置错误导致无法连接的问题 ([9ef7203](https://github.com/viarotel-org/escrcpy/commit/9ef720383e7af30640c7096f8d3cde84fd68a7b8))
