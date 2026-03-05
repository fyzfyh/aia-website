// API 层：项目招募数据
// v1：localStorage 优先，初始种子数据来自 JSON 文件
// v2 迁移：将各函数替换为 axios/fetch 调用，组件层无需改动

import seedData from '../data/projects.json'

const KEY = 'aia_projects'

function load() {
  try {
    const s = localStorage.getItem(KEY)
    return s ? JSON.parse(s) : JSON.parse(JSON.stringify(seedData))
  } catch {
    return JSON.parse(JSON.stringify(seedData))
  }
}

function persist(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

// ── 读取（公开页面）───────────────────────────────────

export function getProjects() {
  return Promise.resolve(load())
}

export function getProjectById(id) {
  return Promise.resolve(load().find(p => p.id === Number(id)) || null)
}

export function getRecruitingProjects(n = 3) {
  return Promise.resolve(load().filter(p => p.status === 'recruiting').slice(0, n))
}

// ── 写入（Admin 后台）─────────────────────────────────

export function saveProject(project) {
  const data = load()
  if (project.id) {
    const idx = data.findIndex(p => p.id === project.id)
    idx >= 0 ? (data[idx] = project) : data.push(project)
  } else {
    data.push({ ...project, id: Date.now() })
  }
  persist(data)
  return Promise.resolve()
}

export function deleteProject(id) {
  persist(load().filter(p => p.id !== Number(id)))
  return Promise.resolve()
}

export function exportProjects() {
  return load()
}

export function resetProjects() {
  localStorage.removeItem(KEY)
}
