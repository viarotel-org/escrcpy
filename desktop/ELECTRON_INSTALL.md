# Electron 安装与修复指南

如果在运行 `pnpm dev` 时遇到 `Electron failed to install correctly, please delete node_modules/electron and try installing again` 错误，按下面步骤排查与修复：

## 快速修复（推荐）
1. 在项目根或 `desktop/` 目录运行：
   ```bash
   # 在 desktop 包启动之前会自动运行 predev
   pnpm --filter @escrcpy/desktop run dev
   ```
   `predev` 脚本会先运行 `electron-fix`，尝试修复缺失的二进制。

2. 如果网络环境导致下载失败，使用镜像重试：
   ```bash
   # 使用国内镜像重试 electron-fix
   pnpm --filter @escrcpy/desktop run electron-fix:mirror
   ```

## 手动检查（用于排查）
- 检查是否存在 electron 的二进制和 path.txt：
  ```bash
  ls -la node_modules/.pnpm/electron@* && ls -la node_modules/.pnpm/electron@*/node_modules/electron/dist || echo "dist missing"
  cat node_modules/.pnpm/electron@*/node_modules/electron/path.txt || echo "path.txt missing"
  ```

- 清缓存并强制重装：
  ```bash
  pnpm store prune
  pnpm install --force
  ```

## 其他建议
- 在 Apple Silicon（arm64）机器上，确认 `uname -m` 输出为 `arm64`。若需要可以使用：
  ```bash
  npm_config_arch=arm64 pnpm install --force
  ```
- 如仍然失败，请将 `pnpm install` 的完整日志贴到 issue 中，或执行 `npx electron-fix start` 并贴出输出供排查。

---
如果你需要，我可以继续帮你运行检查命令并分析输出。