import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 管理员 PIN 码认证
// PIN 通过环境变量 VITE_ADMIN_PIN 配置（见 .env.example）
// 未配置时使用默认值 'aia@2025'
// 注意：PIN 会被编译进前端 JS，属于轻量级访问控制，
// 目的是防止普通访客误操作，不用于保护敏感数据。
const CORRECT_PIN = import.meta.env.VITE_ADMIN_PIN || 'aia@2025'
const SESSION_KEY = 'aia_admin_auth'

export const useAdminStore = defineStore('admin', () => {
  // 从 sessionStorage 恢复认证状态（关闭浏览器后自动失效）
  const isAuthenticated = ref(sessionStorage.getItem(SESSION_KEY) === '1')

  const isAuth = computed(() => isAuthenticated.value)

  function login(pin) {
    if (pin === CORRECT_PIN) {
      isAuthenticated.value = true
      sessionStorage.setItem(SESSION_KEY, '1')
      return true
    }
    return false
  }

  function logout() {
    isAuthenticated.value = false
    sessionStorage.removeItem(SESSION_KEY)
  }

  return { isAuth, login, logout }
})
