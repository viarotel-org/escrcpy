# Changelog

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
