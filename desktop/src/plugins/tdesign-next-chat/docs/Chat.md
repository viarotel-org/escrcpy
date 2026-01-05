# TDesign Chat 组件文档（AI阅读版）
## 一、组件概述
Chat 组件适用于 ChatBot 对话、普通聊天等对话类场景，支持基础聊天展示、自定义样式、流式/非流式加载、清空历史、滚动控制等核心能力，可灵活适配不同对话交互需求。

## 二、核心配置（Props）
| 名称 | 类型 | 默认值 | 描述 | 必传 |
|------|------|--------|------|------|
| actions | Slot / Function | - | 自定义操作按钮的插槽。TS 类型：TNode（通用类型定义） | N |
| animation | String | skeleton | 动画效果，支持「渐变加载动画」(gradient)、「闪烁加载动画」(moving)、「骨架屏」(skeleton) 三种 | N |
| avatar | Slot / Function | - | 自定义每个对话单元的头像插槽。TS 类型：TNode<{ item: TdChatItemProps, index: number }> | N |
| clearHistory | Boolean | true | 是否显示清空历史按钮 | N |
| content | Slot / Function | - | 自定义每个对话单独的聊天内容。TS 类型：TNode<{ item: TdChatItemProps, index: number }> | N |
| data | Array | - | 对话列表数据。TS 类型：Array<TdChatItemMeta>；<br>interface TdChatItemMeta { <br>  avatar?: string; name?: string; role?: string; datetime?: string; content?: string; reasoning?: string <br>} | N |
| datetime | Slot / Function | - | 自定义每个对话单元的时间。TS 类型：TNode<{ item: TdChatItemProps, index: number }> | N |
| isStreamLoad | Boolean | false | 流式加载是否结束 | N |
| layout | String | both | 对话布局形式，支持两侧对齐（both）、左对齐（single） | N |
| name | Slot / Function | - | 自定义每个对话单元的昵称。TS 类型：TNode<{ item: TdChatItemProps, index: number }> | N |
| reasoning | Slot / Function | - | 自定义每个对话单元的思考过程插槽。TS 类型：TNode<{ item: TdChatItemProps, index: number }> | N |
| reverse | Boolean | true | 是否倒序渲染对话列表 | N |
| textLoading | Boolean | false | 新消息是否处于加载状态（加载时默认显示骨架屏） | N |
| onClear | Function | - | 点击清空历史按钮回调。TS 类型：(context: { e: MouseEvent }) => void | N |
| onScroll | Function | - | 滚动事件回调。TS 类型：(context: { e: MouseEvent }) => void | N |

## 三、事件（Events）
| 名称 | 参数 | 描述 |
|------|------|------|
| clear | (context: { e: MouseEvent }) | 点击清空历史按钮回调（与onClear Props功能一致） |
| scroll | (context: { e: MouseEvent }) | 滚动事件回调（与onScroll Props功能一致） |

## 四、组件实例方法（ChatInstanceFunctions）
| 名称 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| scrollToBottom | params: ScrollToBottomParams（type ScrollToBottomParams = { behavior: 'auto' \| 'smooth'}） | - | 对话列表过长时，将列表滚动回底部的方法 |

## 五、关键使用规则
### 1. 渲染顺序与滚动逻辑
- 倒序渲染（reverse=true，默认）：采用 `flex-direction: column-reverse` 布局，新消息自动滚动到底部，需将新消息添加至数据数组头部（使用 `unshift()` 方法）；
- 正序渲染（reverse=false）：新消息添加至数据数组尾部（使用 `push()` 方法），需通过 ref 调用 `scrollToBottom()` 方法实现滚动到底部。

### 2. 加载状态控制
- `textLoading=true`：新消息显示骨架屏加载状态，接口返回数据后需置为 `false`；
- `isStreamLoad`：标记流式加载是否进行中，用于控制输入框停止按钮、操作按钮状态等。

## 六、典型使用场景及示例
### 场景1：基础问答
最基础的聊天场景，包含头像、昵称、时间、聊天内容、输入框，支持清空历史、滚动监听。
```vue
<template>
  <div class="chat-box">
    <t-chat
      ref="chatRef"
      :clear-history="chatList.length > 0 && !isStreamLoad"
      :data="chatList"
      :text-loading="loading"
      :is-stream-load="isStreamLoad"
      style="height: 600px"
      @scroll="handleChatScroll"
      @clear="clearConfirm"
    >
      <template #content="{ item, index }">
        <t-chat-reasoning v-if="item.reasoning?.length > 0" expand-icon-placement="right">
          <template #header>
            <t-chat-loading v-if="isStreamLoad && item.content.length === 0" text="思考中..." />
            <div v-else style="display: flex; align-items: center">
              <CheckCircleIcon style="color: var(--td-success-color-5); font-size: 20px; margin-right: 8px" />
              <span>已深度思考</span>
            </div>
          </template>
          <t-chat-content v-if="item.reasoning.length > 0" :content="item.reasoning" />
        </t-chat-reasoning>
        <t-chat-content v-if="item.content.length > 0" :content="item.content" />
      </template>
      <template #actions="{ item, index }">
        <t-chat-action
          :content="item.content"
          :operation-btn="['good', 'bad', 'replay', 'copy']"
          @operation="handleOperation"
        />
      </template>
      <template #footer>
        <t-chat-input :stop-disabled="isStreamLoad" @send="inputEnter" @stop="onStop"> </t-chat-input>
      </template>
    </t-chat>
    <t-button v-show="isShowToBottom" variant="text" class="bottomBtn" @click="backBottom">
      <div class="to-bottom"><ArrowDownIcon /></div>
    </t-button>
  </div>
</template>

<script setup lang="jsx">
import { ref } from 'vue';
import { ArrowDownIcon, CheckCircleIcon } from 'tdesign-icons-vue-next';

const fetchCancel = ref(null);
const loading = ref(false);
const isStreamLoad = ref(false);
const chatRef = ref(null);
const isShowToBottom = ref(false);

// 滚动回底部
const backBottom = () => {
  chatRef.value.scrollToBottom({ behavior: 'smooth' });
};

// 监听滚动显示/隐藏回到底部按钮
const handleChatScroll = ({ e }) => {
  isShowToBottom.value = e.target.scrollTop < 0;
};

// 清空聊天记录
const clearConfirm = () => {
  chatList.value = [];
};

// 操作按钮回调（点赞/点踩/重放/复制）
const handleOperation = (type, options) => {
  console.log('操作类型：', type, options);
};

// 初始化聊天数据（倒序）
const chatList = ref([
  {
    content: `模型由<span>hunyuan</span>变为<span>GPT4</span>`,
    role: 'model-change',
    reasoning: '',
  },
  {
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    name: 'TDesignAI',
    datetime: '今天16:38',
    reasoning: '',
    content: '它叫 McMurdo Station ATM，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。',
    role: 'assistant',
    duration: 10,
  },
  {
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    name: '自己',
    datetime: '今天16:38',
    content: '南极的自动提款机叫什么名字？',
    role: 'user',
    reasoning: '',
  },
]);

// 停止流式加载
const onStop = () => {
  if (fetchCancel.value) {
    fetchCancel.value.controller.close();
    loading.value = false;
    isStreamLoad.value = false;
  }
};

// 发送输入消息
const inputEnter = (inputValue) => {
  if (isStreamLoad.value || !inputValue) return;
  // 添加用户消息（倒序：unshift）
  chatList.value.unshift({
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    name: '自己',
    datetime: new Date().toDateString(),
    content: inputValue,
    role: 'user',
  });
  // 添加AI占位消息
  chatList.value.unshift({
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    name: 'TDesignAI',
    datetime: new Date().toDateString(),
    content: '',
    reasoning: '',
    role: 'assistant',
  });
  // 模拟流式加载数据
  handleData(inputValue);
};

// 模拟SSE流式请求
const fetchSSE = async (fetchFn, options) => {
  const response = await fetchFn();
  const { success, fail, complete } = options;
  if (!response.ok) {
    complete?.(false, response.statusText);
    fail?.();
    return;
  }
  const reader = response?.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) return;

  reader.read().then(function processText({ done, value }) {
    if (done) {
      complete?.(true);
      return;
    }
    const chunk = decoder.decode(value, { stream: true });
    const buffers = chunk.toString().split(/\r?\n/);
    const jsonData = JSON.parse(buffers);
    success(jsonData);
    reader.read().then(processText);
  });
};

// 处理消息请求
const handleData = async (inputValue) => {
  loading.value = true;
  isStreamLoad.value = true;
  const lastItem = chatList.value[0];
  // 模拟AI返回数据
  const mockedData = {
    reasoning: `嗯，用户问牛顿第一定律是不是适用于所有参考系...`,
    content: `牛顿第一定律（惯性定律）**并不适用于所有参考系**，它只在**惯性参考系**中成立...`,
  };
  const mockResponse = new MockSSEResponse(mockedData);
  fetchCancel.value = mockResponse;
  
  await fetchSSE(
    () => mockResponse.getResponse(),
    {
      success(result) {
        loading.value = false;
        lastItem.reasoning += result.delta.reasoning_content;
        lastItem.content += result.delta.content;
      },
      complete(isOk, msg) {
        if (!isOk) {
          lastItem.role = 'error';
          lastItem.content = msg;
          lastItem.reasoning = msg;
        }
        lastItem.duration = 20;
        isStreamLoad.value = false;
        loading.value = false;
      },
    }
  );
};
</script>
```

### 场景2：自定义配置
自定义头像、昵称、时间、聊天内容、底部输入框等样式/内容。
```vue
<template>
  <t-chat
    :clear-history="false"
    :reverse="true"
    :text-loading="loading"
    :data="[
      {
        avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
        name: 'TDesignAI',
        datetime: '今天16:38',
        content: '它叫 McMurdo Station ATM...',
        role: 'assistant',
      },
      {
        avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
        name: '自己',
        datetime: '今天16:38',
        content: '南极的自动提款机叫什么名字？',
        role: 'user',
      },
    ]"
  >
    <template #name="{ item, index }"> {{ item.name }} </template>
    <template #avatar="{ item, index }">
      <t-avatar size="large" shape="circle" :image="item.avatar" />
    </template>
    <template #datetime="{ item, index }"> {{ item.datetime }} </template>
    <template #content="{ item, index }">
      <t-chat-content :content="item.content" />
    </template>
    <template #footer>
      <t-chat-input :stop-disabled="isStreamLoad" @send="inputEnter" @stop="handleStop"> </t-chat-input>
    </template>
  </t-chat>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const loading = ref(false);
const isStreamLoad = ref(false);

// 停止流式加载
const handleStop = () => {
  isStreamLoad.value = false;
};

// 模拟发送消息
const inputEnter = (inputValue: string) => {
  if (isStreamLoad.value || !inputValue) return;
  isStreamLoad.value = true;
  loading.value = true;
  // 模拟加载结束
  setTimeout(() => loading.value = false, 3000);
  setTimeout(() => isStreamLoad.value = false, 5000);
};
</script>
```

### 场景3：流式与非流式加载
区分流式（逐字渲染）和非流式（一次性渲染）消息加载效果。
```vue
<template>
  <t-chat layout="both" style="height: 600px" :clear-history="false">
    <template v-for="(item, index) in chatList" :key="index">
      <t-chat-item :content="item" avatar="https://tdesign.gtimg.com/site/avatar.jpg" variant="base"> </t-chat-item>
    </template>
    <template #footer>
      <t-space align="center">
        <t-button block variant="outline" @click="addMessage">非流式消息</t-button>
        <t-button v-if="!startRender" block variant="outline" @click="toggleStartRender">流式消息</t-button>
        <t-button v-else block variant="dashed" @click="stop">停止</t-button>
      </t-space>
    </template>
  </t-chat>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const chatList = ref(new Array(5).fill('牛顿第一定律是否适用于所有参考系？'));
const startRender = ref(false);

// 添加非流式消息
const addMessage = () => {
  chatList.value = [
    `牛顿第一定律并不适用于所有参考系，它只适用于惯性参考系...`,
    ...chatList.value,
  ];
};

// 启动流式渲染
const toggleStartRender = () => {
  startRender.value = true;
};

// 停止流式渲染
const stop = () => {
  startRender.value = false;
};

// 监听流式渲染状态，模拟逐字加载
watch(
  [chatList, startRender],
  ([newChatList, newStartRender]) => {
    if (!newStartRender) return;
    const timer = setTimeout(() => {
      chatList.value = [newChatList[0] + '逐字渲染', ...newChatList.slice(1)];
    }, 100);
    return () => clearTimeout(timer);
  },
  { deep: true }
);
</script>
```

### 场景4：AI助手可拖拽（搭配Dialog）
将Chat组件嵌入可拖拽的非模态Dialog中，实现可拖拽的AI助手窗口。
```vue
<template>
  <t-space align="center">
    <t-button theme="primary" @click="visibleModelessDrag = true">AI助手可拖拽</t-button>
  </t-space>
  <t-dialog
    v-model:visible="visibleModelessDrag"
    :footer="false"
    header="AI助手"
    mode="modeless"
    draggable
    :on-confirm="() => (visibleModelessDrag = false)"
  >
    <template #body>
      <t-chat
        layout="single"
        style="height: 600px"
        :data="chatList"
        :clear-history="chatList.length > 0 && !isStreamLoad"
        :text-loading="loading"
        :is-stream-load="isStreamLoad"
        @on-action="operation"
        @clear="clearConfirm"
      >
        <template #actions="{ item, index }">
          <t-chat-action
            :content="item.content"
            :operation-btn="['good', 'bad', 'replay', 'copy']"
            @operation="handleOperation"
          />
        </template>
        <template #footer>
          <t-chat-input :stop-disabled="isStreamLoad" @send="inputEnter" @stop="onStop"> </t-chat-input>
        </template>
      </t-chat>
    </template>
  </t-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { MockSSEResponse } from './mock-data/sseRequest';

const visibleModelessDrag = ref(false);
const fetchCancel = ref(null);
const loading = ref(false);
const isStreamLoad = ref(false);

// 初始化聊天数据
const chatList = ref([
  { content: `模型由 <span>hunyuan</span> 变为 <span>GPT4</span>`, role: 'model-change' },
  {
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    name: 'TDesignAI',
    datetime: '今天16:38',
    content: '它叫 McMurdo Station ATM...',
    role: 'assistant',
  },
  {
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    name: '自己',
    datetime: '今天16:38',
    content: '南极的自动提款机叫什么名字？',
    role: 'user',
  },
]);

// 操作按钮回调
const handleOperation = (type, options) => {
  console.log('操作类型：', type, options);
};
const operation = (type, options) => {
  console.log(type, options);
};

// 清空聊天记录
const clearConfirm = () => {
  chatList.value = [];
};

// 停止流式加载
const onStop = () => {
  if (fetchCancel.value) {
    fetchCancel.value.controller.close();
    loading.value = false;
  }
};

// 发送消息
const inputEnter = (inputValue) => {
  if (isStreamLoad.value || !inputValue) return;
  // 添加用户消息
  chatList.value.unshift({
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    name: '自己',
    datetime: new Date().toDateString(),
    content: inputValue,
    role: 'user',
  });
  // 添加AI占位消息
  chatList.value.unshift({
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    name: 'TDesignAI',
    datetime: new Date().toDateString(),
    content: '',
    role: 'assistant',
  });
  handleData(inputValue);
};

// 模拟SSE流式请求
const fetchSSE = async (fetchFn, options) => {
  const response = await fetchFn();
  const { success, fail, complete } = options;
  if (!response.ok) {
    complete?.(false, response.statusText);
    fail?.();
    return;
  }
  const reader = response?.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) return;
  const bufferArr = [];
  let dataText = '';
  const event = { data: null };

  reader.read().then(function processText({ done, value }) {
    if (done) {
      complete?.(true);
      return;
    }
    const chunk = decoder.decode(value, { stream: true });
    const buffers = chunk.toString().split(/\r?\n/);
    bufferArr.push(...buffers);
    const i = 0;
    while (i < bufferArr.length) {
      const line = bufferArr[i];
      if (line) {
        dataText += line;
        event.data = dataText;
      }
      if (event.data) {
        const jsonData = JSON.parse(JSON.stringify(event));
        success(jsonData);
        event.data = null;
      }
      bufferArr.splice(i, 1);
    }
    reader.read().then(processText);
  });
};

// 处理消息请求
const handleData = async () => {
  loading.value = true;
  isStreamLoad.value = true;
  const lastItem = chatList.value[0];
  const mockedData = `这是一段模拟的流式字符串数据。`;
  const mockResponse = new MockSSEResponse(mockedData);
  fetchCancel.value = mockResponse;
  
  await fetchSSE(
    () => mockResponse.getResponse(),
    {
      success(result) {
        loading.value = false;
        lastItem.content += result.data;
      },
      complete(isOk, msg) {
        if (!isOk || !lastItem.content) {
          lastItem.role = 'error';
          lastItem.content = msg;
        }
        isStreamLoad.value = false;
        loading.value = false;
      },
    }
  );
};
</script>
```

### 场景5：AI助手悬窗（搭配Drawer）
将Chat组件嵌入Drawer抽屉组件，实现侧边悬窗式AI助手。
```vue
<template>
  <t-space align="center">
    <t-button theme="primary" @click="visible = true">AI助手悬窗展示</t-button>
  </t-space>
  <t-drawer v-model:visible="visible" :footer="false" size="480px" :close-btn="true" class="drawer-box">
    <template #header>
      <t-avatar size="32px" shape="circle" image="https://tdesign.gtimg.com/site/chat-avatar.png"></t-avatar>
      <span class="title">Hi, &nbsp;我是AI</span>
    </template>
    <t-chat
      layout="both"
      :clear-history="chatList.length > 0 && !isStreamLoad"
      @on-action="operation"
      @clear="clearConfirm"
    >
      <template v-for="(item, index) in chatList" :key="index">
        <t-chat-item
          :role="item.role"
          :content="item.content"
          :text-loading="index === 0 && loading"
          :variant="getStyle(item.role)"
        >
          <template v-if="!isStreamLoad" #actions>
            <t-chat-action
              :is-good="isGood"
              :item-index="index"
              :is-bad="isBad"
              :content="item.content"
              @operation="handleOperation"
            />
          </template>
        </t-chat-item>
      </template>
      <template #footer>
        <t-chat-input :stop-disabled="isStreamLoad" @send="inputEnter" @stop="onStop"> </t-chat-input>
      </template>
    </t-chat>
  </t-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { MockSSEResponse } from './mock-data/sseRequest';

const visible = ref(false);
const fetchCancel = ref(null);
const loading = ref(false);
const isStreamLoad = ref(false);
const isGood = ref(false);
const isBad = ref(false);

// 根据角色定义消息样式
const getStyle = (role) => {
  if (role === 'assistant') return 'outline';
  if (role === 'user') return 'base';
  return 'text';
};

// 操作按钮回调（点赞/点踩/重放）
const handleOperation = (type, options) => {
  const { index } = options;
  if (type === 'good') {
    isGood.value = !isGood.value;
    isBad.value = false;
  } else if (type === 'bad') {
    isBad.value = !isBad.value;
    isGood.value = false;
  } else if (type === 'replay') {
    const userQuery = chatList.value[index + 1].content;
    inputEnter(userQuery);
  }
};

// 初始化聊天数据
const chatList = ref([
  { content: `模型由 <span>hunyuan</span> 变为 <span>GPT4</span>`, role: 'model-change' },
  { content: '它叫 McMurdo Station ATM...', role: 'assistant' },
  { content: '南极的自动提款机叫什么名字？', role: 'user' },
]);

const operation = (type, options) => {
  console.log(type, options);
};

// 清空聊天记录
const clearConfirm = () => {
  chatList.value = [];
};

// 停止流式加载
const onStop = () => {
  if (fetchCancel.value) {
    fetchCancel.value.controller.close();
    loading.value = false;
  }
};

// 发送消息
const inputEnter = (inputValue) => {
  if (isStreamLoad.value || !inputValue) return;
  chatList.value.unshift({ content: inputValue, role: 'user' });
  chatList.value.unshift({ content: '', role: 'assistant' });
  handleData(inputValue);
};

// 模拟SSE流式请求
const fetchSSE = async (fetchFn, options) => {
  const response = await fetchFn();
  const { success, fail, complete } = options;
  if (!response.ok) {
    complete?.(false, response.statusText);
    fail?.();
    return;
  }
  const reader = response?.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) return;
  const bufferArr = [];
  let dataText = '';
  const event = { data: null };

  reader.read().then(function processText({ done, value }) {
    if (done) {
      complete?.(true);
      return;
    }
    const chunk = decoder.decode(value, { stream: true });
    const buffers = chunk.toString().split(/\r?\n/);
    bufferArr.push(...buffers);
    const i = 0;
    while (i < bufferArr.length) {
      const line = bufferArr[i];
      if (line) {
        dataText += line;
        event.data = dataText;
      }
      if (event.data) {
        const jsonData = JSON.parse(JSON.stringify(event));
        success(jsonData);
        event.data = null;
      }
      bufferArr.splice(i, 1);
    }
    reader.read().then(processText);
  });
};

// 处理消息请求
const handleData = async () => {
  loading.value = true;
  isStreamLoad.value = true;
  const lastItem = chatList.value[0];
  const mockedData = `这是一段模拟的流式字符串数据。`;
  const mockResponse = new MockSSEResponse(mockedData);
  fetchCancel.value = mockResponse;
  
  await fetchSSE(
    () => mockResponse.getResponse(),
    {
      success(result) {
        loading.value = false;
        lastItem.content += result.data;
      },
      complete(isOk, msg) {
        if (!isOk || !lastItem.content) {
          lastItem.role = 'error';
          lastItem.content = msg;
        }
        isStreamLoad.value = false;
        loading.value = false;
      },
    }
  );
};
</script>

<style lang="less">
.title {
  margin-left: 16px;
  font-size: 20px;
  color: var(--td-text-color-primary);
  font-weight: 600;
  line-height: 28px;
}
.drawer-box {
  .t-drawer__header { padding: 32px; }
  .t-drawer__body { padding: 30px 32px; }
  .t-drawer__close-btn {
    right: 32px; top: 32px;
    background-color: var(--td-bg-color-secondarycontainer);
    width: 32px; height: 32px; border-radius: 50%;
    .t-icon { font-size: 20px; }
  }
}
/* 滚动条样式 */
::-webkit-scrollbar-thumb { background-color: var(--td-scrollbar-color); }
::-webkit-scrollbar-thumb:horizontal:hover { background-color: var(--td-scrollbar-hover-color); }
::-webkit-scrollbar-track { background-color: var(--td-scroll-track-color); }
</style>
```