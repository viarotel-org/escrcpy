<template>
  <el-dialog
    v-model="visible"
    :title="$t('device.wireless.pair')"
    width="80%"
    append-to-body
    destroy-on-close
  >
    <div class="pt-4 pr-12">
      <el-form ref="elForm" :model="formData" label-width="120px" class="">
        <el-form-item
          :label="$t('device.wireless.pair.address')"
          prop="host"
          :rules="[
            {
              required: true,
              message: $t('device.wireless.pair.address.message'),
            },
          ]"
        >
          <el-input
            v-model="formData.host"
            :placeholder="$t('common.input.placeholder')"
            class=""
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          :label="$t('device.wireless.pair.port')"
          prop="port"
          :rules="[
            {
              required: true,
              message: $t('device.wireless.pair.port.message'),
            },
          ]"
        >
          <el-input
            v-model.number="formData.port"
            type="number"
            :placeholder="$t('common.input.placeholder')"
            :min="0"
            clearable
            class=""
          >
          </el-input>
        </el-form-item>
        <el-form-item
          :label="$t('device.wireless.pair.code')"
          prop="pair"
          :rules="[
            {
              required: true,
              message: $t('device.wireless.pair.code.message'),
            },
          ]"
        >
          <el-input
            v-model="formData.pair"
            :placeholder="$t('common.input.placeholder')"
            clearable
            class=""
          >
          </el-input>
        </el-form-item>

        <el-form-item label="">
          <div
            class="text-red-200 dark:text-red-900 !hover:text-red-500 transition-colors"
          >
            {{ $t('device.wireless.pair.tips') }}
          </div>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="handleClose">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        {{ $t('common.confirm') }}
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
        ...params,
      }
      this.visible = true
    },
    handleClose() {
      this.visible = false
    },
    async handleSubmit() {
      try {
        await this.$refs.elForm.validate()
        await this.$adb.pair(this.formData.host, this.formData.port, this.formData.pair)
        this.$emit('success')
        this.handleClose()
      }
      catch (error) {
        if (error.message) {
          this.$message.warning(error.message)
        }
      }
    },
  },
}
</script>

<style></style>
