// API 层：活动数据
// v1：localStorage 优先，初始种子数据来自 JSON 文件
// v2 迁移：将各函数替换为 axios/fetch 调用，组件层无需改动

import seedData from '../data/activities.json'

const KEY = 'aia_activities'

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

export function getActivities() {
  return Promise.resolve(load())
}

export function getActivityById(id) {
  return Promise.resolve(load().find(a => a.id === Number(id)) || null)
}

export function getUpcomingActivities(n = 3) {
  return Promise.resolve(load().filter(a => a.status === 'upcoming').slice(0, n))
}

// ── 写入（Admin 后台）─────────────────────────────────

/** 新增或更新活动（有 id 则更新，无 id 则新增） */
export function saveActivity(activity) {
  const data = load()
  if (activity.id) {
    const idx = data.findIndex(a => a.id === activity.id)
    idx >= 0 ? (data[idx] = activity) : data.push(activity)
  } else {
    data.push({ ...activity, id: Date.now() })
  }
  persist(data)
  return Promise.resolve()
}

export function deleteActivity(id) {
  persist(load().filter(a => a.id !== Number(id)))
  return Promise.resolve()
}

/** 返回当前完整数据，供导出下载 */
export function exportActivities() {
  return load()
}

/** 清除 localStorage，恢复为 JSON 种子数据 */
export function resetActivities() {
  localStorage.removeItem(KEY)
}
