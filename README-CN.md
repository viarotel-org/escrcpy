<div style="display:flex;">
  <img src="https://cdn.jsdelivr.net/gh/viarotel-org/escrcpy@main/electron/resources/build/logo.png?version=1.34.0" alt="viarotel-escrcpy" width="108px">
</div>

# Escrcpy

[![GitCode](https://gitcode.com/viarotel-org/escrcpy/star/badge.svg)](https://gitcode.com/viarotel-org/escrcpy)
[![Gitee](https://gitee.com/viarotel-org/escrcpy/badge/star.svg?theme=dark)](https://gitee.com/viarotel-org/escrcpy)
[![GitHub](https://img.shields.io/github/stars/viarotel-org/escrcpy?label=Github%20Stars)](https://github.com/viarotel-org/escrcpy)

📱 使用图形化的 Scrcpy 显示和控制您的 Android 设备，由 Electron 驱动。[English Document](https://github.com/viarotel-org/escrcpy/blob/main/README.md)

<div style="display:flex;">
  <img src="./desktop/screenshots/zh-CN/overview.png" alt="viarotel-escrcpy" width="100%">
</div>

## 特点

你的直觉是对的：**功能点本身并不“过多”，但当前呈现方式存在“信息密度过高、层级不清、价值焦点被稀释”的问题**，尤其是你**新增的 AutoGLM 自然语言控制能力没有被充分放大**。

下面我从**产品表达与用户认知成本**的角度，帮你系统性优化。

---

## 一、核心问题诊断

### 1. 功能堆叠，没有“主线”

当前列表是**能力罗列型**，而不是**价值驱动型**：

* 性能、画质、延迟 → 属于 Scrcpy 基础能力
* 自动化、窗口编排、多设备 → escrcpy 的差异化
* AutoGLM 自然语言控制 → **新一代核心卖点**
* Gnirehtet / 无线 / 主题 → 辅助能力

但现在它们**平铺在同一层级**，导致：

* 新用户无法 5 秒内理解「escrcpy 究竟强在哪」
* AutoGLM 被淹没在“功能噪音”里

---

### 2. Feature 数量 ≠ 问题，**认知负担才是问题**

你现在的问题不是“多”，而是：

* 没有 **优先级**
* 没有 **分组语义**
* 没有 **一句话杀手级定位**

---

## 二、推荐的优化原则（结论先行）

**建议采用「3 层结构」：**

1. **一句话定位（必须突出 AutoGLM）**
2. **3–4 个一级能力模块（用户可快速扫描）**
3. **Scrcpy 基础能力下沉为“技术优势”而非卖点**

---

## 三、优化后的 Feature 结构（推荐版本）

### 🔥 一句话定位（强烈建议加在最前）

> **escrcpy 是一款支持 AutoGLM 自然语言指令的 Scrcpy 增强工具，实现多设备自动化、可视化管理与智能控制。**

或更偏技术向一点：

> **escrcpy 在 Scrcpy 基础之上，引入 AutoGLM 自然语言控制与自动化能力，面向多设备、高效率的 Android 操作场景。**

---

## 四、重构后的 Feature 列表（优化重点）

### 🤖 智能控制（核心差异化 · 必须置顶）

* **AutoGLM 自然语言指令控制 Android 设备**
* 自动理解并执行高层操作指令（点击、输入、跳转、流程操作）
* 适用于测试、演示、远程协助、批量设备控制等场景

> 👉 这是你**当前最具“代际差异”的能力**，必须第一眼看到。

---

### 🏃 自动化与效率（生产力主线）

* 自动连接设备、自动启动镜像
* 自定义脚本、计划任务、批量执行
* 多设备并行控制与状态同步
* Web 技术加持，与 Scrcpy 快速保持同步

---

### 🪟 多设备与可视化管理（高级用户价值）

* 多设备统一管理，独立配置与自定义备注
* **窗口编排**：可视化拖拽，精确控制位置与尺寸
* 配置导入 / 导出，快速迁移环境

---

### 📡 连接与网络能力（场景补充）

* 扫描二维码实现无线连接
* **Gnirehtet 反向供网**（Android 共享宿主网络）

---

### 🎨 体验与系统集成（锦上添花）

* 浅色 / 深色模式，支持跟随系统
* 轻量本机运行，仅显示设备画面
* 无账号、无广告、无需互联网连接

---

### ⚡ Scrcpy 技术优势（建议下沉，不作为主卖点）

> 基于 Scrcpy，天然继承其优秀性能：

* 30–120 FPS（取决于设备）
* 1080p 或更高画质
* 35–70 ms 低延迟
* ~1 秒极速启动
* 非侵入式，无需在设备上安装任何应用
* 免费且开源

---

## 五、为什么这样改是“正确的”

### 对用户来说

* **5 秒内知道你是“AI + Scrcpy + 自动化”**
* 不再被性能参数淹没
* 更容易记住「这是一个 *能用自然语言控制手机* 的工具」

### 对你项目长期发展

* AutoGLM 是**战略级能力**，不是一个“附加功能”
* 未来即使加入更多 AI / Agent 能力，也有清晰承载位置
* README / 官网 / 推广文案可以直接复用该结构

---

## 六、可选：极简版 Feature（适合 README 顶部）

如果你想在 README 顶部再放一个“极简版”，我建议：

- 🤖 **智能控制**：基于 **AutoGLM** 的自然语言指令，智能操控 Android 设备
- 🏃 **自动化与效率**：自动化流程执行，支持多设备并行操作
- 🪟 **多设备管理**：可视化窗口编排，统一管理多台设备
- 📡 **连接与网络**：无线连接与 **Gnirehtet** 反向供网支持
- ⚡ **Scrcpy 内核**：基于 Scrcpy 的高性能、低延迟屏幕镜像

---

如果你愿意，我可以下一步直接帮你：

* 重写 **README 的 Features + Introduction**
* 设计一句 **对标竞品的 tagline**
* 或专门为 AutoGLM 写一个 **“为什么这是革命性的能力”** 的章节


## 安装

### 通过发布的软件包手动安装

查看 [发布地址](https://github.com/viarotel-org/escrcpy/releases)

### macOS 可以通过 Homebrew 安装

参阅 [homebrew-escrcpy](https://github.com/viarotel-org/homebrew-escrcpy)

## 文档

- [快速上手](https://viarotel.eu.org/zhHans/guide/started)
- [快捷键](https://viarotel.eu.org/zhHans/reference/scrcpy/shortcuts)
- [设备操作](https://viarotel.eu.org/zhHans/guide/operation)
- [偏好设置](https://viarotel.eu.org/zhHans/guide/preferences)
- [反向供网](https://viarotel.eu.org/zhHans/reference/gnirehtet/)

## 开发人员

如果你是开发人员，希望运行或帮助改进该项目请参阅 [开发文档](https://github.com/viarotel-org/escrcpy/blob/main/develop.md)

## 获得帮助

因为是开源项目 全靠爱发电 所以支持有限 更新节奏不固定

- [常见问题](https://viarotel.eu.org/zhHans/help/escrcpy)
- [反馈问题](https://github.com/viarotel-org/escrcpy/issues)
- [联系邮箱](viarotel@qq.com)

## 下一步做什么？

[里程碑](https://viarotel.eu.org/zhHans/guide/milestones)

## 致谢

该项目的诞生离不开以下开源项目

- [scrcpy](https://github.com/Genymobile/scrcpy)
- [adbkit](https://github.com/DeviceFarmer/adbkit)
- [electron](https://www.electronjs.org/)
- [vue](https://vuejs.org/)
- [gnirehtet](https://github.com/Genymobile/gnirehtet/)
- [autoglm.js](https://github.com/FliPPeDround/autoglm.js)

## 捐赠项目

如果该项目帮到你的话，可以请我喝杯咖啡，让我更有精神完善该项目 😛

<div style="display:flex;">
  <img src="https://cdn.jsdelivr.net/gh/viarotel-org/escrcpy@main/src/assets/sponsor/viarotel-wepay.png" alt="viarotel-wepay" width="30%">
  <img src="https://cdn.jsdelivr.net/gh/viarotel-org/escrcpy@main/src/assets/sponsor/viarotel-alipay.png" alt="viarotel-alipay" width="30%">
  <a href="https://www.paypal.com/paypalme/viarotel" target="_blank" rel="noopener noreferrer">
    <img src="https://cdn.jsdelivr.net/gh/viarotel-org/escrcpy@main/src/assets/sponsor/viarotel-paypal.png" alt="viarotel-paypal" width="30%">
  </a>
</div>

## 贡献者

感谢他们的所做的一切贡献！

[Contributors](https://github.com/viarotel/escrcpy/graphs/contributors)

## Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=viarotel-org/escrcpy&type=Date)](https://star-history.com/#viarotel-org/escrcpy&Date)