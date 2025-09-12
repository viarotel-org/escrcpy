<script setup>
import DefaultTheme from 'vitepress/theme'

import AsideAdsBefore from './components/AsideAdsBefore/index.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout class="">
    <template #aside-ads-before>
      <ClientOnly>
        <AsideAdsBefore />
      </ClientOnly>
    </template>
  </Layout>
</template>
