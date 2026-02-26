# Changelog

## [2.4.2](https://github.com/viarotel-org/escrcpy/compare/v2.4.1...v2.4.2) (2026-02-26)


### Bug Fixes

* Fix the problem of abnormal disconnection of adb after changing some configurations ([ffbfc40](https://github.com/viarotel-org/escrcpy/commit/ffbfc40c0d1938cb5d2c71e7f6500dc5b47e5b76))

## [2.4.1](https://github.com/viarotel-org/escrcpy/compare/v2.4.0...v2.4.1) (2026-02-26)


### Bug Fixes

* Fix the language detection issue of portable software ([9985067](https://github.com/viarotel-org/escrcpy/commit/9985067b7688becdaf9311734d2ea2ab6519afd8))


### Code Refactoring

* Reorganize initialization order to load store before process configuration ([9283a45](https://github.com/viarotel-org/escrcpy/commit/9283a4568a6d9065a0ebc3ca715f87a6b8c9483f))

## [2.4.0](https://github.com/viarotel-org/escrcpy/compare/v2.3.1...v2.4.0) (2026-02-26)


### Features

* ✨ Adds fastboot command support and provides experimental integration of scrcpy dependencies for Linux ARM64 platforms. ([70f3243](https://github.com/viarotel-org/escrcpy/commit/70f32430417f001c56354e24c3c4366d831744ad))
* 🎉 Comprehensive migration to the built-in terminal based on xterm to provide a more controllable user experience ([a2ee25f](https://github.com/viarotel-org/escrcpy/commit/a2ee25ff0e92fdd315968d311b483c438e047559))
* add drag and drop file upload support ([d5b969c](https://github.com/viarotel-org/escrcpy/commit/d5b969cc1643d3e68f36e2c8458abea1b51ebce6))
* add gnirehtet path for mac ([8da67c8](https://github.com/viarotel-org/escrcpy/commit/8da67c8d33241de9b4a720bd0ca742e9fb2ffc90))
* add scroll to bottom button in chat ([e4e8f80](https://github.com/viarotel-org/escrcpy/commit/e4e8f807e7cbca80c03ee7920f171f5b475dbbb0))
* add terminal shell support with xterm integration ([3c7828c](https://github.com/viarotel-org/escrcpy/commit/3c7828c8206625325032c2ef44e860b8b5668051))
* add wireless connection mode switch toggle ([161acf4](https://github.com/viarotel-org/escrcpy/commit/161acf463ecfa847116b108b7009fae3d957c5fc))
* add wireless pair success message and UI improvements ([eccb26e](https://github.com/viarotel-org/escrcpy/commit/eccb26e97e6599d16076b53b0370050cd2f1272a))
* improve ADB keyboard installation error handling ([71f7635](https://github.com/viarotel-org/escrcpy/commit/71f7635ec9045b276212f8dc14f826c4e26ab321))
* trigger language change callback immediately on init ([e0e3d22](https://github.com/viarotel-org/escrcpy/commit/e0e3d22fbf0eee2f14f033e8c41ec298f5bf6ddf))
* update api endpoint and enable adb keyboard ([4010b17](https://github.com/viarotel-org/escrcpy/commit/4010b1708f523c30f0727a16470f504f8d83a53f))
* Window orchestration component enhancement: Supports manual setting of position and size ([e3aa89a](https://github.com/viarotel-org/escrcpy/commit/e3aa89ab5ec5d130554e5b5ad348fe6e9cf3bd96))


### Bug Fixes

* 🐛 Migrate fkill to tree-kill to solve windows binary file execution problems ([6c89b73](https://github.com/viarotel-org/escrcpy/commit/6c89b73cb66f0cb723efb31a59066f2e62dd880a))
* change clipboard tag type to primary ([edb8840](https://github.com/viarotel-org/escrcpy/commit/edb8840f4a2477710b91f58c0dfb7f5353188ecb))
* enhance xterm terminal styling and resize handling ([9e031f5](https://github.com/viarotel-org/escrcpy/commit/9e031f5e5f5079c3b420a25d686c3947d31f19fd))
* filter ANSI color codes for Windows PowerShell terminal ([9c58f25](https://github.com/viarotel-org/escrcpy/commit/9c58f25301a9cb4663aea6c1b899ce40cf9ba3fb))
* Fix i18n race translation ([7b37f29](https://github.com/viarotel-org/escrcpy/commit/7b37f297851f7d1a8a928ad6725e3f8dee3c48ed))
* handle terminal exit and error states with reload ([e8d93d5](https://github.com/viarotel-org/escrcpy/commit/e8d93d56aa7c596d32cb5878dee70b3ce0540bc0))
* handle Windows terminal line ending for all cases ([e06e763](https://github.com/viarotel-org/escrcpy/commit/e06e76346c236b5e2923e05d55904fb930be3b6a))
* handle Windows terminal line ending for device type ([1be1a5e](https://github.com/viarotel-org/escrcpy/commit/1be1a5ed6e19e6735d3cdc77224e7d265755b023))
* improve Windows terminal compatibility and session management ([7f37f7d](https://github.com/viarotel-org/escrcpy/commit/7f37f7da1adcee51fb90984dd8fc0be7cc4701df))
* improve Windows terminal cursor sync and resize responsiveness ([c16a5f9](https://github.com/viarotel-org/escrcpy/commit/c16a5f9250134347987443a1aa76d879a8b17e00))
* improve Windows terminal encoding and scrollbar styling ([85d5a96](https://github.com/viarotel-org/escrcpy/commit/85d5a9663db1be5e226f9cfcdd279b93cc27c920))
* improve Windows terminal rendering and resize stability ([7f05996](https://github.com/viarotel-org/escrcpy/commit/7f059968944a6b0d64bca9f8bbcc281a356b3b42))
* improve Windows terminal shell detection and remove debug logs ([4a5ebbc](https://github.com/viarotel-org/escrcpy/commit/4a5ebbc86c1e8687a7cc3b053f330c7418dadbc5))
* include node-pty in electron build ([c98d82d](https://github.com/viarotel-org/escrcpy/commit/c98d82d8e2db400d8c3db0a13eb5f2acdfa8b3d1))
* prioritize pwsh.exe for Windows terminal ([a99d830](https://github.com/viarotel-org/escrcpy/commit/a99d8300570f37b67e9cf600bc42b84f6b643b22))
* simplify Windows PowerShell terminal initialization ([95c432c](https://github.com/viarotel-org/escrcpy/commit/95c432c539bb941b0ff73ce61567f91d509c5776))
* simplify Windows terminal shell initialization ([2a3ed6f](https://github.com/viarotel-org/escrcpy/commit/2a3ed6f1ca5f4e98634bfe85c6d41ba928a6809f))
* Solve the problem that the language of the terminal title cannot be dynamically updated ([6e2c030](https://github.com/viarotel-org/escrcpy/commit/6e2c03019103d432bb83c6f632fd57170a3bc0c0))
* specify SIGTERM signal for treeKill ([d28eb1a](https://github.com/viarotel-org/escrcpy/commit/d28eb1a9feb0883472558b0d0b93ded18f02b446))
* update terminal tip color to custom RGB ([156d39b](https://github.com/viarotel-org/escrcpy/commit/156d39beabe98b0306900a8b76c82616a9fe3e35))


### Performance Improvements

* 🚀 Optimize ADB keyboard installation and detection ([f312cc2](https://github.com/viarotel-org/escrcpy/commit/f312cc2d71c048a7853467d77cb0657ef7dc77cc))


### Code Refactoring

* add cleanup handler for window IPC ([bad6752](https://github.com/viarotel-org/escrcpy/commit/bad6752991e4ca109e40904a3362b6d1e2368ad7))
* add comment for tray destroy event ([12038df](https://github.com/viarotel-org/escrcpy/commit/12038dfc1c9da3f15215e38f51213093f3b0516e))
* add electron-modularity dependency ([d0abc0b](https://github.com/viarotel-org/escrcpy/commit/d0abc0bf42287d579aa2d7544f61f330de717c29))
* add main window API and type system ([778a65f](https://github.com/viarotel-org/escrcpy/commit/778a65f89128766f8d12820ec73b2f8ab6ad89d3))
* add plugin warnings and fix module loading order ([a5bdbf3](https://github.com/viarotel-org/escrcpy/commit/a5bdbf37f6d8af96e585755c396bd440545617d3))
* add rendererDir support and update window loading ([fac664d](https://github.com/viarotel-org/escrcpy/commit/fac664d3e291995b5be1d4479479b0d79bbabd13))
* adjust screenshot message and dialog styles ([7bbab51](https://github.com/viarotel-org/escrcpy/commit/7bbab511f097e3e5d1bde45fbcf110fa60f382c0))
* adjust terminal line height to 1.4 ([5068f7d](https://github.com/viarotel-org/escrcpy/commit/5068f7d398beac1505d866bbbfa759bd22867a6d))
* adjust terminal window and device sync settings ([6a4bd61](https://github.com/viarotel-org/escrcpy/commit/6a4bd61eac3ba32f225a62f7bd43071775fc6a31))
* adjust window width and improve error handling ([5576d2e](https://github.com/viarotel-org/escrcpy/commit/5576d2e9f4a11cb06b997ee23257df3efabbe554))
* centralize PATH setup and environment configuration ([6a6eb80](https://github.com/viarotel-org/escrcpy/commit/6a6eb80346dbe6dfb5b74ac0a8d860bc1592f2ec))
* clean up .gitignore file ([3644b3e](https://github.com/viarotel-org/escrcpy/commit/3644b3ef049651031aef00a3b0b0bdd1e4e502a3))
* clean up main window module ([9d1eee9](https://github.com/viarotel-org/escrcpy/commit/9d1eee9632a1484706559c8264db0a05b383757d))
* defer app initialization until ready ([9905f41](https://github.com/viarotel-org/escrcpy/commit/9905f41d3deb12d1ca434fd14e1128f126497729))
* defer plugin registration until app start ([46ac0db](https://github.com/viarotel-org/escrcpy/commit/46ac0db4e7b3a63f712c00efaf3c27bd9fab0906))
* Electron main process architecture reconstruction ([f810ecb](https://github.com/viarotel-org/escrcpy/commit/f810ecbc9566b5dbc0567caf22fdcadc9bbbec04))
* emit tray:destroy on window restore ([fab9343](https://github.com/viarotel-org/escrcpy/commit/fab93439a9a47fb5b24590a723b994279253f292))
* expose $platform to window and global properties ([9a7ee70](https://github.com/viarotel-org/escrcpy/commit/9a7ee70a8453f3dc5994be8482dbcc4b7aed0f20))
* extract terminal logic into useTerminal hook ([9d725ca](https://github.com/viarotel-org/escrcpy/commit/9d725cafd89faa15b11dc9d2f7aa7d1969ec77fc))
* fix device payload and adjust control bar height ([e5981ac](https://github.com/viarotel-org/escrcpy/commit/e5981ac21dd7e3359c0643e4f3e247309036d190))
* fix failed translation key ([fe98a56](https://github.com/viarotel-org/escrcpy/commit/fe98a56b35f0f1959a317c8cf5e5aec73bb2d489))
* fix payload type and resolve target logic ([5af60c8](https://github.com/viarotel-org/escrcpy/commit/5af60c8869a60d5f0e74ed97d9c73c41a4c2d949))
* fix preview button visibility class ([5a8c97b](https://github.com/viarotel-org/escrcpy/commit/5a8c97b10d663a870589010e3bcd06657d1a1cc2))
* implement retained terminal session with cleanup ([532a055](https://github.com/viarotel-org/escrcpy/commit/532a055dc3873498cc5f5dc440905a97846bf877))
* implement terminal session management with providers ([fa156e1](https://github.com/viarotel-org/escrcpy/commit/fa156e137af0d49db6a7874f2f04524533e00534))
* improve file download progress tracking ([51101c7](https://github.com/viarotel-org/escrcpy/commit/51101c76efd06a3dd5ac01f2fc38fdc6a4f8f0be))
* improve gnirehtet menu handling and options ([8d0e85b](https://github.com/viarotel-org/escrcpy/commit/8d0e85b508d535dea6e2fd3660ac46e1c4c3f68f))
* improve process killing and error handling ([85a080e](https://github.com/viarotel-org/escrcpy/commit/85a080e667d72b67a49d5f9be070abf23d793ba1))
* improve window bounds persistence logic ([5361e24](https://github.com/viarotel-org/escrcpy/commit/5361e24c392b90ec420d6a5237f9df96d2a65394))
* improve wireless pair input handling and UI ([3aea5f6](https://github.com/viarotel-org/escrcpy/commit/3aea5f65a8852167ef940a6f7c17ca0e2a2cd2d0))
* migrate core helpers to electron-modularity package ([630deaa](https://github.com/viarotel-org/escrcpy/commit/630deaaecbea63aea7cab89ff3a566c837d4c499))
* migrate edger to service ([9c64cd5](https://github.com/viarotel-org/escrcpy/commit/9c64cd592a0d4d3f176f1eaa4a5d45a31650575c))
* migrate events to service handlers ([c99b1de](https://github.com/viarotel-org/escrcpy/commit/c99b1ded66a31b72c8878bd1a35a869df8ef12a5))
* migrate plugins to priority-based system ([ae4404a](https://github.com/viarotel-org/escrcpy/commit/ae4404a6b5c31ed7a33337839890caf40794e4b2))
* migrate services and modules to explicit app.use ([e63de2e](https://github.com/viarotel-org/escrcpy/commit/e63de2eaea8450375880d544cc39767b1574f038))
* migrate services to plugins ([36e2a0d](https://github.com/viarotel-org/escrcpy/commit/36e2a0dd6ee89a1d30b6fa5d4ee7aa21b64a2338))
* migrate to ipcx for IPC handling ([1b1fd8d](https://github.com/viarotel-org/escrcpy/commit/1b1fd8dbdf51145b3832dd3263158f62ceaa42ad))
* migrate to official plugins and update imports ([eb9bead](https://github.com/viarotel-org/escrcpy/commit/eb9beadae7c5b1b4ff4b4d7c71e59ad8ca5b68c1))
* migrate to window.$preload namespace ([41a2342](https://github.com/viarotel-org/escrcpy/commit/41a234253015d064a9e1cdbaf4531c80fc2467e1))
* move i18next-fs-backend to dependencies ([f507222](https://github.com/viarotel-org/escrcpy/commit/f5072224b163bb1329f370101dec24353b1957fc))
* move window-manager to window module ([8af97a5](https://github.com/viarotel-org/escrcpy/commit/8af97a5d4e61f28aa8e3c27ef2cb2c36b4699b83))
* optimize device query and control window ([4e2736d](https://github.com/viarotel-org/escrcpy/commit/4e2736d04adf08d2044637f86c57f777503c5759))
* optimize minimized tray and window handling ([3765b73](https://github.com/viarotel-org/escrcpy/commit/3765b736cd5dab7609a32f6d260797f9e5cb4f14))
* Reconstruct the multi-entry directory structure ([0690f4b](https://github.com/viarotel-org/escrcpy/commit/0690f4b1f7031e274dfd760b928d96c5bfadf394))
* Refactor i18n related services ([6e882b6](https://github.com/viarotel-org/escrcpy/commit/6e882b6a5f0c52a3f9deaca9b74c5c5269369c8e))
* remove app parameter from window manager ([f8719f1](https://github.com/viarotel-org/escrcpy/commit/f8719f1e2bcfd6a879d13a1a5a0eea47634d9147))
* remove appium-adb documentation and update github link ([f532aab](https://github.com/viarotel-org/escrcpy/commit/f532aabd3b927538271915014798a3e42652c587))
* remove border from preference header ([9c97366](https://github.com/viarotel-org/escrcpy/commit/9c97366e40a84df1700fce43386c958c4e01fcfc))
* remove debug console log for args ([e4332c1](https://github.com/viarotel-org/escrcpy/commit/e4332c173c144789199db6e690e96d554195995e))
* remove debug console log for platform paths ([e5590f3](https://github.com/viarotel-org/escrcpy/commit/e5590f37967140e4242c06f05b7497ce55d39d8f))
* remove electron middleware module ([3bd462c](https://github.com/viarotel-org/escrcpy/commit/3bd462c4d3ee1f324954f963494ae83b8c364791))
* remove encoding conversion and use utf8 only ([c32cb79](https://github.com/viarotel-org/escrcpy/commit/c32cb7995a1191abefbae11bc78e55b704d7570c))
* remove fixed width from window configuration ([ef3e86b](https://github.com/viarotel-org/escrcpy/commit/ef3e86bfa5bb1e0339b916ba5ac1f93ba237733e))
* remove spawnShell and convert arrow functions ([66978f1](https://github.com/viarotel-org/escrcpy/commit/66978f1cf4655a51c965d340b5300ea2e866230d))
* remove theme plugin README ([85a853b](https://github.com/viarotel-org/escrcpy/commit/85a853bb3d3e48c8717bd385999dfead972ddb29))
* remove trailing whitespace in adb helpers ([ec7314c](https://github.com/viarotel-org/escrcpy/commit/ec7314cf8c28585740196ca7b1017e0d02743a16))
* remove ui-ux-pro-max prompt files ([11d41a9](https://github.com/viarotel-org/escrcpy/commit/11d41a9261f236043236a380bfa711ab87cc94d3))
* remove unused app-region-drag style ([094e0df](https://github.com/viarotel-org/escrcpy/commit/094e0dfdb810e200dc18c57df88e5bb5c469baf2))
* remove unused terminalConfig from useTerminal ([9db3f24](https://github.com/viarotel-org/escrcpy/commit/9db3f24fca42f9c7457c72d84ea2c063cd7d4311))
* remove Windows-specific encoding default ([534934b](https://github.com/viarotel-org/escrcpy/commit/534934b2849f435c7c14c818a767c5b4a9e3347c))
* rename app to ctx and update electron app imports ([4c7ceba](https://github.com/viarotel-org/escrcpy/commit/4c7ceba36d4ca22afd809d99e42f944cdda50aaf))
* rename app to ctx in electron app ([6707e2d](https://github.com/viarotel-org/escrcpy/commit/6707e2d130d37102bb16a9dd057ee544341dab46))
* rename currentStatusType to sessionStatus ([8c84464](https://github.com/viarotel-org/escrcpy/commit/8c844646f1832ffab5ca8d581b31d673f35bc2aa))
* rename electron-modularity to electron-setup ([081a8a5](https://github.com/viarotel-org/escrcpy/commit/081a8a5e51cce3b6e454291aad4a11d51c2776f0))
* rename entries to pages for routing structure ([863ecd4](https://github.com/viarotel-org/escrcpy/commit/863ecd4d281ce43747961c152fe260c034c6418b))
* rename windowOptions to browserWindow and add mainWindow flag ([5093577](https://github.com/viarotel-org/escrcpy/commit/50935772770106a31444528263e291db6f6b1ac9))
* reorder plugin registration in electron main ([b8ee4ef](https://github.com/viarotel-org/escrcpy/commit/b8ee4efd65d5e2cbf3f8272d75e45d884cd0edb0))
* reorganize process helpers directory structure ([dcdb6d7](https://github.com/viarotel-org/escrcpy/commit/dcdb6d7a0f185cc9d239c4020e227521ebdbd352))
* replace args-tokenizer with shell-quote ([1196263](https://github.com/viarotel-org/escrcpy/commit/1196263c211478d4874f6cacb14971aa6817c26c))
* replace getSize with computed size property ([c7edceb](https://github.com/viarotel-org/escrcpy/commit/c7edcebdcbfc4549f7fdde9b79e223949e4cc89d))
* replace IS_PACKAGED with import.meta.env.MODE ([521e2ba](https://github.com/viarotel-org/escrcpy/commit/521e2ba01ebee012ee455e112affb9698ba405f9))
* replace spawnShell with unified sheller helper ([0159bb4](https://github.com/viarotel-org/escrcpy/commit/0159bb4771c3c2868823704629a04ddfebff2378))
* replace tree-kill with fkill for process termination ([c50cea6](https://github.com/viarotel-org/escrcpy/commit/c50cea6a97e29f93442c443bdca7ddac6c774a05))
* replace window controls with app header ([a5fa218](https://github.com/viarotel-org/escrcpy/commit/a5fa21867f95a00bf95ec3726b13782fef9b42a1))
* restructure copilot and explorer modules ([74efca1](https://github.com/viarotel-org/escrcpy/commit/74efca10ad75d16c318f259cae9b822f4b9662c7))
* restructure core helpers and window management ([16fc934](https://github.com/viarotel-org/escrcpy/commit/16fc93475dc75aa740c5e4c50cfc4df781a48508))
* restructure electron helpers and modules ([f0e4851](https://github.com/viarotel-org/escrcpy/commit/f0e4851bea6b5d6af2741ef87ea3f03e3878a19a))
* restructure main window and singleton modules ([7b979d6](https://github.com/viarotel-org/escrcpy/commit/7b979d684ca04bf99b43e3d1c3b78449a0ba5239))
* restructure terminal session management ([19428dd](https://github.com/viarotel-org/escrcpy/commit/19428dd972b101a853f8a9eb60b360ba86f2e506))
* restructure window management and IPC handlers ([59a315f](https://github.com/viarotel-org/escrcpy/commit/59a315f0d0796f54366ffa15085ee53ad43ebb40))
* simplify file list extraction in drag upload ([7453a99](https://github.com/viarotel-org/escrcpy/commit/7453a99dd16dd5d663f2db0d065cc8b3047fff7b))
* simplify gnirehtet trigger handling ([f9185c3](https://github.com/viarotel-org/escrcpy/commit/f9185c3fd182b1e4239d34510a0a8208269a9673))
* simplify main window resolution and remove legacy code ([c764f91](https://github.com/viarotel-org/escrcpy/commit/c764f910c82952364a8963543e0a3aea0944e491))
* simplify restoreAndFocusWindow options ([27185f5](https://github.com/viarotel-org/escrcpy/commit/27185f596951acfd6767e91dba7ba4bef0ae12f5))
* simplify window types and return native BrowserWindow ([184ab7b](https://github.com/viarotel-org/escrcpy/commit/184ab7b6991b656ca7d45be1fb978bb7cbcf2b16))
* simplify wireless connection UI and remove pair dialog ([30e026c](https://github.com/viarotel-org/escrcpy/commit/30e026c96a46081d9ac4398a49a158164014c0ff))
* standardize module export structure ([8111f6f](https://github.com/viarotel-org/escrcpy/commit/8111f6ffbdc7c64d75acc425733eab7237352116))
* throttle download and upload progress callbacks ([8a16d22](https://github.com/viarotel-org/escrcpy/commit/8a16d22fddf85fce173e3da3ac5a240fb28ebfef))
* translate terminal comments to English and add command execution ([71a2d7a](https://github.com/viarotel-org/escrcpy/commit/71a2d7abf40f9b7fbffac3a9cb9fd0ceba46b7ca))
* unify control bar height configuration ([7e6abed](https://github.com/viarotel-org/escrcpy/commit/7e6abed1a0ac13d4090102a0966e64319ad77ea8))
* unify shell error handling and lazy loading ([98dd91b](https://github.com/viarotel-org/escrcpy/commit/98dd91b264f40b7112e65af49e9e3ad0c5fe7f3e))
* update primaryColor value ([346df64](https://github.com/viarotel-org/escrcpy/commit/346df646a97cb4fafa8f567926a7ba5527e2ed87))
* update scrollbar styling with Tailwind CSS ([6eaf259](https://github.com/viarotel-org/escrcpy/commit/6eaf259ae0786a5a6a16d7347fa6cb1dc419c4a3))
* update terminal scrollbar styling with custom width and transparency ([b2c8f87](https://github.com/viarotel-org/escrcpy/commit/b2c8f87f4efac668d60580bc53eab98a422ebdba))
* update terminal title and locale strings ([f0bdf0b](https://github.com/viarotel-org/escrcpy/commit/f0bdf0b2e186f5791b29fcee5bdfb2b0fdd56cb9))

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
