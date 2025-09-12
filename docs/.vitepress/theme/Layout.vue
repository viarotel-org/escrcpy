<script setup>
import DefaultTheme from 'vitepress/theme'

import AsideAdsBefore from './components/AsideAdsBefore/index.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout class="">
    <template #aside-ads-before>
      <AsideAdsBefore />
    </template>
  </Layout>
</template>
