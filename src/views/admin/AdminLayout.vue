<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '../../stores/admin.js'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

const sidebarOpen = ref(false)

const navItems = [
  { name: '概览',     to: '/admin/dashboard',  icon: 'grid' },
  { name: '活动管理', to: '/admin/activities', icon: 'calendar' },
  { name: '团队管理', to: '/admin/team',       icon: 'users' },
  { name: '项目管理', to: '/admin/projects',   icon: 'briefcase' },
]

const currentTitle = computed(() => {
  return navItems.find(n => route.path.startsWith(n.to))?.name || '管理后台'
})

function logout() {
  adminStore.logout()
  router.replace('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex flex-col">
    <!-- 顶部导航栏 -->
    <header class="bg-primary-700 text-white h-14 flex items-center px-4 gap-3 shrink-0">
      <!-- 移动端汉堡菜单 -->
      <button class="md:hidden p-1" @click="sidebarOpen = !sidebarOpen">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <!-- Logo + 标题 -->
      <div class="flex items-center gap-2 font-semibold text-sm">
        <div class="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold">AIA</div>
        <span class="hidden sm:block">AI 协会管理后台</span>
        <span class="text-white/60 hidden sm:block">·</span>
        <span class="text-primary-200 text-xs hidden sm:block">{{ currentTitle }}</span>
      </div>

      <div class="ml-auto flex items-center gap-3">
        <!-- 返回前台 -->
        <router-link
          to="/"
          target="_blank"
          class="hidden sm:flex items-center gap-1.5 text-xs text-primary-200 hover:text-white transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
          查看前台
        </router-link>

        <!-- 退出登录 -->
        <button
          @click="logout"
          class="flex items-center gap-1.5 text-xs text-primary-200 hover:text-white transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          退出
        </button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- 侧边栏 -->
      <aside
        class="w-48 bg-white border-r border-slate-200 shrink-0 flex-col pt-4"
        :class="sidebarOpen ? 'flex' : 'hidden md:flex'"
      >
        <nav class="space-y-0.5 px-2">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            :class="route.path.startsWith(item.to)
              ? 'bg-primary-50 text-primary-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'"
            @click="sidebarOpen = false"
          >
            <!-- 图标 -->
            <svg v-if="item.icon === 'grid'" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
            <svg v-if="item.icon === 'calendar'" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <svg v-if="item.icon === 'users'" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <svg v-if="item.icon === 'briefcase'" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            {{ item.name }}
          </router-link>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 overflow-auto p-5 sm:p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>
