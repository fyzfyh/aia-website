// API 层：团队组织架构数据
// v1：localStorage 优先，初始种子数据来自 JSON 文件
// v2 迁移：将各函数替换为 axios/fetch 调用，组件层无需改动

import seedData from '../data/team.json'

const KEY = 'aia_team'

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

export function getCurrentTeam() {
  return Promise.resolve(load().terms.find(t => t.current) || null)
}

export function getAllTerms() {
  return Promise.resolve(load().terms.map(t => ({ year: t.year, current: t.current })))
}

export function getTeamByTerm(year) {
  return Promise.resolve(load().terms.find(t => t.year === year) || null)
}

// ── 写入（Admin 后台）─────────────────────────────────

/** 保存当前届完整数据（整体替换） */
export function saveCurrentTeam(teamData) {
  const root = load()
  const idx = root.terms.findIndex(t => t.current)
  if (idx >= 0) root.terms[idx] = { ...teamData, current: true }
  persist(root)
  return Promise.resolve()
}

export function exportTeam() {
  return load()
}

export function resetTeam() {
  localStorage.removeItem(KEY)
}
