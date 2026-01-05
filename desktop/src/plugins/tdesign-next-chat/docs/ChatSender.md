# TDesign ChatSender 组件文档（AI阅读版）
## 一、组件概述
ChatSender 是专为 AI 聊天场景设计的输入框组件，核心能力为消息输入、发送/终止操作控制，同时支持通过插槽扩展模型切换、多模态上传（图片/附件）、深度思考等个性化能力；可透传 Textarea 组件的全部属性，适配 AI 聊天场景下多样化的输入交互需求（如加载状态控制、自定义操作按钮、输入框扩展区配置）。

## 二、核心配置（Props）
| 名称 | 类型 | 默认值 | 描述 | 必传 |
|------|------|--------|------|------|
| disabled | Boolean | false | 是否禁用整个输入框（输入+操作按钮均不可用） | N |
| placeholder | String | - | 输入框默认提示文案（如“请输入消息...”） | N |
| prefix | String / Slot / Function | - | 输入框左下角区域扩展（如模型选择、功能按钮），TS 类型：string \| TNode（通用类型定义） | N |
| stopDisabled | Boolean | false | 发送按钮加载状态（待废弃，推荐使用 `loading` 替代） | N |
| loading | Boolean | false | 发送按钮是否处于加载状态（控制“发送/终止”按钮切换） | N |
| suffix | String / Slot / Function | - | 输入框右下角区域扩展（如自定义发送按钮、上传按钮），TS 类型：string \| TNode；函数形式参数为 `{ renderPresets: UploadActionConfig[] }`（UploadActionConfig 为上传按钮配置类型） | N |
| header | String / Slot / Function | - | 输入框外部标题区域扩展 | N |
| inner-header | String / Slot / Function | - | 输入框内部标题区域扩展 | N |
| textareaProps | Object | - | 透传给 Textarea 组件的全部属性（如行数、最大长度），TS 类型：`TextareaProps`（参考 Textarea 组件 API） | N |
| value | String | - | 输入框值（受控属性，支持 `v-model` / `v-model:value` 语法糖） | N |
| defaultValue | String | - | 输入框初始值（非受控属性，仅初始化生效） | N |
| onBlur | Function | - | 输入框失焦触发回调，TS 类型：`(value: string, context: { e: FocusEvent }) => void` | N |
| onChange | Function | - | 输入框值变化触发回调，TS 类型：`(value: string, context: { e: InputEvent | MouseEvent | KeyboardEvent }) => void` | N |
| onFocus | Function | - | 输入框聚焦触发回调，TS 类型：`(value: string, context: { e: FocusEvent }) => void` | N |
| onSend | Function | - | 点击发送按钮/回车发送触发回调，TS 类型：`(value: string, context: { e: MouseEvent | KeyboardEvent }) => void` | N |
| onStop | Function | - | 点击终止按钮触发回调（加载状态下显示），TS 类型：`(value: string, context: { e: MouseEvent }) => void` | N |
| onFileSelect | Function | - | 文件选择（图片/附件上传）触发回调，TS 类型：`({ files: FileList, name: UploadActionType }) => void`（UploadActionType 为上传类型：uploadImage/uploadAttachment） | N |

## 三、事件（Events）
| 名称 | 参数 | 描述 |
|------|------|------|
| blur | (value: string, context: { e: FocusEvent }) | 输入框失焦时触发<br>value：当前输入框值；context：失焦事件上下文 | N |
| change | (value: string, context: { e: InputEvent \| MouseEvent \| KeyboardEvent }) | 输入框值变化时触发<br>value：当前输入框值；context：事件上下文 | N |
| focus | (value: string, context: { e: FocusEvent }) | 输入框聚焦时触发<br>value：当前输入框值；context：聚焦事件上下文 | N |
| send | (value: string, context: { e: MouseEvent \| KeyboardEvent }) | 发送消息时触发（点击发送按钮/回车）<br>value：输入框内容；context：触发事件上下文 | N |
| stop | (value: string, context: { e: MouseEvent }) | 终止消息发送时触发（加载状态下点击终止按钮）<br>value：输入框内容；context：点击事件上下文 | N |
| fileSelect | ({ files: FileList, name: UploadActionType }) | 选择上传文件时触发<br>files：选中的文件列表；name：上传类型（uploadImage/uploadAttachment） | N |

## 四、使用指南
### 1. 基础输入框
核心实现“输入-发送-加载-终止”的基础交互，支持图片/附件上传（通过 `suffix` 插槽的 `renderPresets` 配置），通过 `loading` 控制发送/终止按钮切换，适配 AI 聊天的基础输入需求。

### 2. 输入框自定义扩展
- **prefix 插槽**：扩展输入框左下角区域，如模型选择下拉框、“深度思考”功能按钮等；
- **suffix 插槽**：扩展输入框右下角区域，如自定义发送按钮、自定义上传按钮组合等；
- **textareaProps**：透传 Textarea 属性，配置占位符、输入框高度、最大输入长度等基础样式。

### 3. 多模态能力扩展
通过 `suffix` 插槽的 `renderPresets` 可快速配置图片/附件上传按钮，结合 `onFileSelect` 回调处理文件上传逻辑，适配多模态 AI 聊天场景。

## 五、完整示例
### 示例1：基础输入框（含上传/加载/终止）
```vue
<template>
  <t-chat-sender
    v-model="query"
    :textarea-props="{ placeholder: '请输入消息...' }"
    :loading="loading"
    @send="inputEnter"
    @file-select="fileSelect"
    @stop="onStop"
  >
    <!-- 自定义上传按钮组合（可自由配置） -->
    <template #suffix="{ renderPresets }">
      <!-- 不显示附件，仅保留基础发送逻辑 -->
      <component :is="renderPresets([])" />
      <!-- 仅显示图片上传：renderPresets([{ name: 'uploadImage' }]) -->
      <!-- 仅显示附件上传：renderPresets([{ name: 'uploadAttachment' }]) -->
      <!-- 自定义顺序：renderPresets([{ name: 'uploadAttachment' }, { name: 'uploadImage' }]) -->
    </template>
  </t-chat-sender>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 输入框值
const query = ref('');
// 加载状态
const loading = ref(false);

// 发送消息逻辑
const inputEnter = () => {
  if (loading.value || !query.value) return;
  query.value = '';
  loading.value = true;
  // 模拟AI响应耗时
  setTimeout(() => loading.value = false, 5000);
};

// 文件选择回调（图片/附件）
const fileSelect = ({ files, name }) => {
  console.log('上传文件类型：', name, '文件列表：', files);
};

// 终止发送逻辑
const onStop = () => {
  loading.value = false;
};
</script>
```

### 示例2：自定义输入框（模型选择+深度思考）
```vue
<template>
  <t-chat-sender
    v-model="inputValue"
    class="chat-sender"
    :textarea-props="{ placeholder: '请输入消息...' }"
    :loading="loading"
    @send="inputEnter"
  >
    <!-- 右下角：自定义发送按钮 -->
    <template #suffix>
      <t-button theme="default" variant="text" size="large" @click="inputEnter">
        发送
      </t-button>
    </template>

    <!-- 左下角：模型选择+深度思考按钮 -->
    <template #prefix>
      <div class="model-select">
        <!-- 模型选择下拉框 -->
        <t-tooltip v-model:visible="allowToolTip" content="切换模型" trigger="hover">
          <t-select
            v-model="selectValue"
            :options="selectOptions"
            value-type="object"
            @focus="allowToolTip = false"
          />
        </t-tooltip>

        <!-- 深度思考按钮 -->
        <t-button
          class="check-box"
          :class="{ 'is-active': isChecked }"
          variant="text"
          @click="checkClick"
        >
          <SystemSumIcon />
          <span>深度思考</span>
        </t-button>
      </div>
    </template>
  </t-chat-sender>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SystemSumIcon } from 'tdesign-icons-vue-next';

// 加载状态
const loading = ref(false);
// 输入框值
const inputValue = ref('');
// 下拉框tooltip显隐
const allowToolTip = ref(false);
// 模型选择配置
const selectOptions = [
  { label: '默认模型', value: 'default' },
  { label: 'Deepseek', value: 'deepseek-r1' },
  { label: '混元', value: 'hunyuan' },
];
const selectValue = ref({ label: '默认模型', value: 'default' });
// 深度思考按钮状态
const isChecked = ref(false);

// 深度思考按钮点击
const checkClick = () => {
  isChecked.value = !isChecked.value;
};

// 发送消息逻辑
const inputEnter = () => {
  if (loading.value || !inputValue.value) return;
  inputValue.value = '';
  loading.value = true;
  setTimeout(() => loading.value = false, 5000);
};
</script>

<style lang="less" scoped>
.chat-sender {
  .btn {
    color: var(--td-text-color-disabled);
    border: none;
    &:hover {
      color: var(--td-brand-color-hover);
      border: none;
      background: none;
    }
  }

  .model-select {
    display: flex;
    align-items: center;
    .t-select {
      width: 112px;
      height: var(--td-comp-size-m);
      margin-right: var(--td-comp-margin-s);
      .t-input {
        border-radius: 32px;
        padding: 0 15px;
        &.t-is-focused { box-shadow: none; }
      }
    }

    .check-box {
      width: 112px;
      height: var(--td-comp-size-m);
      border-radius: 32px;
      border: 0;
      background: var(--td-bg-color-component);
      color: var(--td-text-color-primary);
      .t-button__text {
        display: flex;
        align-items: center;
        justify-content: center;
        span { margin-left: var(--td-comp-margin-xs); }
      }
      &.is-active {
        border: 1px solid var(--td-brand-color-focus);
        background: var(--td-brand-color-light);
        color: var(--td-text-color-brand);
      }
    }
  }
}
</style>
```