<template>
  <el-dropdown :hide-on-click="false">
    <div class="">
      <slot :loading="loading" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handlePush">
          {{ $t("device.control.file.push") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    device: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    async handlePush() {
      this.loading = true
      let files = null

      try {
        files = await this.$electron.ipcRenderer.invoke('show-open-dialog', {
          properties: ['openFile', 'multiSelections'],
          filters: [
            {
              name: this.$t('device.control.file.push.placeholder'),
              extensions: ['*'],
            },
          ],
        })
      }
      catch (error) {
        if (error.message) {
          this.$message.warning(error.message)
        }
      }

      if (!files) {
        this.loading = false
        return false
      }

      let failCount = 0

      for (let index = 0; index < files.length; index++) {
        const item = files[index]
        await this.$adb.push(this.device.id, item).catch((e) => {
          console.warn(e)
          ++failCount
        })
      }

      this.loading = false

      const totalCount = files.length
      const successCount = totalCount - failCount

      if (successCount) {
        if (totalCount > 1) {
          this.$message.success(
            this.$t('device.control.file.push.success', {
              deviceName: this.device.$name,
              totalCount,
              successCount,
              failCount,
            }),
          )
        }
        else {
          this.$message.success(
            this.$t('device.control.file.push.success.single', {
              deviceName: this.device.$name,
            }),
          )
        }
        return
      }

      this.$message.warning(this.$t('device.control.file.push.error'))
    },
  },
}
</script>

<style></style>
