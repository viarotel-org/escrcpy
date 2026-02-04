<template>
  <el-config-provider :locale="locale">
    <div class=""></div>
  </el-config-provider>
</template>

<script setup>
const deviceStore = useDeviceStore()

const { currentDevice, queryParams, locale } = useWindowStateSync({
  async onQueryMounted() {
    await deviceStore.getList()
    const findDevice = deviceStore.list.find(item => item.id === queryParams.value.id)
    currentDevice.value = findDevice ?? queryParams.value
  },
})

onMounted(() => {

})
</script>

<style lang="postcss">
</style>
