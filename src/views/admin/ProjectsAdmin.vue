<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getProjects, saveProject, deleteProject, exportProjects } from '../../api/projects.js'

const list = ref([])
const showForm = ref(false)
const editingId = ref(null)

const EMPTY = () => ({
  id: null,
  title: '',
  type: '科研',
  status: 'recruiting',
  deadline: '',
  quota: 1,
  supervisor: '',
  description: '',
  requirementsText: '',  // 内部用，换行分隔
  tagsText: '',          // 内部用，逗号分隔
  contact: '',
  applyUrl: '',
})

const form = reactive(EMPTY())

const types = ['科研', '实习', '竞赛']
const statuses = [
  { value: 'recruiting', label: '招募中' },
  { value: 'ongoing',    label: '进行中' },
  { value: 'closed',     label: '已截止' },
]

const statusLabel = { recruiting: '招募中', ongoing: '进行中', closed: '已截止' }
const statusClass = {
  recruiting: 'bg-primary-100 text-primary-700',
  ongoing: 'bg-teal-100 text-teal-700',
  closed: 'bg-red-100 text-red-600',
}
const typeClass = { '科研': 'bg-blue-100 text-blue-700', '实习': 'bg-green-100 text-green-700', '竞赛': 'bg-amber-100 text-amber-700' }

onMounted(reload)

async function reload() {
  list.value = await getProjects()
}

function openAdd() {
  Object.assign(form, EMPTY())
  editingId.value = null
  showForm.value = true
}

function openEdit(project) {
  Object.assign(form, {
    ...project,
    requirementsText: (project.requirements || []).join('\n'),
    tagsText: (project.tags || []).join(', '),
  })
  editingId.value = project.id
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
  editingId.value = null
}

async function submitForm() {
  if (!form.title || !form.supervisor) {
    alert('请填写项目标题和负责人/导师')
    return
  }
  const project = {
    ...form,
    requirements: form.requirementsText.split('\n').map(s => s.trim()).filter(Boolean),
    tags: form.tagsText.split(',').map(s => s.trim()).filter(Boolean),
  }
  delete project.requirementsText
  delete project.tagsText
  await saveProject(project)
  await reload()
  cancelForm()
}

async function remove(id, title) {
  if (!confirm(`确认删除「${title}」？`)) return
  await deleteProject(id)
  await reload()
}

function downloadJSON() {
  const data = exportProjects()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'projects.json'; a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="max-w-4xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-slate-800">项目管理</h1>
        <p class="text-sm text-slate-500 mt-0.5">共 {{ list.length }} 个项目</p>
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
          添加项目
        </button>
      </div>
    </div>

    <!-- 编辑表单 Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" @click.self="cancelForm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 class="font-semibold text-slate-800">{{ editingId ? '编辑项目' : '添加项目' }}</h2>
          <button @click="cancelForm" class="p-1 text-slate-400 hover:text-slate-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="form-label">项目标题 <span class="text-red-400">*</span></label>
            <input v-model="form.title" type="text" class="form-input" placeholder="例：大语言模型微调研究" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">项目类型</label>
              <select v-model="form.type" class="form-input">
                <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <div>
              <label class="form-label">状态</label>
              <select v-model="form.status" class="form-input">
                <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">截止日期</label>
              <input v-model="form.deadline" type="date" class="form-input" />
            </div>
            <div>
              <label class="form-label">招募名额</label>
              <input v-model.number="form.quota" type="number" min="1" class="form-input" />
            </div>
          </div>

          <div>
            <label class="form-label">负责人 / 导师 <span class="text-red-400">*</span></label>
            <input v-model="form.supervisor" type="text" class="form-input" placeholder="例：某某某副教授（计算机科学与工程学系）" />
          </div>

          <div>
            <label class="form-label">项目简介</label>
            <textarea v-model="form.description" class="form-input" rows="3" placeholder="项目背景与内容..."></textarea>
          </div>

          <div>
            <label class="form-label">招募要求（每行一条）</label>
            <textarea v-model="form.requirementsText" class="form-input" rows="4" placeholder="熟悉 Python&#10;了解 Transformer 架构&#10;..."></textarea>
          </div>

          <div>
            <label class="form-label">标签（逗号分隔）</label>
            <input v-model="form.tagsText" type="text" class="form-input" placeholder="NLP, LLM, PyTorch" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">联系邮箱</label>
              <input v-model="form.contact" type="email" class="form-input" />
            </div>
            <div>
              <label class="form-label">报名链接（可选）</label>
              <input v-model="form.applyUrl" type="url" class="form-input" placeholder="https://..." />
            </div>
          </div>
        </div>

        <div class="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex gap-3 justify-end">
          <button @click="cancelForm" class="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">取消</button>
          <button @click="submitForm" class="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">保存</button>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <div class="space-y-2">
      <div
        v-for="project in list"
        :key="project.id"
        class="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5 flex-wrap">
            <span class="text-sm font-medium text-slate-800 truncate">{{ project.title }}</span>
            <span class="badge shrink-0" :class="typeClass[project.type]">{{ project.type }}</span>
            <span class="badge shrink-0" :class="statusClass[project.status]">{{ statusLabel[project.status] }}</span>
          </div>
          <p class="text-xs text-slate-400">{{ project.supervisor }} · 招募 {{ project.quota }} 人</p>
        </div>
        <div class="flex gap-2 shrink-0">
          <button @click="openEdit(project)" class="px-3 py-1.5 text-xs border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">编辑</button>
          <button @click="remove(project.id, project.title)" class="px-3 py-1.5 text-xs border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors">删除</button>
        </div>
      </div>
      <div v-if="!list.length" class="text-center py-12 text-slate-400 text-sm">暂无项目</div>
    </div>
  </div>
</template>

<style scoped>
.form-label { @apply block text-sm font-medium text-slate-700 mb-1.5; }
.form-input { @apply w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent; }
</style>
