<script setup>
import { ref, computed, onMounted } from 'vue'
import ActivityCard from '../components/ActivityCard.vue'
import { getActivities } from '../api/activities.js'

const all = ref([])
const activeCategory = ref('全部')
const activeStatus = ref('全部')

const categories = ['全部', '工作坊', '讲座', '竞赛', '社交']
const statuses = [
  { key: '全部',    label: '全部' },
  { key: 'upcoming', label: '即将举行' },
  { key: 'past',     label: '往期回顾' },
]

onMounted(async () => {
  all.value = await getActivities()
})

const filtered = computed(() => {
  return all.value.filter(a => {
    const catOk = activeCategory.value === '全部' || a.category === activeCategory.value
    const statusOk = activeStatus.value === '全部' || a.status === activeStatus.value
    return catOk && statusOk
  })
})
</script>

<template>
  <main class="py-12 bg-slate-50 min-h-screen">
    <div class="page-container">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="section-title">社团活动</h1>
        <p class="text-slate-500 mt-2">记录每一次学习、分享与成长的足迹</p>
      </div>

      <!-- 筛选器 -->
      <div class="bg-white rounded-xl p-4 mb-8 flex flex-col sm:flex-row gap-4 border border-slate-100">
        <!-- 状态筛选 -->
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

        <!-- 分类筛选 -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs text-slate-400 shrink-0">类型：</span>
          <button
            v-for="cat in categories"
            :key="cat"
            class="px-3 py-1 rounded-full text-sm transition-colors"
            :class="activeCategory === cat
              ? 'bg-primary-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- 活动列表 -->
      <div v-if="filtered.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <ActivityCard v-for="a in filtered" :key="a.id" :activity="a" />
      </div>
      <div v-else class="text-center py-20 text-slate-400">
        <svg class="w-12 h-12 mx-auto mb-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <p>暂无符合条件的活动</p>
      </div>
    </div>
  </main>
</template>
