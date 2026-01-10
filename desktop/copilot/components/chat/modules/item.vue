<template>
  <t-chat-item v-bind="{ ...item, name: $t(item.name), variant: 'base' }" class="t-chat-item--copilot">
    <!-- Custom message content -->
    <template #content>
      <div class="mt-2 space-y-2">
        <template v-if="[MessageRoleEnum.ASSISTANT].includes(item.role)">
          <div v-if="[MessageStatusEnum.PENDING].includes(item.status)" class="t-chat__text">
            <TaskStatus :status="MessageStatusEnum.PENDING" class="" />
          </div>

          <t-chat-reasoning
            v-else-if="item.content"
            v-model:collapsed="item.reasoningCollapsed"
            expand-icon-placement="right"
            class=""
          >
            <template #header>
              <TaskStatus :status="item.status" class="" />
            </template>

            <t-chat-content :content="item.content" class="prose" />
          </t-chat-reasoning>
        </template>

        <!-- Message content -->
        <t-chat-content
          v-else
          :content="item.content"
          :role="item.role"
          :class="{
            prose: [MessageRoleEnum.SYSTEM].includes(item.role),
          }"
        />
      </div>
    </template>

    <!-- Action buttons -->
    <template #actions>
      <el-button-group class="mt-4">
        <el-button icon="CopyDocument" :title="$t('common.copy')" @click="onCopyClick(item)">
        </el-button>

        <el-button icon="RefreshLeft" :title="$t('common.retry')" @click="onRetryClick(item)">
        </el-button>

        <el-popconfirm
          v-if="!item.isTemporary"
          :title="$t('copilot.chat.deleteMessageConfirm')"
          :confirm-button-text="$t('common.confirm')"
          :cancel-button-text="$t('common.cancel')"
          @confirm="handleDeleteMessage(item.id)"
        >
          <template #reference>
            <el-button icon="Delete" :title="$t('common.delete')">
            </el-button>
          </template>
        </el-popconfirm>
      </el-button-group>
    </template>
  </t-chat-item>
</template>

<script setup>
import { t } from '$/locales/index.js'
import TaskStatus from './status.vue'
import { MessageRoleEnum, MessageStatusEnum } from '$copilot/dicts/index.js'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  currentDevice: {
    type: Object,
    default: null,
  },
  deleteMessage: {
    type: Function,
    required: true,
  },
})

// Delete single message
async function handleDeleteMessage(messageId) {
  const result = await deleteMessage(messageId)
  if (result.success) {
    ElMessage.success(t('copilot.chat.deleteSuccess'))
  }
  else {
    ElMessage.error(t('copilot.chat.deleteFailed'))
  }
}

async function onCopyClick(item) {
  await window.electron.ipcRenderer.invoke('copy-text-to-clipboard', item.content)
  ElMessage.success(t('copilot.chat.copySuccess'))
}

function onRetryClick(item) {
  const itemIndex = messages.value.findIndex(msg => msg.id === item.id)
  if (itemIndex >= 0) {
    // Search backward in the original messages for the most recent user message (messages are in ascending order)
    for (let i = itemIndex - 1; i >= 0; i--) {
      if (messages.value[i].role === 'user') {
        handleSubmit(messages.value[i].content)
        break
      }
    }
  }
}
</script>

<style lang="postcss">
.t-chat-item--copilot {
  .t-chat__text,
  .t-chat__text__content,
  .t-chat__text--user * {
    @apply !text-[14px];
  }

  .t-chat__actions-margin {
    @apply !ml-0;
  }

  .t-chat__base {
    @apply !pl-0;
  }

  &.t-chat__text--variant--base .t-chat__text,
  .t-chat__detail-reasoning .t-collapse-panel__wrapper,
  .t-chat__detail-reasoning .t-collapse-panel__content {
    @apply !bg-gray-200 !dark:bg-gray-800;
  }

  .t-chat__text__content {
    @apply overflow-hidden;

    > p {
      @apply !my-0;
    }
  }

  .t-chat__detail-reasoning {
    .t-chat__text__content {
      &.t-chat__text--assistant {
        @apply !text-[--td-text-color-primary];
      }
    }

    .t-collapse-panel {
      @apply !ml-0;
    }
  }
}
</style>
