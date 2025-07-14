# Escrcpy Developer Guide

## Introduction

[Escrcpy](https://github.com/viarotel-org/escrcpy) is an Electron-based graphical user interface for Scrcpy, designed to facilitate the display and control of Android devices. This comprehensive guide aims to help developers contribute to the project effectively.

## Getting Started

### System Requirements
- Node.js v20 or higher
- Git

### Development Setup
```shell
# Clone repository
git clone https://github.com/viarotel-org/escrcpy.git
cd escrcpy

# Enable pnpm package manager
corepack enable pnpm

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build applications
pnpm build          # Auto-detect platform
pnpm build:win      # Build for Windows
pnpm build:mac      # Build for macOS 
pnpm build:linux    # Build for Linux
```

## Technical Architecture

### Core Technologies
- Electron - Cross-platform desktop application framework
- Vue.js - Frontend framework
- JavaScript - Primary programming language
- Node.js - Runtime environment
- scrcpy - Android device display and control
- adbkit - Android Debug Bridge toolkit

### Project Structure
```
📦Escrcpy
 ┣ 📂.github              # GitHub workflows and configurations
 ┣ 📂.husky              # Git hooks settings
 ┣ 📂.vscode             # VSCode editor settings
 ┣ 📂control             # Device floating control bar
 ┣ 📂electron          # Electron main process
 ┣ 📂src               # Main renderer process
 ┃ ┣ 📂assets         # Static resources
 ┃ ┣ 📂components     # Vue components
 ┃ ┃ ┣ 📂Device      # Device management
 ┃ ┃ ┣ 📂Preference  # Settings interface
 ┃ ┃ ┗ 📂Quick       # Quick access features
 ┃ ┣ 📂hooks   # Vue composition functions
 ┃ ┣ 📂configs       # App configurations
 ┃ ┣ 📂dicts         # Constants and enums
 ┃ ┣ 📂icons         # Icon assets
 ┃ ┣ 📂locales       # Internationalization
 ┃ ┣ 📂plugins       # Vue plugins
 ┃ ┣ 📂store         # State management
 ┃ ┣ 📂styles        # Global styles
 ┃ ┗ 📂utils         # Helper functions
 ┣ 📂public             # Public assets
 ┣ 📂screenshots        # Application screenshots
 ┣ 📂scripts           # Build scripts
 ┣ 📜.eslintrc-auto-import.json  # ESLint settings
 ┣ 📜package.json      # Project metadata
 ┣ 📜vite.config.js    # Build configuration
 ┗ 📜electron-builder.json  # Electron packaging config
```

## Development Guidelines

### Coding Standards
- Adhere to ESLint configuration
- Implement Vue 3 Composition API practices
- Follow Angular's commit message conventions ([guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines))
- Include documentation for complex implementations

### Contributing Process
1. Review existing issues and pull requests
2. Follow coding standards
3. Implement and test changes
4. Update relevant documentation
5. Submit pull request to main branch

## Debugging Tools

- Enable debug mode in application preferences
- Access DevTools using Ctrl+Shift+I
- Utilize console logging for development

## Reference Documentation

- [Electron](https://www.electronjs.org/docs)
- [Vue.js](https://vuejs.org/)
- [Scrcpy](https://github.com/Genymobile/scrcpy)
- [Adbkit](https://github.com/DeviceFarmer/adbkit)
- [Gnirehtet](https://github.com/Genymobile/gnirehtet/)

## FAQ

### Specific area "throw new Error('Electron failed to install correctly, please delete node_modules/electron and try installing again')"

Overwrite the contents of `.npmrc.CN` in the project to `.npmrc`, then delete `node_modules` and reinstall dependencies.

Alternatively, you can use [electron-fix](https://github.com/pangxieju/electron-fix)

```shell
  # Run in this project directory
  npx electron-fix start
```

## Support and Contact

- Bug Reports: [GitHub Issues](https://github.com/viarotel-org/escrcpy/issues)
- Contact: viarotel@qq.com