# TDesign ChatReasoning 组件文档（AI阅读版）
## 一、组件概述
ChatReasoning 是专为 AI 聊天场景设计的思维链展示组件，核心能力为渲染带「思维链（推理过程）」的 Markdown 内容；AI 输出最终回答前的推理过程可通过该组件以折叠面板形式展示，支持折叠/展开状态控制、自定义面板头部/尾部/展开图标等配置，适配 AI 回答可解释性展示、复杂交互场景（如拖拽弹窗、悬窗）等需求。

## 二、核心配置（Props）
| 名称 | 类型 | 默认值 | 描述 | 必传 |
|------|------|--------|------|------|
| collapsed | Boolean | false | 是否折叠思维链面板（支持 `v-model:collapsed` 语法糖，受控属性） | N |
| defaultCollapsed | Boolean | false | 是否折叠思维链面板（非受控属性，仅初始化生效） | N |
| collapsePanelProps | Object | - | 透传给 CollapsePanel 组件的全部属性（如头部内容、展开图标、面板样式等），TS 类型：`CollapsePanelProps`（参考 Collapse 组件 API） | N |
| expandIcon | Slot / Function | - | 折叠面板展开图标（优先级低于 `collapsePanelProps.expandIcon`），TS 类型：TNode（通用类型定义） | N |
| expandIconPlacement | String | right | 展开图标位置，可选项：left/right | N |
| header | Slot / Function | - | 折叠面板头部内容（优先级低于 `collapsePanelProps.header`），TS 类型：TNode | N |
| headerRightContent | Slot / Function | - | 折叠面板头部右侧内容（优先级低于 `collapsePanelProps.headerRightContent`），TS 类型：TNode | N |
| onExpandChange | Function | - | 面板展开/折叠状态变更回调，TS 类型：`(value: CollapseValue) => void`（`CollapseValue` 参考 Collapse 组件类型） | N |

## 三、事件（Events）
| 名称 | 参数 | 描述 |
|------|------|------|
| expand-change | (value: Boolean) | 面板展开/折叠状态变更时触发<br>value：当前折叠状态（true=折叠，false=展开） | N |

## 四、使用指南
### 1. 基础问答场景
通过 `ChatItem` 的 `reasoning` 属性配置思维链，自动关联 `ChatReasoning` 组件，实现「思维链（折叠/展开）+ 最终回答」的联动展示，支持加载中状态（搭配 `ChatLoading`）、思考时长展示等。

### 2. 自定义思维链展示
- 方式1：通过 `collapsePanelProps` 透传 CollapsePanel 属性，自定义面板头部、内容、展开图标等；
- 方式2：直接使用 `header`/`expandIcon`/`headerRightContent` 等插槽，精细化定制面板交互样式。

### 3. 复杂场景扩展
可搭配 `Dialog`（非模态可拖拽对话框）、`Drawer`（抽屉）等组件，实现 AI 助手悬窗、拖拽弹窗等交互形式，适配不同产品形态的 AI 聊天场景。

## 五、完整示例
### 示例1：基础问答（关联 ChatItem 使用）
```vue
<template>
  <t-chat layout="single" style="height: 800px" :clear-history="chatList.length > 0 && !isStreamLoad">
    <template v-for="(item, index) in chatList" :key="index">
      <t-chat-item
        :avatar="item.avatar"
        :name="item.name"
        :role="item.role"
        :datetime="item.datetime"
        :text-loading="index === 0 && loading"
        :content="item.content"
        <!-- 配置思维链 -->
        :reasoning="{
          collapsed: index === 0 && !isStreamLoad,
          expandIconPlacement: 'right',
          onExpandChange: (value) => handleChange(value, { index }),
          collapsePanelProps: {
            header: renderHeader(index === 0 && isStreamLoad && !item.content, item),
            content: renderReasoningContent(item.reasoning),
          },
        }"
      />
    </template>
    <!-- 输入框插槽 -->
    <template #footer>
      <t-chat-sender v-model="inputValue" :loading="isStreamLoad" @send="inputEnter" @stop="onStop" />
    </template>
  </t-chat>
</template>

<script setup lang="jsx">
import { ref } from 'vue';
import { CheckCircleIcon } from 'tdesign-icons-vue-next';

const loading = ref(false);
const isStreamLoad = ref(false);
const inputValue = ref('');
const chatList = ref([
  {
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    name: 'TDesignAI',
    datetime: '今天16:38',
    // 思维链内容（Markdown格式）
    reasoning: `嗯，用户问牛顿第一定律是不是适用于所有参考系。首先，我得先回忆一下牛顿第一定律的内容...`,
    // 最终回答内容
    content: `牛顿第一定律（惯性定律）**并不适用于所有参考系**，它只在**惯性参考系**中成立...`,
    role: 'assistant',
    duration: 10,
  },
  {
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    name: '自己',
    datetime: '今天16:38',
    content: '牛顿第一定律是否适用于所有参考系？',
    role: 'user',
    reasoning: '',
  },
]);

// 渲染思维链面板头部
const renderHeader = (flag, item) => {
  if (flag) return <t-chat-loading text="思考中..." />;
  const endText = item.duration ? `已深度思考(用时${item.duration}秒)` : '已深度思考';
  return (
    <div style="display:flex;align-items:center">
      <CheckCircleIcon style={{ color: 'var(--td-success-color-5)', marginRight: '8px' }} />
      <span>{endText}</span>
    </div>
  );
};

// 渲染思维链内容（关联ChatContent）
const renderReasoningContent = (reasoningContent) => <t-chat-content content={reasoningContent} role="assistant" />;

// 思维链展开/折叠回调
const handleChange = (value, { index }) => {
  console.log('思维链状态变更：', value, '索引：', index);
};

// 发送消息/停止加载等逻辑（核心逻辑简化）
const inputEnter = () => {/* 发送消息逻辑 */};
const onStop = () => {/* 停止流式加载逻辑 */};
</script>
```

### 示例2：自定义思维链（插槽/配置项）
```vue
<template>
  <t-chat layout="both" style="height: 150px" :clear-history="false" :reverse="false">
    <t-chat-reasoning
      v-model:collapsed="collapsed"
      expand-icon-placement="right"
      @expand-change="handleChange"
    >
      <!-- 自定义面板头部 -->
      <template #header>
        <t-chat-loading text="思考中..." />
      </template>
      <!-- 思维链内容（Markdown渲染） -->
      <t-chat-content :content="reasoning" />
    </t-chat-reasoning>
  </t-chat>
</template>

<script setup>
import { ref } from 'vue';
const collapsed = ref(false);
// 3秒后自动折叠
setTimeout(() => collapsed.value = true, 3000);

// 思维链内容
const reasoning = `嗯，用户问牛顿第一定律是不是适用于所有参考系。首先，我得先回忆一下牛顿第一定律的内容...`;

// 展开/折叠回调
const handleChange = (value) => {
  console.log('思维链折叠状态：', value);
};
</script>
```

### 示例3：AI助手可拖拽（搭配Dialog）
```vue
<template>
  <t-button theme="primary" @click="visibleModelessDrag = true">AI助手可拖拽</t-button>
  
  <t-dialog
    v-model:visible="visibleModelessDrag"
    :footer="false"
    header="AI助手"
    mode="modeless"
    draggable
  >
    <template #body>
      <t-chat layout="single" style="height: 600px">
        <template v-for="(item, index) in chatList" :key="index">
          <t-chat-item
            :avatar="item.avatar"
            :name="item.name"
            :role="item.role"
            :content="item.content"
            <!-- 思维链配置 -->
            :reasoning="{
              expandIconPlacement: 'right',
              collapsePanelProps: {
                header: renderHeader(index === 0 && isStreamLoad && !item.content, item),
                content: renderReasoningContent(item.reasoning),
              },
            }"
          />
        </template>
        <template #footer>
          <t-chat-sender v-model="inputValue" :loading="isStreamLoad" @send="inputEnter" />
        </template>
      </t-chat>
    </template>
  </t-dialog>
</template>

<script setup>
import { ref } from 'vue';
const visibleModelessDrag = ref(false);
const inputValue = ref('');
const isStreamLoad = ref(false);
const chatList = ref([/* 聊天列表数据，同示例1 */]);

// 渲染思维链头部/内容（同示例1）
const renderHeader = (flag, item) => {/* ... */};
const renderReasoningContent = (content) => <t-chat-content content={content} role="assistant" />;
const inputEnter = () => {/* 发送消息逻辑 */};
</script>
```

### 示例4：AI助手悬窗（搭配Drawer）
```vue
<template>
  <t-button theme="primary" @click="visible = true">AI助手悬窗展示</t-button>
  
  <t-drawer v-model:visible="visible" :footer="false" size="480px">
    <template #header>
      <t-avatar size="32px" shape="circle" image="https://tdesign.gtimg.com/site/chat-avatar.png" />
      <span class="title">Hi, 我是AI</span>
    </template>
    <t-chat layout="both">
      <template v-for="(item, index) in chatList" :key="index">
        <t-chat-item
          :role="item.role"
          :content="item.content"
          :variant="item.role === 'assistant' ? 'outline' : 'base'"
          <!-- 思维链配置 -->
          :reasoning="{
            expandIconPlacement: 'right',
            collapsePanelProps: {
              header: renderHeader(index === 0 && isStreamLoad && !item.content, item),
              content: renderReasoningContent(item.reasoning),
            },
          }"
        />
      </template>
      <template #footer>
        <t-chat-sender v-model="inputValue" :loading="isStreamLoad" @send="inputEnter" />
      </template>
    </t-chat>
  </t-drawer>
</template>

<script setup>
import { ref } from 'vue';
const visible = ref(false);
const inputValue = ref('');
const isStreamLoad = ref(false);
const chatList = ref([/* 聊天列表数据，同示例1 */]);

// 渲染思维链头部/内容（同示例1）
const renderHeader = (flag, item) => {/* ... */};
const renderReasoningContent = (content) => <t-chat-content content={content} role="assistant" />;
const inputEnter = () => {/* 发送消息逻辑 */};
</script>

<style lang="less" scoped>
.title {
  margin-left: 16px;
  font-size: 20px;
  font-weight: 600;
}
</style>
```