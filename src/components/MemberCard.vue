<script setup>
defineProps({
  member: {
    type: Object,
    required: true,
  },
  // 显示模式：'full'（含简介）或 'compact'（仅姓名+职位）
  mode: {
    type: String,
    default: 'full',
  },
})

// 根据姓名生成头像占位背景色（固定，不随机）
function avatarColor(name) {
  const colors = [
    'bg-blue-400', 'bg-indigo-400', 'bg-violet-400',
    'bg-sky-400', 'bg-teal-400', 'bg-cyan-400',
  ]
  const index = (name?.charCodeAt(0) || 0) % colors.length
  return colors[index]
}

function initials(name) {
  return name ? name.slice(0, 1) : '?'
}
</script>

<template>
  <!-- 完整卡片（指导老师 / 主席团 / 部长） -->
  <div v-if="mode === 'full'" class="card p-5 flex flex-col items-center text-center gap-3">
    <!-- 头像 -->
    <div class="relative">
      <img
        v-if="member.avatar"
        :src="member.avatar"
        :alt="member.name"
        class="w-20 h-20 rounded-full object-cover ring-2 ring-primary-100"
      />
      <!-- 无头像占位 -->
      <div
        v-else
        class="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold ring-2 ring-primary-100"
        :class="avatarColor(member.name)"
      >
        {{ initials(member.name) }}
      </div>
    </div>

    <div>
      <p class="font-semibold text-slate-800">{{ member.name }}</p>
      <p class="text-sm text-primary-600 font-medium">{{ member.role }}</p>
      <p v-if="member.title" class="text-xs text-slate-400 mt-0.5">{{ member.title }}</p>
      <p v-else-if="member.major" class="text-xs text-slate-400 mt-0.5">{{ member.major }} · {{ member.grade }}</p>
    </div>

    <p v-if="member.bio" class="text-xs text-slate-500 leading-relaxed">{{ member.bio }}</p>
  </div>

  <!-- 紧凑卡片（普通成员） -->
  <div v-else class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-primary-50 transition-colors">
    <div
      class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
      :class="avatarColor(member.name)"
    >
      {{ initials(member.name) }}
    </div>
    <div>
      <p class="text-sm font-medium text-slate-800">{{ member.name }}</p>
      <p class="text-xs text-slate-400">{{ member.major }} · {{ member.grade }}</p>
    </div>
  </div>
</template>
