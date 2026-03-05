<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getActivities, saveActivity, deleteActivity, exportActivities } from '../../api/activities.js'

const list = ref([])
const showForm = ref(false)
const editingId = ref(null) // null = 新增

const EMPTY = () => ({
  id: null,
  title: '',
  date: '',
  endDate: '',
  location: '',
  category: '工作坊',
  status: 'upcoming',
  cover: '',
  wxArticleUrl: '',
  description: '',
  images: [],
})

const form = reactive(EMPTY())

const categories = ['工作坊', '讲座', '竞赛', '社交']
const statuses = [
  { value: 'upcoming', label: '即将举行' },
  { value: 'ongoing',  label: '进行中' },
  { value: 'past',     label: '已结束' },
]

const statusLabel = { upcoming: '即将举行', ongoing: '进行中', past: '已结束' }
const statusClass = {
  upcoming: 'bg-primary-100 text-primary-700',
  ongoing: 'bg-green-100 text-green-700',
  past: 'bg-slate-100 text-slate-500',
}

onMounted(reload)

async function reload() {
  list.value = await getActivities()
}

function openAdd() {
  Object.assign(form, EMPTY())
  editingId.value = null
  showForm.value = true
  setTimeout(() => document.getElementById('act-title')?.focus(), 50)
}

function openEdit(activity) {
  Object.assign(form, { ...activity })
  editingId.value = activity.id
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
  editingId.value = null
}

async function submitForm() {
  if (!form.title || !form.date || !form.location) {
    alert('请填写标题、日期和地点')
    return
  }
  await saveActivity({ ...form })
  await reload()
  cancelForm()
}

async function remove(id, title) {
  if (!confirm(`确认删除「${title}」？此操作不可撤销。`)) return
  await deleteActivity(id)
  await reload()
}

function downloadJSON() {
  const data = exportActivities()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'activities.json'; a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="max-w-4xl">
    <!-- 页头 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-slate-800">活动管理</h1>
        <p class="text-sm text-slate-500 mt-0.5">共 {{ list.length }} 条活动记录</p>
      </div>
      <div class="flex gap-2">
        <button @click="downloadJSON" class="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          导出 JSON
        </button>
        <button @click="openAdd" class="flex items-center gap-1.5 px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          添加活动
        </button>
      </div>
    </div>

    <!-- 编辑/新增表单 Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" @click.self="cancelForm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 class="font-semibold text-slate-800">{{ editingId ? '编辑活动' : '添加活动' }}</h2>
          <button @click="cancelForm" class="p-1 text-slate-400 hover:text-slate-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <!-- 标题 -->
          <div>
            <label class="form-label">活动标题 <span class="text-red-400">*</span></label>
            <input id="act-title" v-model="form.title" type="text" class="form-input" placeholder="例：深度学习入门工作坊" />
          </div>

          <!-- 日期 + 结束日期 -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">开始日期 <span class="text-red-400">*</span></label>
              <input v-model="form.date" type="date" class="form-input" />
            </div>
            <div>
              <label class="form-label">结束日期</label>
              <input v-model="form.endDate" type="date" class="form-input" />
            </div>
          </div>

          <!-- 地点 -->
          <div>
            <label class="form-label">地点 <span class="text-red-400">*</span></label>
            <input v-model="form.location" type="text" class="form-input" placeholder="例：教学楼 A101" />
          </div>

          <!-- 分类 + 状态 -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">活动类型</label>
              <select v-model="form.category" class="form-input">
                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <div>
              <label class="form-label">状态</label>
              <select v-model="form.status" class="form-input">
                <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </div>
          </div>

          <!-- 活动描述 -->
          <div>
            <label class="form-label">活动简介</label>
            <textarea v-model="form.description" class="form-input" rows="3" placeholder="活动内容介绍..."></textarea>
          </div>

          <!-- 微信推文链接 -->
          <div>
            <label class="form-label flex items-center gap-1.5">
              <svg class="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.288 1.093h.004c4.947 0 8.977-4.027 8.979-8.977a8.898 8.898 0 0 0-2.627-6.35"/>
              </svg>
              微信公众号推文链接（可选）
            </label>
            <input v-model="form.wxArticleUrl" type="url" class="form-input" placeholder="https://mp.weixin.qq.com/s/..." />
            <p class="mt-1 text-xs text-slate-400">填写后，活动卡片将直接跳转到该推文</p>
          </div>

          <!-- 封面图 URL -->
          <div>
            <label class="form-label">封面图 URL（可选）</label>
            <input v-model="form.cover" type="url" class="form-input" placeholder="https://..." />
          </div>
        </div>

        <div class="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex gap-3 justify-end">
          <button @click="cancelForm" class="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">取消</button>
          <button @click="submitForm" class="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">保存</button>
        </div>
      </div>
    </div>

    <!-- 活动列表 -->
    <div class="space-y-2">
      <div
        v-for="activity in list"
        :key="activity.id"
        class="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <span class="text-sm font-medium text-slate-800 truncate">{{ activity.title }}</span>
            <span class="badge shrink-0" :class="statusClass[activity.status]">{{ statusLabel[activity.status] }}</span>
            <span v-if="activity.wxArticleUrl" class="badge shrink-0 bg-green-100 text-green-600">含推文</span>
          </div>
          <p class="text-xs text-slate-400">{{ activity.date }} · {{ activity.category }} · {{ activity.location }}</p>
        </div>
        <div class="flex gap-2 shrink-0">
          <button
            @click="openEdit(activity)"
            class="px-3 py-1.5 text-xs border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >编辑</button>
          <button
            @click="remove(activity.id, activity.title)"
            class="px-3 py-1.5 text-xs border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
          >删除</button>
        </div>
      </div>

      <div v-if="!list.length" class="text-center py-12 text-slate-400 text-sm">
        暂无活动，点击「添加活动」开始
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-slate-700 mb-1.5;
}
.form-input {
  @apply w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent;
}
</style>
