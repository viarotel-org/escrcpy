<template>
  <Message v-bind="messageProps">
    <slot></slot>
  </Message>
</template>

<script>
import Message from './index.vue'

export default {
  components: {
    Message,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
  },
  computed: {
    messageProps() {
      let value = {}
      switch (this.type) {
        case 'server':
          value = {
            name: 'PC',
            content: this.content,
            avatar: 'computer',
          }
          break
        case 'client':
          value = {
            name: this.$attrs.name || '我的手机',
            content: this.content,
            avatar: 'mobile',
            reversed: true,
          }
          break

        default:
          value = this.$attrs
          break
      }

      return value
    },
  },
}
</script>

<style></style>
