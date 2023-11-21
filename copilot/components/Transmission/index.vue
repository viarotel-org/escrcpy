<template>
  <div class="h-full flex flex-col">
    <div
      ref="chats"
      class="flex-1 h-0 space-y-4 pb-4 px-4 overflow-auto scroll-smooth"
    >
      <Message
        v-for="(item, index) of messageList"
        v-bind="{
          type: item.type,
          content: item.content,
        }"
        :key="index"
        :loading="item.$loading"
      >
      </Message>
    </div>
    <div class="flex-none px-4 py-2 bg-white">
      <el-input
        v-model="inputValue"
        placeholder="请输入想要发送的消息"
        @keyup.enter="handleSubmit"
      >
        <template #append>
          <el-button
            icon="Promotion"
            :loading="loading"
            @click="handleSubmit"
          />
        </template>
      </el-input>
    </div>
  </div>
</template>

<script>
import Message from './Message/Preset.vue'

export default {
  components: {
    Message,
  },
  data() {
    return {
      messageList: [],
      inputValue: '',
      loading: false,
    }
  },
  async created() {
    await this.getMessageData()
    await this.$nextTick()
    this.handleScroll()
  },
  methods: {
    handleScroll() {
      const chatsEl = this.$refs.chats
      chatsEl.scrollTop = chatsEl.scrollHeight
    },
    async handleSubmit() {
      if (!this.inputValue) {
        return false
      }

      this.loading = true

      const newMessage = {
        type: 'client',
        content: this.inputValue,
        $loading: true,
      }

      this.messageList.push(newMessage)

      const params = {}
      const res = await this.$mockAPI(params)

      this.loading = false

      if (res.success) {
        this.inputValue = ''
        newMessage.$loading = false
        await this.$nextTick()
        this.handleScroll()
      }
    },
    async getMessageData() {
      const params = {
        imitate: [
          {
            type: 'server',
            content: '你好啊',
          },
          {
            type: 'client',
            content: '你也好啊',
          },
          {
            type: 'server',
            content: '你好啊',
          },
          {
            type: 'client',
            content: '你也好啊',
          },
          {
            type: 'server',
            content: '你好啊',
          },
          {
            type: 'client',
            content: '你也好啊',
          },
          {
            type: 'server',
            content: '你好啊',
          },
          {
            type: 'client',
            content: '你也好啊',
          },
          {
            type: 'server',
            content: '你好啊',
          },
          {
            type: 'client',
            content: '你也好啊',
          },
          {
            type: 'server',
            content: '你好啊',
          },
          {
            type: 'client',
            content: '你也好啊',
          },
          {
            type: 'server',
            content: '你好啊',
          },
          {
            type: 'client',
            content: '你也好啊',
          },
          {
            type: 'server',
            content: '你好啊',
          },
          {
            type: 'client',
            content: '你也好啊',
          },
          {
            type: 'server',
            content: '你好啊',
          },
          {
            type: 'client',
            content: '你也好啊',
          },
        ],
      }
      const res = await this.$mockAPI(params)

      if (res.success) {
        this.messageList = res.data.map(item => ({
          ...item,
          $loading: false,
        }))
      }
    },
  },
}
</script>

<style></style>
