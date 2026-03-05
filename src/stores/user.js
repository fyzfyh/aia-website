import { defineStore } from 'pinia'
import { ref } from 'vue'

// TODO: 后续版本实现用户登录功能时，在此 store 中添加：
// - user 信息（name, email, role, avatar）
// - login / logout action
// - token 持久化（localStorage）
// - 权限判断 getter（isAdmin, isMember）
export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = ref(false)

  return { user, isLoggedIn }
})
