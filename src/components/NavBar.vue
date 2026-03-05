<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const menuOpen = ref(false)

const navLinks = [
  { name: '首页', to: '/' },
  { name: '社团活动', to: '/activities' },
  { name: '组织架构', to: '/team' },
  { name: '项目招募', to: '/projects' },
  { name: '关于我们', to: '/about' },
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
    <nav class="page-container flex items-center justify-between h-16">
      <!-- Logo 区域 -->
      <router-link to="/" class="flex items-center gap-3 shrink-0" @click="menuOpen = false">
        <!--
          TODO: 替换 Logo
          将下方占位符替换为实际 Logo 图片：
          <img src="/logo.png" alt="AIA Logo" class="h-9 w-auto" />
          Logo 图片放置于 public/logo.png
        -->
        <div class="h-9 w-9 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          AIA
        </div>
        <div class="hidden sm:block">
          <p class="text-sm font-semibold text-slate-800 leading-tight">香港中文大学（深圳）</p>
          <p class="text-xs text-primary-600 font-medium leading-tight">人工智能协会</p>
        </div>
      </router-link>

      <!-- 桌面端导航 -->
      <ul class="hidden md:flex items-center gap-1">
        <li v-for="link in navLinks" :key="link.to">
          <router-link
            :to="link.to"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
            :class="isActive(link.to)
              ? 'text-primary-600 bg-primary-50'
              : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'"
          >
            {{ link.name }}
          </router-link>
        </li>
      </ul>

      <!-- 移动端汉堡菜单按钮 -->
      <button
        class="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        @click="menuOpen = !menuOpen"
        aria-label="切换菜单"
      >
        <svg v-if="!menuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </nav>

    <!-- 移动端下拉菜单 -->
    <div v-if="menuOpen" class="md:hidden border-t border-slate-100 bg-white">
      <ul class="page-container py-2 flex flex-col gap-1">
        <li v-for="link in navLinks" :key="link.to">
          <router-link
            :to="link.to"
            class="block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
            :class="isActive(link.to)
              ? 'text-primary-600 bg-primary-50'
              : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'"
            @click="menuOpen = false"
          >
            {{ link.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </header>
</template>
