# TDesign ChatAction 组件文档（AI阅读版）
## 一、组件概述
ChatAction 是 Chat 组件的配套操作按钮组件，内置重新生成、点赞、点踩、复制四类操作按钮；集成 Clipboard 能力可直接复制指定聊天内容，提供标准化的按钮交互样式，点击操作触发的具体业务逻辑需由业务层监听 `operation` 事件自行实现。

## 二、核心配置（Props）
| 名称 | 类型 | 默认值 | 描述 | 必传 |
|------|------|--------|------|------|
| content | String | - | 被复制的聊天内容（仅作用于「复制」按钮） | N |
| disabled | Boolean | false | 所有操作按钮是否禁用（不可点击） | N |
| isBad | Boolean | false | 是否处于「点踩」选中状态 | N |
| isGood | Boolean | false | 是否处于「点赞」选中状态 | N |
| operationBtn | Array | ["replay", "copy", "good", "bad"] | 操作按钮配置项，支持自定义按钮展示选项和顺序。<br>TS 类型：Array<'replay' \| 'copy' \| 'good' \| 'bad'> | N |
| onOperation | Function | - | 点击操作按钮触发的回调。<br>TS 类型：(value: string, context: { e: MouseEvent }) => void<br>（value 为按钮类型：'replay'/'copy'/'good'/'bad'） | N |

## 三、事件（Events）
| 名称 | 参数 | 描述 |
|------|------|------|
| operation | (value: string, context: { e: MouseEvent }) | 点击点赞、点踩、复制、重新生成按钮时触发<br>value：按钮类型（'replay'/'copy'/'good'/'bad'）<br>context：事件上下文（包含原生鼠标事件） |

## 四、使用指南
可通过 `operationBtn` 数组配置操作按钮的展示项和展示顺序，例如 `['good', 'bad', 'replay', 'copy']` 会按「点赞→点踩→重新生成→复制」的顺序渲染按钮；通过 `isGood`/`isBad` 控制点赞/点踩的选中状态，`content` 指定复制按钮对应的文本内容，最终通过监听 `operation` 事件实现按钮的业务逻辑。

## 五、完整示例
```vue
<template>
  <div class="chat-action-content">
    <t-chat-action
      :is-good="isGood"
      :is-bad="isBad"
      content="它叫 McMurdo Station ATM，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。"
      :operation-btn="['good', 'bad', 'replay', 'copy']"
      @operation="handleOperation"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 点赞/点踩状态
const isGood = ref(false);
const isBad = ref(false);

// 操作按钮回调处理
const handleOperation = (type, options) => {
  console.log('操作类型：', type, '事件上下文：', options);
  // 点赞逻辑：切换选中状态，取消点踩
  if (type === 'good') {
    isGood.value = !isGood.value;
    isBad.value = false;
  }
  // 点踩逻辑：切换选中状态，取消点赞
  else if (type === 'bad') {
    isBad.value = !isBad.value;
    isGood.value = false;
  }
  // 重新生成/复制逻辑可在此扩展
  else if (type === 'replay') {
    console.log('触发重新生成逻辑');
  } else if (type === 'copy') {
    console.log('触发复制逻辑（组件内置Clipboard已处理内容复制）');
  }
};
</script>
```