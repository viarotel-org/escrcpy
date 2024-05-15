<template>
  <div :class="reversed ? 'flex-row-reverse' : ''" class="flex items-start">
    <img :src="avatarURL" alt="" class="w-12 h-12 flex-none" />
    <div
      class="flex flex-col"
      :class="reversed ? 'mr-4 pl-16 items-end' : 'ml-4 pr-16'"
    >
      <div v-if="!reversed" class="mt-1 text-base">
        {{ name }}
      </div>
      <div
        class="mt-2 shadow-el-light px-4 py-2 rounded-lg break-all overflow-hidden relative"
      >
        <slot>
          <span class="pr-1">
            {{ content }}
          </span>
          <el-icon v-if="loading" class="is-loading relative top-[2px]">
            <Loading />
          </el-icon>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import logoURL from '$electron/resources/build/logo.png'
import userURL from '$/assets/user.png'
import mobileURL from '$/assets/mobile.png'
import computerURL from '$/assets/computer.png'

export default {
  props: {
    reversed: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: 'logo',
    },
    name: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    avatarURL() {
      let value = ''

      switch (this.avatar) {
        case 'logo':
          value = logoURL
          break
        case 'user':
          value = userURL
          break
        case 'mobile':
          value = mobileURL
          break
        case 'computer':
          value = computerURL
          break
      }

      return value
    },
  },
}
</script>

<style></style>
