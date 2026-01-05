# TDesign ChatContent 组件文档（AI阅读版）
## 一、组件概述
ChatContent 是 Chat 组件的内容渲染子组件，核心能力为支持 Markdown 格式内容的自动解析与渲染；同时可通过 `role` 属性配置不同角色类型，匹配用户、助手、错误提示等差异化样式，适配不同场景的聊天内容展示需求。

## 二、核心配置（Props）
| 名称 | 类型 | 默认值 | 描述 | 必传 |
|------|------|--------|------|------|
| content | String | - | 聊天内容，支持标准 Markdown 格式（含标题、列表、代码块、链接、引用等） | N |
| role | String | - | 内容所属角色，不同角色对应不同样式：<br>可选项：user（用户）/assistant（助手）/error（错误）/model-change（模型切换）/system（系统消息） | N |

## 三、使用指南
### 1. 默认聊天格式（Markdown 自动渲染）
组件会对传入的 Markdown 格式内容（如标题、代码块、列表、引用、链接等）自动解析并渲染，适配大模型返回的结构化内容展示场景，无需额外处理 Markdown 解析逻辑。

### 2. 纯文本聊天（无高亮效果）
用户发送的纯文本内容（如代码片段、普通文本）会保持原生格式展示，无 Markdown 高亮、排版效果，适配用户输入类内容的基础展示需求。

## 四、完整示例
### 示例1：默认格式（Markdown 渲染）
```vue
<template>
  <t-chat-content role="assistant" :content="doc" variant="base"> </t-chat-content>
</template>

<script setup lang="ts">
// 包含各类Markdown语法的示例内容
const doc = `
# This is TDesign

## This is TDesign

### This is TDesign

#### This is TDesign

The point of reference-style links is not that they’re easier to write. The point is that with reference-style links, your document source is vastly more readable. Compare the above examples: using reference-style links, the paragraph itself is only 81 characters long; with inline-style links, it’s 176 characters; and as raw \`HTML\`, it’s 234 characters. In the raw \`HTML\`, there’s more markup than there is text.

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet.

an example | *an example* | **an example**

1. Bird
1. McHale
1. Parish
    1. Bird
    1. McHale
        1. Parish

- Red
- Green
- Blue
    - Red
    - Green
        - Blue

This is [an example](http://example.com/ "Title") inline link.

<http://example.com/>

\`\`\`bash
$ npm i tdesign-vue-next
\`\`\`

---

\`\`\`javascript
import { createApp } from 'vue';
import App from './app.vue';

const app = createApp(App);
app.use(TDesignChat);
\`\`\`
`;
</script>
```

### 示例2：纯文本聊天（无 Markdown 高亮）
```vue
<template>
  <t-chat-content :content="ask" variant="base" role="user"></t-chat-content>
</template>

<script setup lang="ts">
// 纯文本内容（无Markdown渲染，保持原生格式）
const ask = `import TDesign from 'tdesign-vue-next'; // 引入tdesign组件库
app.use(TDesign).use(router).mount('#app');`;
</script>

<style scoped></style>
```