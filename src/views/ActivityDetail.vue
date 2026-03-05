<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getActivityById } from '../api/activities.js'

const route = useRoute()
const router = useRouter()
const activity = ref(null)
const loading = ref(true)

const categoryColors = {
  '工作坊': 'bg-violet-100 text-violet-700',
  '讲座':   'bg-blue-100 text-blue-700',
  '竞赛':   'bg-amber-100 text-amber-700',
  '社交':   'bg-green-100 text-green-700',
}

const statusMap = {
  upcoming: { label: '即将举行', class: 'bg-primary-100 text-primary-700' },
  past:     { label: '已结束',   class: 'bg-slate-100 text-slate-500' },
  ongoing:  { label: '进行中',   class: 'bg-green-100 text-green-700' },
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
}

onMounted(async () => {
  activity.value = await getActivityById(route.params.id)
  loading.value = false
  if (!activity.value) router.replace('/activities')
})
</script>

<template>
  <main class="py-12 bg-slate-50 min-h-screen">
    <div class="page-container max-w-3xl">
      <!-- 返回 -->
      <router-link to="/activities" class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        返回活动列表
      </router-link>

      <div v-if="loading" class="text-center py-20 text-slate-400">加载中...</div>

      <div v-else-if="activity" class="card overflow-visible">
        <!-- 封面 -->
        <div class="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-t-xl overflow-hidden">
          <img v-if="activity.cover" :src="activity.cover" :alt="activity.title" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="w-16 h-16 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>

        <!-- 内容 -->
        <div class="p-6 sm:p-8">
          <!-- 标签行 -->
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <span class="badge" :class="categoryColors[activity.category] || 'bg-slate-100 text-slate-600'">
              {{ activity.category }}
            </span>
            <span class="badge" :class="statusMap[activity.status]?.class">
              {{ statusMap[activity.status]?.label }}
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">{{ activity.title }}</h1>

          <!-- 元信息 -->
          <div class="grid sm:grid-cols-2 gap-3 mb-6 p-4 bg-slate-50 rounded-lg text-sm">
            <div class="flex items-center gap-2 text-slate-600">
              <svg class="w-4 h-4 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>{{ formatDate(activity.date) }}</span>
            </div>
            <div class="flex items-center gap-2 text-slate-600">
              <svg class="w-4 h-4 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>{{ activity.location }}</span>
            </div>
          </div>

          <!-- 微信公众号推文入口 -->
          <div v-if="activity.wxArticleUrl" class="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <svg class="w-8 h-8 text-green-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.288 1.093h.004c4.947 0 8.977-4.027 8.979-8.977a8.898 8.898 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.462-7.461 7.462m4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393.112-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a9.65 9.65 0 0 0-.429-.008.826.826 0 0 0-.599.28c-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321c.112.15 1.582 2.415 3.832 3.387.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.067-.056-.094-.207-.151-.43-.263"/>
            </svg>
            <div class="flex-1">
              <p class="text-sm font-medium text-green-800">本活动有微信公众号推文</p>
              <p class="text-xs text-green-600">点击查看完整图文报道</p>
            </div>
            <a
              :href="activity.wxArticleUrl"
              target="_blank"
              rel="noopener"
              class="shrink-0 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
            >
              查看推文
            </a>
          </div>

          <!-- 活动详情 -->
          <div class="prose prose-slate max-w-none">
            <p class="text-slate-600 leading-relaxed">{{ activity.description }}</p>
          </div>

          <!-- 图片集（如有） -->
          <div v-if="activity.images?.length" class="mt-6 grid grid-cols-2 gap-3">
            <img
              v-for="(img, i) in activity.images"
              :key="i"
              :src="img"
              class="rounded-lg object-cover aspect-video w-full"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
