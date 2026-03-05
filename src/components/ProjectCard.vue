<script setup>
defineProps({
  project: {
    type: Object,
    required: true,
  },
})

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

function formatDeadline(dateStr) {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}
</script>

<template>
  <router-link :to="`/projects/${project.id}`" class="card flex flex-col p-5 gap-3 group">
    <!-- 标题行 -->
    <div class="flex items-start justify-between gap-2">
      <h3 class="font-semibold text-slate-800 group-hover:text-primary-600 transition-colors leading-snug">
        {{ project.title }}
      </h3>
      <span class="badge shrink-0" :class="statusMap[project.status]?.class">
        {{ statusMap[project.status]?.label }}
      </span>
    </div>

    <!-- 标签 -->
    <div class="flex flex-wrap gap-1.5">
      <span class="badge" :class="typeColors[project.type] || 'bg-slate-100 text-slate-600'">
        {{ project.type }}
      </span>
      <span
        v-for="tag in project.tags?.slice(0, 3)"
        :key="tag"
        class="badge bg-slate-100 text-slate-500"
      >
        {{ tag }}
      </span>
    </div>

    <!-- 简介 -->
    <p class="text-sm text-slate-500 line-clamp-2 flex-1">{{ project.description }}</p>

    <!-- 底部信息 -->
    <div class="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-50">
      <span class="flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        招募 {{ project.quota }} 人
      </span>
      <span v-if="project.status === 'recruiting'" class="flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        截止 {{ formatDeadline(project.deadline) }}
      </span>
    </div>
  </router-link>
</template>
