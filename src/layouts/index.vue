<template>
  <component :is="activeLayout" class=""></component>
</template>

<script setup>
import DefaultLayout from './default/index.vue'

const LayoutMap = {
  default: DefaultLayout,
}

const route = useRoute()

const activeLayout = computed(() => LayoutMap[route.meta.layout || 'default'])
</script>
