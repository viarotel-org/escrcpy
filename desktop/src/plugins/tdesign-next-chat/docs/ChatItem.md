# TDesign ChatItem 组件文档（AI阅读版）
## 一、组件概述
ChatItem 是 Chat 组件的单个对话项核心组件，用于展示单条聊天内容，支持头像、昵称、时间、聊天内容的灵活配置；适配 AI 聊天场景特性，可展示模型切换提示、消息加载中的 loading 效果、AI 思维链（推理过程）；同时支持不同角色样式、聊天气泡框样式的差异化配置，满足单条对话的多样化展示需求。

## 二、核心配置（Props）
| 名称 | 类型 | 默认值 | 描述 | 必传 |
|------|------|--------|------|------|
| actions | String / Slot / Function | - | 自定义操作内容（如点赞、复制按钮）。TS 类型：string \| TNode（通用类型定义） | N |
| animation | String | skeleton | 加载动画效果，支持：<br>skeleton（骨架屏）/moving（闪烁加载）/gradient（渐变加载） | N |
| avatar | String / Object / Slot / Function | - | 自定义头像配置，支持字符串（图片地址）、AvatarProps、插槽/函数。<br>TS 类型：String \| AvatarProps \| TNode（参考 Avatar 组件 API） | N |
| content | String / Slot / Function | - | 对话单元的核心内容，支持纯文本或自定义插槽。TS 类型：string \| TNode | N |
| datetime | String / Slot / Function | - | 对话时间配置，支持纯文本或自定义插槽。TS 类型：string \| TNode | N |
| name | String / Slot / Function | - | 对话发送者昵称，支持纯文本或自定义插槽。TS 类型：string \| TNode | N |
| reasoning | Boolean / String / Object | false | AI 思维链（推理过程）展示配置：<br>- false：不显示；<br>- string：显示内置推理内容；<br>- Object：自定义推理面板（TdChatReasoning 类型，含展开按钮位置、展开回调等）。<br>TS 类型：boolean \| TdChatReasoning（interface TdChatReasoning { expandIconPlacement?: 'left'/'right'; onExpandChange?: (isExpand: boolean) => void; collapsePanelProps?: Object }） | N |
| role | String | - | 对话角色（不同角色对应不同样式）：<br>可选项：user（用户）/assistant（助手）/error（错误）/model-change（模型切换）/system（系统消息） | N |
| textLoading | Boolean | false | 新消息加载状态（true 显示骨架屏，接口返回数据后需置为 false） | N |
| variant | String | text | 聊天气泡框样式：<br>可选项：base（基础）/outline（线框）/text（文字，默认） | N |

## 三、使用指南
### 1. 聊天气泡框样式配置
通过 `variant` 属性可配置三种气泡框样式：`text`（文字型，默认）、`outline`（线框型）、`base`（基础型），适配不同视觉风格的聊天场景。

### 2. 角色类型适配
通过 `role` 属性区分对话角色，不同角色自动匹配差异化样式：
- `user`：用户消息样式；
- `assistant`：AI 助手消息样式；
- `error`：错误提示样式；
- `model-change`：模型切换提示样式；
- `system`：系统消息样式。

### 3. 头像/昵称/时间配置
支持灵活配置头像、昵称、时间的显示/隐藏：
- 传 `avatar`/`name`/`datetime` 属性则显示对应内容；
- 不传则自动隐藏，可组合出「有头像有昵称」「有头像无昵称」「无头像有昵称」「无头像无昵称」等多种展示形式。

### 4. 自定义内容与操作按钮
- 头像、昵称、时间、内容均可通过插槽自定义样式/内容（如头像尺寸、内容嵌入图片/链接、时间格式化）；
- 内容支持嵌套 `ChatContent` 组件渲染 Markdown 格式；
- `actions` 插槽可自定义操作按钮（如嵌套 `ChatAction` 组件实现点赞/复制等功能）。

## 四、完整示例
### 示例1：聊天气泡框样式
```vue
<template>
  <t-space direction="vertical">
    <!-- 文字型气泡（默认） -->
    <t-chat-item
      avatar="https://tdesign.gtimg.com/site/avatar.jpg"
      name="自己"
      role="user"
      datetime="今天16:38"
      content="牛顿第一定律是否适用于所有参考系？"
      variant="text"
    ></t-chat-item>
    <!-- 线框型气泡 -->
    <t-chat-item
      avatar="https://tdesign.gtimg.com/site/avatar.jpg"
      name="自己"
      role="user"
      datetime="今天16:38"
      content="牛顿第一定律是否适用于所有参考系？"
      variant="outline"
    ></t-chat-item>
    <!-- 基础型气泡 -->
    <t-chat-item
      avatar="https://tdesign.gtimg.com/site/avatar.jpg"
      name="自己"
      role="user"
      datetime="今天16:38"
      content="牛顿第一定律是否适用于所有参考系？"
      variant="base"
    ></t-chat-item>
  </t-space>
</template>

<script setup></script>
<style scoped></style>
```

### 示例2：角色类型（模型切换/错误提示）
#### 模型切换提示
```vue
<template>
  <t-chat-item
    content="模型由 <span>hunyuan</span> 变为 <span>GPT4</span>"
    variant="base"
    role="model-change"
  ></t-chat-item>
</template>

<script setup lang="ts"></script>
<style scoped></style>
```

#### 错误提示
```vue
<template>
  <t-space direction="vertical">
    <t-chat-item
      avatar="https://tdesign.gtimg.com/site/avatar.jpg"
      name="自己"
      datetime="今天16:38"
      content="！！！请求出错"
      role="error"
    ></t-chat-item>
  </t-space>
</template>

<script setup lang="ts"></script>
<style scoped></style>
```

### 示例3：头像/昵称/时间组合配置
```vue
<template>
  <t-chat :clear-history="false" :reverse="false" layout="single">
    <!-- 有头像有昵称有时间 -->
    <t-chat-item
      avatar="https://tdesign.gtimg.com/site/avatar.jpg"
      name="自己"
      role="user"
      datetime="今天16:38"
      content="牛顿第一定律是否适用于所有参考系？"
      variant="text"
    ></t-chat-item>
    <t-chat-item
      avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
      name="TDesignAI"
      role="assistant"
      datetime="今天16:38"
      content="牛顿第一定律并不适用于所有参考系，它只适用于惯性参考系..."
      variant="text"
    ></t-chat-item>

    <t-divider>有头像无昵称</t-divider>
    <t-chat-item
      avatar="https://tdesign.gtimg.com/site/avatar.jpg"
      role="user"
      content="牛顿第一定律是否适用于所有参考系？"
      variant="text"
    ></t-chat-item>

    <t-divider>无头像有昵称</t-divider>
    <t-chat-item
      name="自己"
      role="user"
      datetime="今天16:38"
      content="牛顿第一定律是否适用于所有参考系？"
      variant="text"
    ></t-chat-item>

    <t-divider>无头像无昵称</t-divider>
    <t-chat-item role="user" content="牛顿第一定律是否适用于所有参考系？" variant="text"></t-chat-item>
  </t-chat>
</template>

<script setup></script>
<style scoped></style>
```

### 示例4：自定义头像/昵称/内容/操作按钮
```vue
<template>
  <t-chat-item role="assistant">
    <!-- 自定义头像 -->
    <template #avatar>
      <t-avatar size="large" shape="circle" image="https://tdesign.gtimg.com/site/chat-avatar.png" />
    </template>
    <!-- 自定义昵称 -->
    <template #name><p>AI助手</p></template>
    <!-- 自定义时间 -->
    <template #datetime><p>今天16:38</p></template>
    <!-- 自定义内容（嵌套ChatContent+图片+链接） -->
    <template #content>
      <t-chat-content
        content="牛顿第一定律并不适用于所有参考系，它只适用于惯性参考系。在质点不受外力作用时，能够判断出质点静止或作匀速直线运动的参考系一定是惯性参考系，因此只有在惯性参考系中牛顿第一定律才适用。"
      ></t-chat-content>
      <div class="bubble">
        <t-image src="https://tdesign.gtimg.com/demo/demo-image-1.png" shape="round" fit="scale-down" />
        <div class="link">参考链接</div>
        <ul>
          <li><t-link theme="primary">维基百科</t-link></li>
          <li><t-link theme="primary">高中物理</t-link></li>
        </ul>
      </div>
    </template>
    <!-- 自定义操作按钮（嵌套ChatAction） -->
    <template #actions>
      <t-chat-action
        :is-good="isGood"
        :is-bad="isBad"
        content="牛顿第一定律并不适用于所有参考系，它只适用于惯性参考系..."
        @operation="handleOperation"
      />
    </template>
  </t-chat-item>
</template>

<script setup>
import { ref } from 'vue';

// 点赞/点踩状态
const isGood = ref(false);
const isBad = ref(false);

// 操作按钮回调
const handleOperation = (type) => {
  if (type === 'good') {
    isGood.value = !isGood.value;
    isBad.value = false;
  } else if (type === 'bad') {
    isBad.value = !isBad.value;
    isGood.value = false;
  }
};
</script>

<style lang="less">
.bubble {
  margin: 0 0 10px 16px;
  .link { margin-top: 10px; }
  li { color: var(--td-brand-color-7); }
}
.t-image__wrapper { background: none; }
</style>
```