<template>
  <el-dialog
    v-model="visible"
    :title="$t('device.control.file.name')"
    width="97%"
    append-to-body
    class="el-dialog--beautify"
    @closed="onClosed"
  >
    <div
      class="flex items-center mb-4 bg-gray-100 dark:bg-gray-800 rounded-full p-1"
    >
      <el-button
        text
        icon="Top"
        circle
        class="mr-2"
        @click="handlePrev"
      ></el-button>

      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item>
          <el-button
            text
            icon="Iphone"
            class="!px-2"
            @click="handleBreadcrumb(breadcrumbModel[0])"
          ></el-button>
        </el-breadcrumb-item>

        <el-breadcrumb-item
          v-for="item of breadcrumbModel"
          :key="item.value"
          @click="handleBreadcrumb(item)"
        >
          <el-button text class="!px-2">
            {{ item.label || item.value }}
          </el-button>
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div class="ml-auto">
        <el-button text icon="Refresh" circle></el-button>
      </div>
    </div>

    <div class="mb-4 -ml-px">
      <el-button type="default" icon="FolderAdd">
        新建文件夹
      </el-button>
      <el-button type="default" icon="DocumentAdd">
        上传文件
      </el-button>
      <el-button type="default" icon="Download">
        下载文件
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      @selection-change="onSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        align="left"
      ></el-table-column>

      <el-table-column prop="name" label="名称" sortable>
        <template #default="{ row }">
          <div class="flex items-center">
            <el-button
              v-if="row.type === 'directory'"
              text
              icon="Folder"
              class="!p-0 !bg-transparent"
              @click="handleDirectory(row)"
            >
              {{ row.name }}
            </el-button>
            <el-button
              v-else
              text
              icon="Document"
              class="!p-0 !bg-transparent"
              @click="handleFile(row)"
            >
              {{ row.name }}
            </el-button>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="size"
        label="大小"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="updateTime"
        label="修改时间"
        align="center"
      ></el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <div class="">
            <EleTooltipButton
              v-if="['file'].includes(row.type)"
              effect="light"
              placement="top"
              :offset="2"
              :content="$t('common.download')"
              text
              type="primary"
              icon="Download"
              circle
              @click="handleFile(row)"
            >
            </EleTooltipButton>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <template #footer></template>
  </el-dialog>
</template>

<script setup>
const visible = ref(false)

const device = ref()

const loading = ref(false)

const tableData = ref([])

const currentPath = ref('sdcard')

const breadcrumbModel = computed(() => {
  const pathList = currentPath.value.split('/')

  const value = pathList.map(item => ({
    label: item === 'sdcard' ? '内部存储空间' : void 0,
    value: item,
  }))

  return value
})

function open(args) {
  visible.value = true
  device.value = args
  getTableData()
}

function onClosed() {}

async function getTableData() {
  loading.value = true

  const data = await window.adbkit.getFiles(device.value.id, currentPath.value)

  loading.value = false

  tableData.value = data
}

const selectionRows = ref([])

function onSelectionChange(selection) {
  selectionRows.value = selection
}

function handleFile(row) {}

function handleDirectory(row) {
  currentPath.value += `/${row.name}`
  getTableData()
}

function handleBreadcrumb(data) {
  const index = currentPath.value.indexOf(data.value)

  currentPath.value = currentPath.value.slice(0, index + data.value.length)

  getTableData()
}

function handlePrev() {
  if (breadcrumbModel.value.length <= 1) {
    return false
  }

  const value = breadcrumbModel.value
    .slice(0, -1)
    .map(item => item.value)
    .join('/')

  currentPath.value = value

  getTableData()
}

defineExpose({
  open,
})
</script>

<style></style>
