import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
// base 设置为 '/aia-website/' 以匹配 GitHub Pages 仓库名
// 如果仓库名变更，请同步修改此处
export default defineConfig({
  plugins: [vue()],
  base: '/aia-website/',
})
