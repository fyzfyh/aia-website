import { createRouter, createWebHashHistory } from 'vue-router'

// 使用 Hash 路由模式，兼容 GitHub Pages 静态托管（无需服务端配置）
// 后续迁移至服务端部署时，可改为 createWebHistory
const routes = [
  // ── 公开页面 ─────────────────────────────────────────
  { path: '/',               name: 'Home',           component: () => import('../views/Home.vue') },
  { path: '/activities',     name: 'Activities',     component: () => import('../views/Activities.vue') },
  { path: '/activities/:id', name: 'ActivityDetail', component: () => import('../views/ActivityDetail.vue') },
  { path: '/team',           name: 'Team',           component: () => import('../views/Team.vue') },
  { path: '/projects',       name: 'Projects',       component: () => import('../views/Projects.vue') },
  { path: '/projects/:id',   name: 'ProjectDetail',  component: () => import('../views/ProjectDetail.vue') },
  { path: '/about',          name: 'About',          component: () => import('../views/About.vue') },

  // ── 管理后台 ─────────────────────────────────────────
  // 登录页（无需认证）
  { path: '/admin/login', name: 'AdminLogin', component: () => import('../views/admin/Login.vue'), meta: { isAdmin: true } },

  // 后台页面（需认证），使用 AdminLayout 作为父级布局
  {
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { isAdmin: true, requiresAdminAuth: true },
    children: [
      { path: '',           redirect: '/admin/dashboard' },
      { path: 'dashboard',  name: 'AdminDashboard',  component: () => import('../views/admin/Dashboard.vue') },
      { path: 'activities', name: 'AdminActivities', component: () => import('../views/admin/ActivitiesAdmin.vue') },
      { path: 'team',       name: 'AdminTeam',       component: () => import('../views/admin/TeamAdmin.vue') },
      { path: 'projects',   name: 'AdminProjects',   component: () => import('../views/admin/ProjectsAdmin.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

// 路由守卫：管理后台需验证 PIN 认证
router.beforeEach((to) => {
  if (to.meta.requiresAdminAuth) {
    const isAuth = sessionStorage.getItem('aia_admin_auth') === '1'
    if (!isAuth) return { name: 'AdminLogin', query: { redirect: to.fullPath } }
  }
})

export default router
