<script setup>
import { ref, onMounted } from 'vue'
import { getActivities, exportActivities, resetActivities } from '../../api/activities.js'
import { exportTeam, resetTeam } from '../../api/team.js'
import { getProjects, exportProjects, resetProjects } from '../../api/projects.js'

const counts = ref({ activities: 0, projects: 0 })

onMounted(async () => {
  const [acts, projs] = await Promise.all([getActivities(), getProjects()])
  counts.value.activities = acts.length
  counts.value.projects = projs.length
})

// 通用 JSON 导出下载
function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function exportAll() {
  downloadJSON(exportActivities(), 'activities.json')
  downloadJSON(exportTeam(), 'team.json')
  downloadJSON(exportProjects(), 'projects.json')
}

function resetAll() {
  if (!confirm('确认重置所有数据？本地编辑将全部丢失，恢复为代码中的初始数据。')) return
  resetActivities()
  resetTeam()
  resetProjects()
  alert('已重置，刷新页面生效。')
}
</script>

<template>
  <div class="max-w-3xl">
    <h1 class="text-xl font-bold text-slate-800 mb-1">概览</h1>
    <p class="text-sm text-slate-500 mb-6">欢迎回来！在这里管理网站的所有内容。</p>

    <!-- 数据统计 -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
      <div class="bg-white rounded-xl p-4 border border-slate-100">
        <p class="text-2xl font-bold text-primary-600">{{ counts.activities }}</p>
        <p class="text-sm text-slate-500 mt-0.5">社团活动</p>
      </div>
      <div class="bg-white rounded-xl p-4 border border-slate-100">
        <p class="text-2xl font-bold text-primary-600">{{ counts.projects }}</p>
        <p class="text-sm text-slate-500 mt-0.5">招募项目</p>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="grid sm:grid-cols-3 gap-4 mb-8">
      <router-link to="/admin/activities" class="bg-white rounded-xl p-5 border border-slate-100 hover:border-primary-200 hover:shadow-sm transition-all group">
        <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <p class="font-medium text-slate-800 group-hover:text-primary-600 transition-colors">活动管理</p>
        <p class="text-xs text-slate-400 mt-0.5">新增、编辑、删除活动</p>
      </router-link>

      <router-link to="/admin/team" class="bg-white rounded-xl p-5 border border-slate-100 hover:border-primary-200 hover:shadow-sm transition-all group">
        <div class="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center mb-3">
          <svg class="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
        </div>
        <p class="font-medium text-slate-800 group-hover:text-primary-600 transition-colors">团队管理</p>
        <p class="text-xs text-slate-400 mt-0.5">维护成员信息与架构</p>
      </router-link>

      <router-link to="/admin/projects" class="bg-white rounded-xl p-5 border border-slate-100 hover:border-primary-200 hover:shadow-sm transition-all group">
        <div class="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center mb-3">
          <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>
        <p class="font-medium text-slate-800 group-hover:text-primary-600 transition-colors">项目管理</p>
        <p class="text-xs text-slate-400 mt-0.5">发布与管理招募项目</p>
      </router-link>
    </div>

    <!-- 数据说明 + 导出 -->
    <div class="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-4">
      <h3 class="font-semibold text-amber-800 mb-2 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        数据保存说明
      </h3>
      <p class="text-sm text-amber-700 leading-relaxed">
        编辑内容保存在<strong>当前浏览器的本地存储</strong>中。要让所有人看到更新后的内容，需要：
      </p>
      <ol class="mt-2 space-y-1 text-sm text-amber-700 list-decimal list-inside">
        <li>点击「导出全部 JSON」下载三个文件</li>
        <li>将文件替换到 <code class="bg-amber-100 px-1 rounded">src/data/</code> 目录</li>
        <li>提交到 GitHub → 自动重新部署（约 1 分钟）</li>
      </ol>
    </div>

    <div class="flex gap-3">
      <button
        @click="exportAll"
        class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        导出全部 JSON
      </button>
      <button
        @click="resetAll"
        class="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
      >
        重置为初始数据
      </button>
    </div>
  </div>
</template>
