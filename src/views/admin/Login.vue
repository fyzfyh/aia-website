<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminStore } from '../../stores/admin.js'

const router = useRouter()
const route = useRoute()
const adminStore = useAdminStore()

const pin = ref('')
const error = ref('')
const loading = ref(false)

function submit() {
  error.value = ''
  loading.value = true
  // 模拟异步（防止暴力枚举时体验过快）
  setTimeout(() => {
    if (adminStore.login(pin.value)) {
      const redirect = route.query.redirect || '/admin/dashboard'
      router.replace(redirect)
    } else {
      error.value = 'PIN 码错误，请重试'
      pin.value = ''
    }
    loading.value = false
  }, 300)
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center px-4">
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
      <!-- Logo 区域 -->
      <div class="text-center mb-8">
        <div class="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
          AIA
        </div>
        <h1 class="text-xl font-bold text-slate-800">管理后台</h1>
        <p class="text-sm text-slate-400 mt-1">CUHK(SZ) AI Association</p>
      </div>

      <!-- 表单 -->
      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">管理员 PIN 码</label>
          <input
            v-model="pin"
            type="password"
            placeholder="请输入 PIN 码"
            autocomplete="current-password"
            class="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :class="error ? 'border-red-400' : 'border-slate-200'"
            @keyup.enter="submit"
          />
          <p v-if="error" class="mt-1.5 text-xs text-red-500">{{ error }}</p>
        </div>

        <button
          type="submit"
          :disabled="!pin || loading"
          class="w-full py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ loading ? '验证中...' : '进入后台' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <router-link to="/" class="text-xs text-slate-400 hover:text-primary-600 transition-colors">
          ← 返回前台网站
        </router-link>
      </div>
    </div>
  </div>
</template>
