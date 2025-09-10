<template>
  <el-dialog v-model="visible" :title="$t('about.donate.title')" fullscreen width="98%" @closed="onClosed">
    <div class="pt-4 pb-8">
      {{ $t('about.donate.description') }}
    </div>

    <div class="flex space-x-4">
      <el-image v-for="(item, index) of imageList" :key="index" :src="item.src" :alt="item.alt" preview-teleported :preview-src-list :initial-index="index" fit="contain" class="!flex-1 !w-0 !border !rounded-md !overflow-hidden" />
    </div>
  </el-dialog>
</template>

<script>
import alipay from '$/assets/sponsor/viarotel-alipay.png'
import wepay from '$/assets/sponsor/viarotel-wepay.png'
import paypal from '$/assets/sponsor/viarotel-paypal.png'

export default {
  data() {
    return {
      visible: false,
      imageList: [
        {
          src: alipay,
          alt: 'Alipay',
        },
        {
          src: wepay,
          alt: 'Wepay',
        },
        {
          src: paypal,
          alt: 'Paypal',
        },
      ],
    }
  },
  computed: {
    previewSrcList() {
      return this.imageList.map(item => item.src)
    },
  },
  methods: {
    open() {
      this.visible = true
    },
    close() {
      this.visible = false
    },
    submit() {},
    onClosed() {},
  },
}
</script>

<style></style>
