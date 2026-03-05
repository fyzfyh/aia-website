<script setup>
import { computed } from 'vue'

const props = defineProps({
  activity: { type: Object, required: true },
})

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

// 若绑定了微信推文链接，点击直接跳外链；否则进内部详情页
const hasWx = computed(() => !!props.activity.wxArticleUrl)

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
}
</script>

<template>
  <component
    :is="hasWx ? 'a' : 'router-link'"
    v-bind="hasWx
      ? { href: activity.wxArticleUrl, target: '_blank', rel: 'noopener' }
      : { to: `/activities/${activity.id}` }"
    class="card flex flex-col group"
  >
    <!-- 封面图 -->
    <div class="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
      <img
        v-if="activity.cover"
        :src="activity.cover"
        :alt="activity.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg class="w-12 h-12 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>
      <!-- 状态标签 -->
      <span class="badge absolute top-3 right-3" :class="statusMap[activity.status]?.class">
        {{ statusMap[activity.status]?.label }}
      </span>
      <!-- 微信推文标识 -->
      <span v-if="hasWx" class="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.288 1.093h.004c4.947 0 8.977-4.027 8.979-8.977a8.898 8.898 0 0 0-2.627-6.35"/>
        </svg>
        公众号推文
      </span>
    </div>

    <!-- 内容 -->
    <div class="p-4 flex flex-col flex-1">
      <div class="flex items-center justify-between mb-2">
        <span class="badge" :class="categoryColors[activity.category] || 'bg-slate-100 text-slate-600'">
          {{ activity.category }}
        </span>
        <span class="text-xs text-slate-400">{{ formatDate(activity.date) }}</span>
      </div>

      <h3 class="font-semibold text-slate-800 mb-1.5 group-hover:text-primary-600 transition-colors line-clamp-2">
        {{ activity.title }}
      </h3>
      <p class="text-sm text-slate-500 line-clamp-2 flex-1">{{ activity.description }}</p>

      <div class="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
        <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span class="truncate">{{ activity.location }}</span>
      </div>
    </div>
  </component>
</template>
