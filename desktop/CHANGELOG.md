# Changelog

## [2.3.1](https://github.com/viarotel-org/escrcpy/compare/v2.3.0...v2.3.1) (2026-01-27)


### Bug Fixes

* 🐛 Fixed the problem of being unable to click to enter the co-pilot entrance under Windows and Linux. ([c563d11](https://github.com/viarotel-org/escrcpy/commit/c563d111f99c2080f729dc44fb8cb4dce53c3c83))

## [2.3.0](https://github.com/viarotel-org/escrcpy/compare/v2.2.0...v2.3.0) (2026-01-22)


### Features

* 🚀 Optimize portable package configuration and add linux flatpak package support ([a7982db](https://github.com/viarotel-org/escrcpy/commit/a7982db1d03107143a8ac64e85d3b895f21b4e17))
* configure electron-log file path in debugger helper ([2242668](https://github.com/viarotel-org/escrcpy/commit/2242668afa139189a3f92efbff2e6460b5c69f90))


### Bug Fixes

* 🐛 handle copilot execution failures and adjust config max steps ([3601709](https://github.com/viarotel-org/escrcpy/commit/3601709dde4aeadcf8616d98bf7073c288c6c043))
* **win:** fully redirect user data to portable folder and fix CI workflow ([fe2fd89](https://github.com/viarotel-org/escrcpy/commit/fe2fd8937ec33a440eb00f45b0d2764132dd530f))


### Performance Improvements

* ✨ Optimize windows and linux window layout ([b63b59c](https://github.com/viarotel-org/escrcpy/commit/b63b59ca723b310f854afc6e77cb0fe6501661e7))


### Code Refactoring

* add platform simulation support and adjust window controls layout ([9c3a5b1](https://github.com/viarotel-org/escrcpy/commit/9c3a5b1042ff795b5bd3a2f947fc53506eaf4a29))
* adjust header and chat layout padding ([70fe60d](https://github.com/viarotel-org/escrcpy/commit/70fe60d3b62d34bf36f51094af28e01ebaba91ba))
* adjust layout padding for windows and linux platforms ([4e153cc](https://github.com/viarotel-org/escrcpy/commit/4e153ccbf3b3524e71463453c0891a2cc62a1b87))
* adjust widget dimensions and clear dialog messages ([ca6796f](https://github.com/viarotel-org/escrcpy/commit/ca6796f1fa95e8c17fa078084414edf5031e4948))
* implement immersive title bar and optimize window layout ([1e76d11](https://github.com/viarotel-org/escrcpy/commit/1e76d11668e6c7c39f4b8471c665fe7db62770d6))
* improve chat retry logic and ADB keyboard detection ([8e0e43c](https://github.com/viarotel-org/escrcpy/commit/8e0e43cd03b6094444cf37b25145ec6425159e78))
* remove dialog width constraints and improve file creation ([54e5553](https://github.com/viarotel-org/escrcpy/commit/54e55535eff5989b3a57255ce4326a44ecad48fd))
* remove quiet config option ([76f9d6c](https://github.com/viarotel-org/escrcpy/commit/76f9d6ce677fa645f5c50b981c3cba377feaff23))
* remove redundant success messages and unify dialog titles ([b1eac32](https://github.com/viarotel-org/escrcpy/commit/b1eac328826bf6263cc29d6cb66f1711e3635ac8))
* reorganize emitter module and update event emitter references ([4c3cc2d](https://github.com/viarotel-org/escrcpy/commit/4c3cc2d33879eeb74f8a12c23528d14d2fbce331))
* reorganize preference form layout with tabs and scroll ([7f0f864](https://github.com/viarotel-org/escrcpy/commit/7f0f86449990329df4478e474930157773e5b882))
* replace ExTooltipButton with native el-button title attribute ([8056977](https://github.com/viarotel-org/escrcpy/commit/80569772c6ff1e0a6d8d36ad7e28d0c8661db77b))

## [2.2.0](https://github.com/viarotel-org/escrcpy/compare/v2.1.7...v2.2.0) (2026-01-17)


### Features

* 🎉 Improve the accuracy and coverage of Copilot opening applications by obtaining information about installed applications on the device ([e2f27da](https://github.com/viarotel-org/escrcpy/commit/e2f27da08574d8ae3bcb8ee8c821909968115ce8))
* add keyboard shortcuts for connect and disconnect ([39293af](https://github.com/viarotel-org/escrcpy/commit/39293af392246bf055862ec4ae9e927b297a085c))
* auto-focus input when editing prompt ([d58b993](https://github.com/viarotel-org/escrcpy/commit/d58b993c6eff1d4ce227c4d158113aec74abae43))


### Bug Fixes

* 🐛 Fixed the issue where autoglm.js conversation request listener was not cleaned up causing memory overflow ([bac2126](https://github.com/viarotel-org/escrcpy/commit/bac21261207f0c97695af937f6e926a1d7e84657))


### Code Refactoring

* improve config management and prompt editing ([de2f708](https://github.com/viarotel-org/escrcpy/commit/de2f708142512787d3c8e384e6f4fb1d1d87abf2))
* improve prompt manager UI and editing experience ([1697558](https://github.com/viarotel-org/escrcpy/commit/169755869a03925c31d1252ced9c756e1dfd8969))
* optimize subscribe store initialization and token management ([0f00903](https://github.com/viarotel-org/escrcpy/commit/0f00903367e0c457a052e74514a66220ad924091))

## [2.1.7](https://github.com/viarotel-org/escrcpy/compare/v2.1.6...v2.1.7) (2026-01-14)


### Miscellaneous Chores

* release 2.1.7 ([3b6b16a](https://github.com/viarotel-org/escrcpy/commit/3b6b16a3168eb9ae9c46dff5014cb0ec75a6db8c))

## [2.1.6](https://github.com/viarotel-org/escrcpy/compare/v2.1.5...v2.1.6) (2026-01-14)


### Miscellaneous Chores

* release 2.1.6 ([39f0f2b](https://github.com/viarotel-org/escrcpy/commit/39f0f2bd0895ddb634f4ac8358a4bd371bb5bee6))

## [2.1.5](https://github.com/viarotel-org/escrcpy/compare/v2.1.4...v2.1.5) (2026-01-14)


### Miscellaneous Chores

* remove comments in copilot window handler ([f231998](https://github.com/viarotel-org/escrcpy/commit/f231998dfc8f4ca834dbf8d64b9ba4e038e3a507))
* update version to 2.1.4 ([9bdf671](https://github.com/viarotel-org/escrcpy/commit/9bdf671d9dfced0811a07935d3bec36a2aca1c45))

## [2.1.2](https://github.com/viarotel-org/escrcpy/compare/escrcpy-v2.1.2...escrcpy-v2.1.2) (2026-01-14)


### Features

* ✨ Add auto launch functionality and preference option ([69c75cc](https://github.com/viarotel-org/escrcpy/commit/69c75cc1bed6301a4067c52bbac9d95ba08aa2ab))
* ✨ Add hidden launch option for auto-start ([dd1c2e1](https://github.com/viarotel-org/escrcpy/commit/dd1c2e1ab6bee4487a99f8208d502009ff8055aa))
* ✨ Add subscribe configuration hook and update UI ([80b3534](https://github.com/viarotel-org/escrcpy/commit/80b35348ab8808aaca0cb477e1cc0a709af6df30))
* ✨ Add system tray support and Linux auto-launch ([df414b9](https://github.com/viarotel-org/escrcpy/commit/df414b9cf93d02f4b9e3f35c54fd91049a393947))
* 💥[Release-As: 2.0.0] major copilot overhaul with AutoGLM and multi-device automation ([7ad5ecd](https://github.com/viarotel-org/escrcpy/commit/7ad5ecd1164bdadad0b7b7be4b20b46cc8512f06))
* 🔖 Copilot adds thinking_stream event support ([22623c4](https://github.com/viarotel-org/escrcpy/commit/22623c40347a95dfc9f1794e96efce9c9f5e5a31))
* 🚑️ The portable version now supports automatically generating configuration files in the running directory ([ba551b7](https://github.com/viarotel-org/escrcpy/commit/ba551b7450d39696cb50e290483d3abcdb6a5d2c))
* add custom empty state icon for device list ([65b028f](https://github.com/viarotel-org/escrcpy/commit/65b028fbd1cca723c2440e9b7b360b3a70b0a936))
* add zip target for macOS builds ([f52d3a5](https://github.com/viarotel-org/escrcpy/commit/f52d3a5b3bf162dfdfe01b749ad83c4a887aa495))


### Bug Fixes

* 🐛 Fix automatic build issues ([aba8f27](https://github.com/viarotel-org/escrcpy/commit/aba8f27a76922211d02a8154b99afe2d5707bfff))
* 🐛 Fix delete message and config initialization ([82a77ea](https://github.com/viarotel-org/escrcpy/commit/82a77ea035209501ffe27dd169a06df0270e0a10))
* 🐛 Fix the problem of abnormal subscription recharge fee ([b32043c](https://github.com/viarotel-org/escrcpy/commit/b32043c5f2a37792d8c336f09f4b62534ce43bec))
* 🐛 Fixed the issue of failed export and export configuration files ([fd32c36](https://github.com/viarotel-org/escrcpy/commit/fd32c367b1e00180fc6036492f5b6e5a7dc2e34c))
* 🐛 Update dependencies and add sharp override in workspace configuration ([dbf366a](https://github.com/viarotel-org/escrcpy/commit/dbf366a28117237e4cfd81eea32985d2045b1697))
* 💰 Update payment amount handling in subscription ([422950c](https://github.com/viarotel-org/escrcpy/commit/422950c1f7f1b95ea10493d19bb99b26f034ee35))
* add background color and improve window initialization ([498fc90](https://github.com/viarotel-org/escrcpy/commit/498fc90746d41914d535da2b82b4286c9d605bc4))
* adjust empty state icon styling in device list ([363bf3d](https://github.com/viarotel-org/escrcpy/commit/363bf3d529e1bc20a79ab5f525a9ec8c87ca5372))
* ensure concurrency limit is numeric ([d2c977c](https://github.com/viarotel-org/escrcpy/commit/d2c977c9db33a8892293c279ccef2be4efb5d6ba))


### Performance Improvements

* 🚀 Use an external library instead of the built-in autoglm.js ([d1f8176](https://github.com/viarotel-org/escrcpy/commit/d1f8176b1d6095e5c4fbea4bd141c8bba5a3d84e))


### Miscellaneous Chores

* release 2.0.0 ([7e5dfe0](https://github.com/viarotel-org/escrcpy/commit/7e5dfe010805ecdea7f3f0d2d8fa90e2edca62b3))
* release 2.1.1 ([d1c04ce](https://github.com/viarotel-org/escrcpy/commit/d1c04cece7713050f4a6f25b1a87d1923dd538a8))
* release 2.1.2 ([c7c8616](https://github.com/viarotel-org/escrcpy/commit/c7c861655b3af4c623be97331184112e1e5c7e58))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @escrcpy/electron-ipcx bumped to 2.1.2

## [2.1.2](https://github.com/viarotel-org/escrcpy/compare/escrcpy-v2.1.1...escrcpy-v2.1.2) (2026-01-14)


### Features

* ✨ Add auto launch functionality and preference option ([69c75cc](https://github.com/viarotel-org/escrcpy/commit/69c75cc1bed6301a4067c52bbac9d95ba08aa2ab))
* ✨ Add hidden launch option for auto-start ([dd1c2e1](https://github.com/viarotel-org/escrcpy/commit/dd1c2e1ab6bee4487a99f8208d502009ff8055aa))
* ✨ Add subscribe configuration hook and update UI ([80b3534](https://github.com/viarotel-org/escrcpy/commit/80b35348ab8808aaca0cb477e1cc0a709af6df30))
* ✨ Add system tray support and Linux auto-launch ([df414b9](https://github.com/viarotel-org/escrcpy/commit/df414b9cf93d02f4b9e3f35c54fd91049a393947))
* 💥[Release-As: 2.0.0] major copilot overhaul with AutoGLM and multi-device automation ([7ad5ecd](https://github.com/viarotel-org/escrcpy/commit/7ad5ecd1164bdadad0b7b7be4b20b46cc8512f06))
* 🔖 Copilot adds thinking_stream event support ([22623c4](https://github.com/viarotel-org/escrcpy/commit/22623c40347a95dfc9f1794e96efce9c9f5e5a31))
* 🚑️ The portable version now supports automatically generating configuration files in the running directory ([ba551b7](https://github.com/viarotel-org/escrcpy/commit/ba551b7450d39696cb50e290483d3abcdb6a5d2c))
* add custom empty state icon for device list ([65b028f](https://github.com/viarotel-org/escrcpy/commit/65b028fbd1cca723c2440e9b7b360b3a70b0a936))
* add zip target for macOS builds ([f52d3a5](https://github.com/viarotel-org/escrcpy/commit/f52d3a5b3bf162dfdfe01b749ad83c4a887aa495))


### Bug Fixes

* 🐛 Fix automatic build issues ([aba8f27](https://github.com/viarotel-org/escrcpy/commit/aba8f27a76922211d02a8154b99afe2d5707bfff))
* 🐛 Fix delete message and config initialization ([82a77ea](https://github.com/viarotel-org/escrcpy/commit/82a77ea035209501ffe27dd169a06df0270e0a10))
* 🐛 Fix the problem of abnormal subscription recharge fee ([b32043c](https://github.com/viarotel-org/escrcpy/commit/b32043c5f2a37792d8c336f09f4b62534ce43bec))
* 🐛 Fixed the issue of failed export and export configuration files ([fd32c36](https://github.com/viarotel-org/escrcpy/commit/fd32c367b1e00180fc6036492f5b6e5a7dc2e34c))
* 🐛 Update dependencies and add sharp override in workspace configuration ([dbf366a](https://github.com/viarotel-org/escrcpy/commit/dbf366a28117237e4cfd81eea32985d2045b1697))
* 💰 Update payment amount handling in subscription ([422950c](https://github.com/viarotel-org/escrcpy/commit/422950c1f7f1b95ea10493d19bb99b26f034ee35))
* add background color and improve window initialization ([498fc90](https://github.com/viarotel-org/escrcpy/commit/498fc90746d41914d535da2b82b4286c9d605bc4))
* adjust empty state icon styling in device list ([363bf3d](https://github.com/viarotel-org/escrcpy/commit/363bf3d529e1bc20a79ab5f525a9ec8c87ca5372))
* ensure concurrency limit is numeric ([d2c977c](https://github.com/viarotel-org/escrcpy/commit/d2c977c9db33a8892293c279ccef2be4efb5d6ba))


### Performance Improvements

* 🚀 Use an external library instead of the built-in autoglm.js ([d1f8176](https://github.com/viarotel-org/escrcpy/commit/d1f8176b1d6095e5c4fbea4bd141c8bba5a3d84e))


### Miscellaneous Chores

* release 2.0.0 ([7e5dfe0](https://github.com/viarotel-org/escrcpy/commit/7e5dfe010805ecdea7f3f0d2d8fa90e2edca62b3))
* release 2.1.1 ([d1c04ce](https://github.com/viarotel-org/escrcpy/commit/d1c04cece7713050f4a6f25b1a87d1923dd538a8))
* release 2.1.2 ([c7c8616](https://github.com/viarotel-org/escrcpy/commit/c7c861655b3af4c623be97331184112e1e5c7e58))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @escrcpy/electron-ipcx bumped to 2.1.2

## [2.1.1](https://github.com/viarotel-org/escrcpy/compare/workspace-v2.1.0...desktop-v2.1.1) (2026-01-14)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @escrcpy/electron-ipcx bumped to 2.0.2

## [2.1.0](https://github.com/viarotel-org/escrcpy/compare/workspace-v2.0.1...desktop-v2.1.0) (2026-01-14)


### Features

* ✨ Add auto launch functionality and preference option ([69c75cc](https://github.com/viarotel-org/escrcpy/commit/69c75cc1bed6301a4067c52bbac9d95ba08aa2ab))
* ✨ Add hidden launch option for auto-start ([dd1c2e1](https://github.com/viarotel-org/escrcpy/commit/dd1c2e1ab6bee4487a99f8208d502009ff8055aa))
* ✨ Add subscribe configuration hook and update UI ([80b3534](https://github.com/viarotel-org/escrcpy/commit/80b35348ab8808aaca0cb477e1cc0a709af6df30))
* ✨ Add system tray support and Linux auto-launch ([df414b9](https://github.com/viarotel-org/escrcpy/commit/df414b9cf93d02f4b9e3f35c54fd91049a393947))
* 🔖 Copilot adds thinking_stream event support ([22623c4](https://github.com/viarotel-org/escrcpy/commit/22623c40347a95dfc9f1794e96efce9c9f5e5a31))
* 🚑️ The portable version now supports automatically generating configuration files in the running directory ([ba551b7](https://github.com/viarotel-org/escrcpy/commit/ba551b7450d39696cb50e290483d3abcdb6a5d2c))
* add custom empty state icon for device list ([65b028f](https://github.com/viarotel-org/escrcpy/commit/65b028fbd1cca723c2440e9b7b360b3a70b0a936))
* add zip target for macOS builds ([f52d3a5](https://github.com/viarotel-org/escrcpy/commit/f52d3a5b3bf162dfdfe01b749ad83c4a887aa495))


### Bug Fixes

* 🐛 Fix delete message and config initialization ([82a77ea](https://github.com/viarotel-org/escrcpy/commit/82a77ea035209501ffe27dd169a06df0270e0a10))
* 🐛 Fixed the issue of failed export and export configuration files ([fd32c36](https://github.com/viarotel-org/escrcpy/commit/fd32c367b1e00180fc6036492f5b6e5a7dc2e34c))
* 🐛 Update dependencies and add sharp override in workspace configuration ([dbf366a](https://github.com/viarotel-org/escrcpy/commit/dbf366a28117237e4cfd81eea32985d2045b1697))
* 💰 Update payment amount handling in subscription ([422950c](https://github.com/viarotel-org/escrcpy/commit/422950c1f7f1b95ea10493d19bb99b26f034ee35))
* add background color and improve window initialization ([498fc90](https://github.com/viarotel-org/escrcpy/commit/498fc90746d41914d535da2b82b4286c9d605bc4))
* adjust empty state icon styling in device list ([363bf3d](https://github.com/viarotel-org/escrcpy/commit/363bf3d529e1bc20a79ab5f525a9ec8c87ca5372))
* ensure concurrency limit is numeric ([d2c977c](https://github.com/viarotel-org/escrcpy/commit/d2c977c9db33a8892293c279ccef2be4efb5d6ba))


### Performance Improvements

* 🚀 Use an external library instead of the built-in autoglm.js ([d1f8176](https://github.com/viarotel-org/escrcpy/commit/d1f8176b1d6095e5c4fbea4bd141c8bba5a3d84e))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @escrcpy/electron-ipcx bumped to 2.0.1

## [2.0.1](https://github.com/viarotel-org/escrcpy/compare/workspace-v2.0.0...desktop-v2.0.1) (2026-01-06)


### Bug Fixes

* 🐛 Fix the problem of abnormal subscription recharge fee ([b32043c](https://github.com/viarotel-org/escrcpy/commit/b32043c5f2a37792d8c336f09f4b62534ce43bec))

## [2.0.0](https://github.com/viarotel-org/escrcpy/compare/desktop-v1.34.2...desktop-v2.0.0) (2026-01-05)


### Features

* 💥[Release-As: 2.0.0] major copilot overhaul with AutoGLM and multi-device automation ([7ad5ecd](https://github.com/viarotel-org/escrcpy/commit/7ad5ecd1164bdadad0b7b7be4b20b46cc8512f06))


### Miscellaneous Chores

* release 1.25.1 ([f60245b](https://github.com/viarotel-org/escrcpy/commit/f60245b11d9f38d5a61d9e3c59932de95ecef4b0))
* release 2.0.0 ([7e5dfe0](https://github.com/viarotel-org/escrcpy/commit/7e5dfe010805ecdea7f3f0d2d8fa90e2edca62b3))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @escrcpy/electron-ipcx bumped to 2.0.0
    * autoglm.js bumped to 2.0.0
