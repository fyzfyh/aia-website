<script setup>
import { ref, onMounted } from 'vue'
import ActivityCard from '../components/ActivityCard.vue'
import ProjectCard from '../components/ProjectCard.vue'
import { getUpcomingActivities } from '../api/activities.js'
import { getRecruitingProjects } from '../api/projects.js'

const upcomingActivities = ref([])
const recruitingProjects = ref([])

onMounted(async () => {
  upcomingActivities.value = await getUpcomingActivities(3)
  recruitingProjects.value = await getRecruitingProjects(3)
})

const stats = [
  { label: '注册会员', value: '200+' },
  { label: '举办活动', value: '30+' },
  { label: '合作项目', value: '15+' },
  { label: '成立年限', value: '3 年' },
]
</script>

<template>
  <main>
    <!-- Hero Banner -->
    <section class="relative bg-gradient-to-br from-primary-700 via-primary-600 to-sky-500 text-white overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white blur-3xl"></div>
      </div>

      <div class="page-container relative py-20 sm:py-28 text-center">
        <div class="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          正在招募新成员
        </div>

        <h1 class="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
          探索人工智能，<br class="sm:hidden" />共塑智慧未来
        </h1>
        <p class="text-lg sm:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          香港中文大学（深圳）人工智能协会 —— 连接热爱 AI 的你与前沿的世界
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <router-link to="/projects" class="btn-primary bg-white !text-primary-700 hover:bg-primary-50 w-full sm:w-auto justify-center">
            查看招募项目
          </router-link>
          <router-link to="/about" class="btn-outline !border-white !text-white hover:!bg-white/10 w-full sm:w-auto justify-center">
            了解我们
          </router-link>
        </div>
      </div>
    </section>

    <!-- 统计数据 -->
    <section class="bg-white border-b border-slate-100">
      <div class="page-container py-10">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <p class="text-3xl font-bold text-primary-600">{{ stat.value }}</p>
            <p class="text-sm text-slate-500 mt-1">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 近期活动 -->
    <section class="py-14 bg-slate-50">
      <div class="page-container">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="section-title">近期活动</h2>
            <p class="text-slate-500 mt-1 text-sm">不错过每一次学习与交流的机会</p>
          </div>
          <router-link to="/activities" class="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            查看全部
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>

        <div v-if="upcomingActivities.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ActivityCard v-for="a in upcomingActivities" :key="a.id" :activity="a" />
        </div>
        <p v-else class="text-center text-slate-400 py-12">暂无即将举行的活动，敬请期待</p>
      </div>
    </section>

    <!-- 项目招募 -->
    <section class="py-14 bg-white">
      <div class="page-container">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="section-title">项目招募</h2>
            <p class="text-slate-500 mt-1 text-sm">科研、实习、竞赛，找到属于你的舞台</p>
          </div>
          <router-link to="/projects" class="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            查看全部
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>

        <div v-if="recruitingProjects.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ProjectCard v-for="p in recruitingProjects" :key="p.id" :project="p" />
        </div>
        <p v-else class="text-center text-slate-400 py-12">暂无招募中的项目</p>
      </div>
    </section>

    <!-- 加入我们 CTA -->
    <section class="py-14 bg-primary-50">
      <div class="page-container text-center">
        <h2 class="section-title mb-3">想加入我们？</h2>
        <p class="text-slate-500 mb-6 max-w-md mx-auto">
          无论你是 AI 新手还是已有经验的探索者，AI 协会欢迎每一位对人工智能充满好奇的你。
        </p>
        <router-link to="/about" class="btn-primary">
          了解如何加入
        </router-link>
      </div>
    </section>
  </main>
</template>
