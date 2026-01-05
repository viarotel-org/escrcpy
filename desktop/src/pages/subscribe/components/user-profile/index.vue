<template>
  <div class="flex items-center">
    <template v-if="subscribeStore.isLoggedIn">
      <el-dropdown trigger="click" @command="onCommandClick">
        <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 transition-colors">
          <el-avatar :size="$grid.lg ? 32 : 24" class="!bg-primary-500">
            <el-icon><ElIconUser /></el-icon>
          </el-avatar>

          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ subscribeStore.displayUserName }}
          </span>
          <el-icon class="text-gray-400">
            <ElIconArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">
              <el-icon><SwitchButton /></el-icon>
              {{ $t('subscribe.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <template v-else>
      <el-button type="primary" text @click="onLoginClick">
        <el-icon class="mr-1">
          <ElIconUser />
        </el-icon>
        {{ $t('subscribe.login') }}
      </el-button>
    </template>
  </div>
</template>

<script setup>
const emit = defineEmits(['login', 'logout'])

const subscribeStore = useSubscribeStore()

function onCommandClick() {
  emit('logout')
}

function onLoginClick() {
  emit('login')
}
</script>

<style>

</style>
