# TDesign ChatLoading 组件文档（AI阅读版）
## 一、组件概述
ChatLoading 是专为 Chat 对话场景设计的加载状态组件，用于展示消息加载、AI 思考等过程中的加载动效，适配聊天场景的视觉风格；支持两种加载动画样式，还可自定义加载过程中的提示文案，满足不同加载场景的展示需求。

## 二、核心配置（Props）
| 名称 | 类型 | 默认值 | 描述 | 必传 |
|------|------|--------|------|------|
| animation | String | moving | 加载动画样式，可选项：<br>moving（闪烁加载）/gradient（渐变加载） | N |
| text | String | - | 加载过程中展示的文字描述（如“思考中...”） | N |

## 三、使用指南
### 1. 基础加载组件
仅展示加载动画，无文案，适用于简洁的加载状态提示；可通过 `animation` 切换「闪烁加载（moving）」和「渐变加载（gradient）」两种动效。

### 2. 带文案描述的加载组件
在加载动画旁添加自定义文案（如“思考中...”“加载中...”），提升用户对加载状态的感知，通过 `text` 属性配置文案内容。

## 四、完整示例
### 示例1：基础加载组件（两种动画样式）
```vue
<template>
  <t-space>
    <!-- 闪烁加载动画（默认） -->
    <t-chat-loading animation="moving" />
    <!-- 渐变加载动画 -->
    <t-chat-loading animation="gradient" />
  </t-space>
</template>

<script></script>
```

### 示例2：带文案描述的加载组件
```vue
<template>
  <t-space>
    <t-chat-loading animation="moving" text="思考中..." />
  </t-space>
</template>

<script></script>
```