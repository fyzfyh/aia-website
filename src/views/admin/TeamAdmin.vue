<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { getCurrentTeam, saveCurrentTeam, exportTeam } from '../../api/team.js'

// ── 数据 ─────────────────────────────────────────────
const team = ref(null)
const activeTab = ref('advisors') // advisors | presidium | departments

onMounted(async () => {
  team.value = await getCurrentTeam()
})

// ── 通用表单 Modal ────────────────────────────────────
const showForm = ref(false)
const formMode = ref('') // 'advisor' | 'presidium' | 'dept' | 'deptHead' | 'deptMember'
const editingIndex = ref(null)   // 在对应数组中的下标，null=新增
const editingDeptIndex = ref(null) // 当 formMode 含 dept 时的部门下标

const MEMBER_EMPTY = () => ({ id: '', name: '', role: '', major: '', grade: '', avatar: '', bio: '', title: '' })
const DEPT_EMPTY   = () => ({ name: '', description: '', head: MEMBER_EMPTY(), members: [] })

const form = reactive(MEMBER_EMPTY())
const deptForm = reactive(DEPT_EMPTY())

// 表单标题
const formTitle = computed(() => ({
  advisor: '指导老师',
  presidium: '主席团成员',
  dept: '部门',
  deptHead: '部长',
  deptMember: '部门成员',
})[formMode.value] || '')

// ── 指导老师 CRUD ─────────────────────────────────────
function addAdvisor() {
  Object.assign(form, MEMBER_EMPTY())
  formMode.value = 'advisor'; editingIndex.value = null; showForm.value = true
}
function editAdvisor(i) {
  Object.assign(form, { ...team.value.advisors[i] })
  formMode.value = 'advisor'; editingIndex.value = i; showForm.value = true
}
async function deleteAdvisor(i) {
  if (!confirm(`删除「${team.value.advisors[i].name}」？`)) return
  team.value.advisors.splice(i, 1)
  await saveCurrentTeam(team.value)
}

// ── 主席团 CRUD ───────────────────────────────────────
function addPresidium() {
  Object.assign(form, MEMBER_EMPTY())
  formMode.value = 'presidium'; editingIndex.value = null; showForm.value = true
}
function editPresidium(i) {
  Object.assign(form, { ...team.value.presidium[i] })
  formMode.value = 'presidium'; editingIndex.value = i; showForm.value = true
}
async function deletePresidium(i) {
  if (!confirm(`删除「${team.value.presidium[i].name}」？`)) return
  team.value.presidium.splice(i, 1)
  await saveCurrentTeam(team.value)
}

// ── 部门 CRUD ─────────────────────────────────────────
function addDept() {
  Object.assign(deptForm, DEPT_EMPTY())
  formMode.value = 'dept'; editingIndex.value = null; showForm.value = true
}
function editDept(i) {
  Object.assign(deptForm, JSON.parse(JSON.stringify(team.value.departments[i])))
  formMode.value = 'dept'; editingIndex.value = i; showForm.value = true
}
async function deleteDept(i) {
  if (!confirm(`删除部门「${team.value.departments[i].name}」及其全部成员？`)) return
  team.value.departments.splice(i, 1)
  await saveCurrentTeam(team.value)
}

// ── 部长 / 部门成员 CRUD ──────────────────────────────
function editDeptHead(deptIdx) {
  Object.assign(form, { ...team.value.departments[deptIdx].head })
  formMode.value = 'deptHead'; editingDeptIndex.value = deptIdx; editingIndex.value = 0; showForm.value = true
}
function addDeptMember(deptIdx) {
  Object.assign(form, MEMBER_EMPTY())
  formMode.value = 'deptMember'; editingDeptIndex.value = deptIdx; editingIndex.value = null; showForm.value = true
}
function editDeptMember(deptIdx, memberIdx) {
  Object.assign(form, { ...team.value.departments[deptIdx].members[memberIdx] })
  formMode.value = 'deptMember'; editingDeptIndex.value = deptIdx; editingIndex.value = memberIdx; showForm.value = true
}
async function deleteDeptMember(deptIdx, memberIdx) {
  team.value.departments[deptIdx].members.splice(memberIdx, 1)
  await saveCurrentTeam(team.value)
}

// ── 表单提交 ──────────────────────────────────────────
function cancelForm() {
  showForm.value = false
}

async function submitForm() {
  if (formMode.value === 'dept') {
    if (!deptForm.name) { alert('请填写部门名称'); return }
    const dept = JSON.parse(JSON.stringify(deptForm))
    if (!dept.head.id) dept.head.id = 'h_' + Date.now()
    if (editingIndex.value !== null) {
      team.value.departments[editingIndex.value] = dept
    } else {
      team.value.departments.push(dept)
    }
  } else {
    if (!form.name) { alert('请填写姓名'); return }
    const member = { ...form, id: form.id || 'm_' + Date.now() }
    if (formMode.value === 'advisor') {
      editingIndex.value !== null
        ? (team.value.advisors[editingIndex.value] = member)
        : team.value.advisors.push(member)
    } else if (formMode.value === 'presidium') {
      editingIndex.value !== null
        ? (team.value.presidium[editingIndex.value] = member)
        : team.value.presidium.push(member)
    } else if (formMode.value === 'deptHead') {
      team.value.departments[editingDeptIndex.value].head = member
    } else if (formMode.value === 'deptMember') {
      const members = team.value.departments[editingDeptIndex.value].members
      editingIndex.value !== null
        ? (members[editingIndex.value] = member)
        : members.push(member)
    }
  }
  await saveCurrentTeam(team.value)
  cancelForm()
}

// ── 导出 ──────────────────────────────────────────────
function downloadJSON() {
  const data = exportTeam()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'team.json'; a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="max-w-4xl">
    <!-- 页头 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-slate-800">团队管理</h1>
        <p class="text-sm text-slate-500 mt-0.5">当前届：{{ team?.year }}</p>
      </div>
      <button @click="downloadJSON" class="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        导出 JSON
      </button>
    </div>

    <div v-if="!team" class="text-center py-20 text-slate-400">加载中...</div>

    <div v-else>
      <!-- Tab 切换 -->
      <div class="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          v-for="tab in [{ key: 'advisors', label: '指导老师' }, { key: 'presidium', label: '主席团' }, { key: 'departments', label: '各部门' }]"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
          :class="activeTab === tab.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 指导老师 -->
      <div v-if="activeTab === 'advisors'">
        <div class="flex justify-end mb-3">
          <button @click="addAdvisor" class="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            添加
          </button>
        </div>
        <div class="space-y-2">
          <div v-for="(a, i) in team.advisors" :key="a.id" class="member-row">
            <div class="flex-1">
              <p class="text-sm font-medium text-slate-800">{{ a.name }}</p>
              <p class="text-xs text-slate-400">{{ a.title || a.role }}</p>
            </div>
            <div class="flex gap-2">
              <button @click="editAdvisor(i)" class="row-btn">编辑</button>
              <button @click="deleteAdvisor(i)" class="row-btn-danger">删除</button>
            </div>
          </div>
          <p v-if="!team.advisors.length" class="text-sm text-slate-400 py-4 text-center">暂无指导老师</p>
        </div>
      </div>

      <!-- 主席团 -->
      <div v-if="activeTab === 'presidium'">
        <div class="flex justify-end mb-3">
          <button @click="addPresidium" class="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            添加
          </button>
        </div>
        <div class="space-y-2">
          <div v-for="(m, i) in team.presidium" :key="m.id" class="member-row">
            <div class="flex-1">
              <p class="text-sm font-medium text-slate-800">{{ m.name }} <span class="text-primary-600 text-xs ml-1">{{ m.role }}</span></p>
              <p class="text-xs text-slate-400">{{ m.major }} · {{ m.grade }}</p>
            </div>
            <div class="flex gap-2">
              <button @click="editPresidium(i)" class="row-btn">编辑</button>
              <button @click="deletePresidium(i)" class="row-btn-danger">删除</button>
            </div>
          </div>
          <p v-if="!team.presidium.length" class="text-sm text-slate-400 py-4 text-center">暂无主席团成员</p>
        </div>
      </div>

      <!-- 各部门 -->
      <div v-if="activeTab === 'departments'">
        <div class="flex justify-end mb-3">
          <button @click="addDept" class="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            添加部门
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="(dept, di) in team.departments" :key="dept.name" class="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <!-- 部门头部 -->
            <div class="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
              <div>
                <p class="font-semibold text-slate-800">{{ dept.name }}</p>
                <p class="text-xs text-slate-400 mt-0.5">{{ dept.description }}</p>
              </div>
              <div class="flex gap-2">
                <button @click="editDept(di)" class="row-btn">编辑部门</button>
                <button @click="deleteDept(di)" class="row-btn-danger">删除</button>
              </div>
            </div>

            <!-- 部长 -->
            <div class="px-4 py-2 border-b border-slate-50">
              <p class="text-xs text-slate-400 mb-2">部长</p>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-slate-800">{{ dept.head.name || '（未设置）' }}
                    <span v-if="dept.head.role" class="text-xs text-primary-600 ml-1">{{ dept.head.role }}</span>
                  </p>
                  <p v-if="dept.head.major" class="text-xs text-slate-400">{{ dept.head.major }} · {{ dept.head.grade }}</p>
                </div>
                <button @click="editDeptHead(di)" class="row-btn">编辑</button>
              </div>
            </div>

            <!-- 部门成员 -->
            <div class="px-4 py-2">
              <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-slate-400">成员（{{ dept.members.length }}）</p>
                <button @click="addDeptMember(di)" class="text-xs text-primary-600 hover:text-primary-700 font-medium">+ 添加成员</button>
              </div>
              <div class="space-y-1">
                <div v-for="(m, mi) in dept.members" :key="m.id" class="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50">
                  <div>
                    <span class="text-sm text-slate-700">{{ m.name }}</span>
                    <span class="text-xs text-slate-400 ml-2">{{ m.major }} · {{ m.grade }}</span>
                  </div>
                  <div class="flex gap-1.5">
                    <button @click="editDeptMember(di, mi)" class="row-btn">编辑</button>
                    <button @click="deleteDeptMember(di, mi)" class="row-btn-danger">删除</button>
                  </div>
                </div>
                <p v-if="!dept.members.length" class="text-xs text-slate-400 py-1">暂无普通成员</p>
              </div>
            </div>
          </div>
          <p v-if="!team.departments.length" class="text-center py-8 text-slate-400 text-sm">暂无部门</p>
        </div>
      </div>
    </div>

    <!-- 通用表单 Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" @click.self="cancelForm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 class="font-semibold text-slate-800">{{ editingIndex !== null ? '编辑' : '添加' }}{{ formTitle }}</h2>
          <button @click="cancelForm" class="p-1 text-slate-400 hover:text-slate-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- 部门表单 -->
        <div v-if="formMode === 'dept'" class="p-6 space-y-4">
          <div>
            <label class="form-label">部门名称 <span class="text-red-400">*</span></label>
            <input v-model="deptForm.name" type="text" class="form-input" placeholder="例：技术部" />
          </div>
          <div>
            <label class="form-label">部门简介</label>
            <textarea v-model="deptForm.description" class="form-input" rows="2"></textarea>
          </div>
        </div>

        <!-- 成员表单（指导老师 / 主席团 / 部长 / 成员共用） -->
        <div v-else class="p-6 space-y-4">
          <div>
            <label class="form-label">姓名 <span class="text-red-400">*</span></label>
            <input v-model="form.name" type="text" class="form-input" />
          </div>
          <div v-if="formMode !== 'deptMember'">
            <label class="form-label">职位/头衔</label>
            <input v-model="form.role" type="text" class="form-input"
              :placeholder="formMode === 'advisor' ? '副教授，某某学系' : formMode === 'presidium' ? '会长 / 副会长 / 秘书长' : '技术部部长'" />
          </div>
          <div v-if="formMode === 'advisor'">
            <label class="form-label">学术职称</label>
            <input v-model="form.title" type="text" class="form-input" placeholder="副教授，计算机科学与工程学系" />
          </div>
          <div class="grid grid-cols-2 gap-4" v-if="formMode !== 'advisor'">
            <div>
              <label class="form-label">专业</label>
              <input v-model="form.major" type="text" class="form-input" placeholder="计算机科学" />
            </div>
            <div>
              <label class="form-label">年级</label>
              <input v-model="form.grade" type="text" class="form-input" placeholder="大二" />
            </div>
          </div>
          <div v-if="formMode !== 'deptMember' && formMode !== 'deptHead'">
            <label class="form-label">个人简介</label>
            <textarea v-model="form.bio" class="form-input" rows="2"></textarea>
          </div>
          <div>
            <label class="form-label">头像 URL（可选）</label>
            <input v-model="form.avatar" type="url" class="form-input" placeholder="https://..." />
          </div>
        </div>

        <div class="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex gap-3 justify-end">
          <button @click="cancelForm" class="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">取消</button>
          <button @click="submitForm" class="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-label { @apply block text-sm font-medium text-slate-700 mb-1.5; }
.form-input { @apply w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent; }
.member-row { @apply bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center gap-4; }
.row-btn { @apply px-3 py-1 text-xs border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors; }
.row-btn-danger { @apply px-3 py-1 text-xs border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors; }
</style>
