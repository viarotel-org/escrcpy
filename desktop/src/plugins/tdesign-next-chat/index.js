import {
  Chat,
  ChatContent,
  ChatItem,
  ChatLoading,
  ChatReasoning,
  ChatSender,
} from '@tdesign-vue-next/chat'

import './styles/theme.css'

export default {
  install(app) {
    app.component('TChat', Chat)
    app.component('TChatItem', ChatItem)
    app.component('TChatContent', ChatContent)
    app.component('TChatReasoning', ChatReasoning)
    app.component('TChatSender', ChatSender)
    app.component('TChatLoading', ChatLoading)
  },
}
