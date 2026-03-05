<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProjectById } from '../api/projects.js'

const route = useRoute()
const router = useRouter()
const project = ref(null)
const loading = ref(true)

const typeColors = {
  '科研': 'bg-blue-100 text-blue-700',
  '实习': 'bg-green-100 text-green-700',
  '竞赛': 'bg-amber-100 text-amber-700',
}

const statusMap = {
  recruiting: { label: '招募中', class: 'bg-primary-100 text-primary-700' },
  closed:     { label: '已截止', class: 'bg-red-100 text-red-600' },
  ongoing:    { label: '进行中', class: 'bg-teal-100 text-teal-700' },
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
}

onMounted(async () => {
  project.value = await getProjectById(route.params.id)
  loading.value = false
  if (!project.value) router.replace('/projects')
})
</script>

<template>
  <main class="py-12 bg-slate-50 min-h-screen">
    <div class="page-container max-w-3xl">
      <!-- 返回 -->
      <router-link to="/projects" class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        返回项目列表
      </router-link>

      <div v-if="loading" class="text-center py-20 text-slate-400">加载中...</div>

      <div v-else-if="project" class="card p-6 sm:p-8">
        <!-- 标签 -->
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <span class="badge" :class="typeColors[project.type] || 'bg-slate-100 text-slate-600'">
            {{ project.type }}
          </span>
          <span class="badge" :class="statusMap[project.status]?.class">
            {{ statusMap[project.status]?.label }}
          </span>
          <span v-for="tag in project.tags" :key="tag" class="badge bg-slate-100 text-slate-500">
            {{ tag }}
          </span>
        </div>

        <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">{{ project.title }}</h1>

        <!-- 基本信息 -->
        <div class="grid sm:grid-cols-2 gap-3 mb-6 p-4 bg-slate-50 rounded-lg text-sm">
          <div class="flex items-start gap-2 text-slate-600">
            <svg class="w-4 h-4 text-primary-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <div>
              <p class="text-xs text-slate-400">负责人/导师</p>
              <p>{{ project.supervisor }}</p>
            </div>
          </div>
          <div class="flex items-start gap-2 text-slate-600">
            <svg class="w-4 h-4 text-primary-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <div>
              <p class="text-xs text-slate-400">招募名额</p>
              <p>{{ project.quota }} 人</p>
            </div>
          </div>
          <div v-if="project.status === 'recruiting'" class="flex items-start gap-2 text-slate-600">
            <svg class="w-4 h-4 text-primary-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <div>
              <p class="text-xs text-slate-400">截止日期</p>
              <p>{{ formatDate(project.deadline) }}</p>
            </div>
          </div>
          <div class="flex items-start gap-2 text-slate-600">
            <svg class="w-4 h-4 text-primary-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <div>
              <p class="text-xs text-slate-400">联系邮箱</p>
              <p>{{ project.contact }}</p>
            </div>
          </div>
        </div>

        <!-- 项目描述 -->
        <div class="mb-6">
          <h2 class="font-semibold text-slate-800 mb-2">项目简介</h2>
          <p class="text-slate-600 leading-relaxed text-sm">{{ project.description }}</p>
        </div>

        <!-- 招募要求 -->
        <div class="mb-8">
          <h2 class="font-semibold text-slate-800 mb-3">招募要求</h2>
          <ul class="space-y-2">
            <li
              v-for="req in project.requirements"
              :key="req"
              class="flex items-start gap-2 text-sm text-slate-600"
            >
              <svg class="w-4 h-4 text-primary-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ req }}
            </li>
          </ul>
        </div>

        <!-- 报名按钮 -->
        <div v-if="project.status === 'recruiting'" class="flex flex-col sm:flex-row gap-3">
          <a
            v-if="project.applyUrl"
            :href="project.applyUrl"
            target="_blank"
            rel="noopener"
            class="btn-primary justify-center"
          >
            立即报名
          </a>
          <a
            :href="`mailto:${project.contact}?subject=申请参与：${project.title}`"
            class="btn-outline justify-center"
          >
            发送邮件咨询
          </a>
        </div>
        <div v-else class="p-3 bg-slate-50 rounded-lg text-sm text-slate-500 text-center">
          该项目招募已结束，如有疑问请联系 {{ project.contact }}
        </div>
      </div>
    </div>
  </main>
</template>
