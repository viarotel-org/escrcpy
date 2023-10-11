<template>
  <el-dialog v-model="visible" title="无线配对" width="600" append-to-body>
    <div class="text-red-500 text-sm pb-8 pl-4">
      注意：可以在 开发者选项 -> 无线调试(可以点进去) -> 使用配对码配对设备 中获取以下信息
    </div>

    <el-form :model="formData" label-width="100px">
      <el-form-item label="配对IP地址" prop="host">
        <el-input v-model="formData.host" placeholder="请输入配对IP地址" class="" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="配对端口号" prop="port">
        <el-input
          v-model.number="formData.port"
          type="number"
          placeholder="请输入配对端口号"
          :min="0"
          clearable
          class=""
        >
        </el-input>
      </el-form-item>
      <el-form-item
        label="配对码"
        prop="pair"
        :rules="[{ required: true, message: '配对码不能为空' }]"
      >
        <el-input
          v-model.number="formData.pair"
          type="number"
          placeholder="请输入配对码"
          :min="0"
          clearable
          class=""
        >
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  emits: ['success'],
  data() {
    return {
      visible: false,
      formData: {
        host: '',
        port: '',
        pair: '',
      },
    }
  },
  methods: {
    show({ params = {} } = {}) {
      this.formData = {
        ...this.$options.data().formData,
        host: params.host,
      }
      this.visible = true
    },
    handleClose() {
      this.visible = false
    },
    async handleSubmit() {
      try {
        const command = `pair ${this.formData.host}:${this.formData.port} ${this.formData.pair}`
        // console.log(command)
        await this.$adb.rawShell(command)
        this.$emit('success')
        this.handleClose()
      }
      catch (error) {
        this.$message.warning(error.message)
      }
    },
  },
}
</script>

<style></style>
