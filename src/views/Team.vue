<script setup>
import { ref, onMounted } from 'vue'
import MemberCard from '../components/MemberCard.vue'
import { getCurrentTeam, getAllTerms, getTeamByTerm } from '../api/team.js'

const team = ref(null)
const terms = ref([])
const selectedTerm = ref('')
const loading = ref(true)

onMounted(async () => {
  terms.value = await getAllTerms()
  const current = await getCurrentTeam()
  team.value = current
  selectedTerm.value = current?.year || ''
  loading.value = false
})

async function switchTerm(year) {
  if (year === selectedTerm.value) return
  selectedTerm.value = year
  loading.value = true
  team.value = await getTeamByTerm(year)
  loading.value = false
}
</script>

<template>
  <main class="py-12 bg-slate-50 min-h-screen">
    <div class="page-container">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="section-title">组织架构</h1>
        <p class="text-slate-500 mt-2">认识我们的团队，了解每一个部门的使命</p>
      </div>

      <!-- 届次切换 -->
      <div v-if="terms.length > 1" class="flex items-center gap-2 mb-8">
        <span class="text-sm text-slate-400">届次：</span>
        <button
          v-for="t in terms"
          :key="t.year"
          class="px-3 py-1 rounded-full text-sm transition-colors"
          :class="selectedTerm === t.year
            ? 'bg-primary-600 text-white'
            : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'"
          @click="switchTerm(t.year)"
        >
          {{ t.year }}
          <span v-if="t.current" class="ml-1 text-xs opacity-70">（现任）</span>
        </button>
      </div>

      <div v-if="loading" class="text-center py-20 text-slate-400">加载中...</div>

      <div v-else-if="team">
        <!-- 指导老师 -->
        <section class="mb-12">
          <h2 class="text-lg font-semibold text-slate-700 mb-5 flex items-center gap-2">
            <span class="w-1 h-5 rounded-full bg-primary-500 inline-block"></span>
            指导老师
          </h2>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <MemberCard v-for="a in team.advisors" :key="a.id" :member="a" mode="full" />
          </div>
        </section>

        <!-- 主席团 -->
        <section class="mb-12">
          <h2 class="text-lg font-semibold text-slate-700 mb-5 flex items-center gap-2">
            <span class="w-1 h-5 rounded-full bg-primary-500 inline-block"></span>
            主席团
          </h2>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <MemberCard v-for="m in team.presidium" :key="m.id" :member="m" mode="full" />
          </div>
        </section>

        <!-- 各部门 -->
        <section>
          <h2 class="text-lg font-semibold text-slate-700 mb-5 flex items-center gap-2">
            <span class="w-1 h-5 rounded-full bg-primary-500 inline-block"></span>
            各部门
          </h2>

          <div class="space-y-6">
            <div
              v-for="dept in team.departments"
              :key="dept.name"
              class="bg-white rounded-xl border border-slate-100 p-6"
            >
              <!-- 部门标题 + 简介 -->
              <div class="mb-5">
                <h3 class="font-bold text-slate-800 text-lg">{{ dept.name }}</h3>
                <p class="text-sm text-slate-500 mt-1">{{ dept.description }}</p>
              </div>

              <!-- 部长 -->
              <div class="mb-4">
                <p class="text-xs text-slate-400 mb-2 uppercase tracking-wide">部长</p>
                <div class="max-w-xs">
                  <MemberCard :member="{ ...dept.head, role: dept.head.role }" mode="full" />
                </div>
              </div>

              <!-- 成员 -->
              <div v-if="dept.members?.length">
                <p class="text-xs text-slate-400 mb-2 uppercase tracking-wide">成员</p>
                <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                  <MemberCard v-for="m in dept.members" :key="m.id" :member="m" mode="compact" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>
