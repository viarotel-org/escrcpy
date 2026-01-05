<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- 筛选栏 -->
    <div class="flex items-center gap-4 justify-center flex-none py-4">
      <el-radio-group v-model="statusFilter" @change="fetchOrders(1)">
        <el-radio-button value="">
          {{ $t('subscribe.allOrders') }}
        </el-radio-button>
        <el-radio-button value="PAID">
          {{ $t('subscribe.paidOrders') }}
        </el-radio-button>
        <el-radio-button value="PENDING">
          {{ $t('subscribe.pendingOrders') }}
        </el-radio-button>
        <el-radio-button value="CANCEL">
          {{ $t('subscribe.cancelledOrders') }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <div class="flex-1 min-h-0 overflow-hidden">
      <el-table
        v-loading="loading"
        height="100%"
        :data="orders"
        stripe
        :empty-text="$t('subscribe.noOrders')"
        class=""
      >
        <el-table-column prop="ident" :label="$t('subscribe.orderNo')" show-overflow-tooltip min-width="200" />

        <el-table-column :label="$t('common.status')" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column :label="$t('subscribe.orders.amount')" align="right" width="100">
          <template #default="{ row }">
            <div class="flex items-center justify-end gap-2">
              <div v-if="row.amount !== row.price" class="text-xs line-through">
                ¥{{ row.amount?.toFixed(2) || '0.00' }}
              </div>

              <div class="font-semibold text-primary-500">
                ¥{{ row.price?.toFixed(2) || '0.00' }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="$t('subscribe.paymentMethod')" align="center" width="150">
          <template #default="{ row }">
            <span>{{ row.type === 'wepay' ? $t('subscribe.wepay') : $t('subscribe.alipay') }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('common.createTime')" width="150">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="flex-none flex justify-center py-2">
      <el-pagination
        v-model:current-page="currentPage"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="sizes, prev, pager, next, total"
        @current-change="fetchOrders"
        @size-change="onSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { t } from '$/locales/index.js'
import subscribeClient from '$/services/subscribe/index.js'

const subscribeStore = useSubscribeStore()

// 状态
const loading = ref(false)
const orders = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const statusFilter = ref('')

// 方法
function getStatusType(status) {
  const typeMap = {
    PAID: 'success',
    PENDING: 'warning',
    CANCEL: 'info',
  }
  return typeMap[status] || 'info'
}

function getStatusText(status) {
  const textMap = {
    PAID: t('subscribe.paidOrders'),
    PENDING: t('subscribe.pendingOrders'),
    CANCEL: t('subscribe.cancelledOrders'),
  }
  return textMap[status] || status
}

function formatDate(timestamp) {
  if (!timestamp)
    return '-'
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function onSizeChange(size) {
  pageSize.value = size
  fetchOrders(1)
}

async function fetchOrders(page = 1) {
  loading.value = true
  currentPage.value = page

  try {
    const params = {
      page,
      size: pageSize.value,
    }
    if (statusFilter.value) {
      params.status = statusFilter.value
    }

    const result = await subscribeClient.getPayList(params, subscribeStore.accessToken)

    if (result) {
      orders.value = result.items || []
      total.value = result.total || 0
    }
  }
  catch (error) {
    console.error('Fetch orders failed:', error)
    ElMessage.error(t('subscribe.fetchOrdersFailed'))
  }
  finally {
    loading.value = false
  }
}

// 初始化
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-card {
  transition: all 0.2s;
}

.order-card:hover {
  border-color: var(--el-color-primary-light-5);
}
</style>
