<script setup>
import { ref, computed, onMounted } from 'vue'
import ProjectCard from '../components/ProjectCard.vue'
import { getProjects } from '../api/projects.js'

const all = ref([])
const activeType = ref('全部')
const activeStatus = ref('全部')

const types = ['全部', '科研', '实习', '竞赛']
const statuses = [
  { key: '全部',      label: '全部' },
  { key: 'recruiting', label: '招募中' },
  { key: 'ongoing',   label: '进行中' },
  { key: 'closed',    label: '已截止' },
]

onMounted(async () => {
  all.value = await getProjects()
})

const filtered = computed(() => {
  return all.value.filter(p => {
    const typeOk   = activeType.value === '全部' || p.type === activeType.value
    const statusOk = activeStatus.value === '全部' || p.status === activeStatus.value
    return typeOk && statusOk
  })
})
</script>

<template>
  <main class="py-12 bg-slate-50 min-h-screen">
    <div class="page-container">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="section-title">项目招募</h1>
        <p class="text-slate-500 mt-2">科研、实习、竞赛 —— 找到属于你的舞台</p>
      </div>

      <!-- 筛选器 -->
      <div class="bg-white rounded-xl p-4 mb-8 flex flex-col sm:flex-row gap-4 border border-slate-100">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs text-slate-400 shrink-0">状态：</span>
          <button
            v-for="s in statuses"
            :key="s.key"
            class="px-3 py-1 rounded-full text-sm transition-colors"
            :class="activeStatus === s.key
              ? 'bg-primary-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'"
            @click="activeStatus = s.key"
          >
            {{ s.label }}
          </button>
        </div>

        <div class="hidden sm:block w-px bg-slate-100 self-stretch"></div>

        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs text-slate-400 shrink-0">类型：</span>
          <button
            v-for="t in types"
            :key="t"
            class="px-3 py-1 rounded-full text-sm transition-colors"
            :class="activeType === t
              ? 'bg-primary-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'"
            @click="activeType = t"
          >
            {{ t }}
          </button>
        </div>
      </div>

      <!-- 项目列表 -->
      <div v-if="filtered.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <ProjectCard v-for="p in filtered" :key="p.id" :project="p" />
      </div>
      <div v-else class="text-center py-20 text-slate-400">
        <svg class="w-12 h-12 mx-auto mb-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <p>暂无符合条件的项目</p>
      </div>
    </div>
  </main>
</template>
