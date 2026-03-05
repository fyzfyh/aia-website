<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
// 管理后台路由有 meta.isAdmin，隐藏公开导航和页脚（后台有自己的布局）
const isAdmin = computed(() => !!route.meta.isAdmin)
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <NavBar v-if="!isAdmin" />
    <router-view />
    <Footer v-if="!isAdmin" />
  </div>
</template>
