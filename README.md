# 香港中文大学（深圳）人工智能协会官方网站

**CUHK(SZ) AI Association — Official Portal Website**

> 社团门户网站，提供活动展示、组织架构、项目招募功能，并附带内容管理后台。

线上地址：`https://fyzfyh.github.io/aia-website/`
后台入口：线上地址 + `#/admin/login`

---

## 目录

- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [本地开发](#本地开发)
- [内容更新流程](#内容更新流程)
- [管理后台使用](#管理后台使用)
- [部署说明](#部署说明)
- [分支与协作规范](#分支与协作规范)
- [未来扩展指引](#未来扩展指引)

---

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue 3 + `<script setup>` | ^3.x |
| 构建工具 | Vite | ^7.x |
| 路由 | Vue Router 4（Hash 模式） | ^4.x |
| 状态管理 | Pinia | ^2.x |
| 样式 | Tailwind CSS | ^3.x |
| 数据存储 | 本地 JSON 文件 + localStorage | — |
| 部署 | GitHub Pages + GitHub Actions | — |

---

## 项目结构

```
aia-website/
├── public/                    # 静态资源（logo.png 放这里）
├── src/
│   ├── api/                   # 数据访问层（v2 换后端只改这里）
│   │   ├── activities.js      #   活动：读写 localStorage / JSON
│   │   ├── team.js            #   团队：读写 localStorage / JSON
│   │   └── projects.js        #   项目：读写 localStorage / JSON
│   │
│   ├── data/                  # 内容种子数据（JSON 文件，部署时用）
│   │   ├── activities.json    #   ← 更新内容后替换此文件
│   │   ├── team.json
│   │   └── projects.json
│   │
│   ├── components/            # 通用组件
│   │   ├── NavBar.vue
│   │   ├── Footer.vue
│   │   ├── ActivityCard.vue   #   支持微信公众号推文外链
│   │   ├── MemberCard.vue     #   full / compact 两种模式
│   │   └── ProjectCard.vue
│   │
│   ├── views/                 # 页面
│   │   ├── Home.vue
│   │   ├── Activities.vue
│   │   ├── ActivityDetail.vue
│   │   ├── Team.vue
│   │   ├── Projects.vue
│   │   ├── ProjectDetail.vue
│   │   ├── About.vue
│   │   └── admin/             # 管理后台（PIN 保护）
│   │       ├── Login.vue
│   │       ├── AdminLayout.vue
│   │       ├── Dashboard.vue
│   │       ├── ActivitiesAdmin.vue
│   │       ├── TeamAdmin.vue
│   │       └── ProjectsAdmin.vue
│   │
│   ├── router/index.js        # 路由定义 + 后台鉴权守卫
│   ├── stores/
│   │   ├── admin.js           # PIN 认证状态
│   │   └── user.js            # 预留：成员登录（暂未启用）
│   ├── App.vue
│   ├── main.js
│   └── style.css              # Tailwind + 全局样式
│
├── .github/workflows/
│   └── deploy.yml             # 推送 main 分支自动部署到 GitHub Pages
├── .env.example               # 环境变量示例
├── vite.config.js             # base = '/aia-website/'
└── tailwind.config.js
```

---

## 本地开发

**环境要求：** Node.js ≥ 18

```bash
# 1. 克隆仓库
git clone https://github.com/<用户名>/aia-website.git
cd aia-website

# 2. 安装依赖
npm install

# 3. 复制环境变量文件并设置管理员 PIN
cp .env.example .env.local
# 编辑 .env.local，修改 VITE_ADMIN_PIN 为自定义值

# 4. 启动开发服务器
npm run dev
# 访问 http://localhost:5173/
```

其他命令：

```bash
npm run build    # 生产构建（输出到 dist/）
npm run preview  # 本地预览构建产物
```

---

## 内容更新流程

本项目采用 **「后台编辑 → 导出 JSON → 提交部署」** 的内容管理模式。

### 日常更新（推荐）

```
1. 访问后台 → 编辑内容（活动 / 成员 / 项目）
2. 概览页点击「导出全部 JSON」→ 下载三个文件
3. 将文件替换到 src/data/ 目录
4. git add src/data/ && git commit -m "content: 更新XXX"
5. git push origin main → 自动部署（约 1 分钟）
```

### 直接编辑 JSON（技术成员）

也可以直接编辑 `src/data/` 下的 JSON 文件。各字段说明：

**`activities.json` 字段**

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | number | 唯一 ID，勿重复 |
| `title` | string | 活动标题 |
| `date` | string | 开始日期 `YYYY-MM-DD` |
| `endDate` | string | 结束日期（可选） |
| `location` | string | 活动地点 |
| `category` | string | `工作坊` / `讲座` / `竞赛` / `社交` |
| `status` | string | `upcoming` / `ongoing` / `past` |
| `cover` | string | 封面图 URL（可空） |
| `wxArticleUrl` | string | 微信公众号推文链接（填写后卡片点击跳外链） |
| `description` | string | 活动简介 |
| `images` | array | 图片集 URL 数组 |

**`projects.json` 字段**

| 字段 | 类型 | 说明 |
|------|------|------|
| `status` | string | `recruiting` / `ongoing` / `closed` |
| `type` | string | `科研` / `实习` / `竞赛` |
| `requirements` | array | 每条要求为一个字符串 |
| `tags` | array | 技术标签 |
| `applyUrl` | string | 报名链接（可空，空时显示邮件咨询） |

---

## 管理后台使用

访问路径：`网站地址/#/admin/login`

**PIN 码**：联系当前技术负责人获取（存储在 GitHub Secrets `VITE_ADMIN_PIN`）。

| 功能 | 说明 |
|------|------|
| 活动管理 | 增删改活动，可设置微信推文链接 |
| 团队管理 | 管理指导老师、主席团、各部门及成员（Tab 切换） |
| 项目管理 | 增删改招募项目，要求按行输入，标签逗号分隔 |
| 概览 / 导出 | 一键导出三份 JSON；重置为代码中的初始数据 |

> **注意**：后台数据保存在**当前浏览器 localStorage**，换浏览器或换设备不共享。
> 编辑完成后务必导出 JSON 并提交到仓库，否则部署后数据会丢失。

---

## 部署说明

推送到 `main` 分支时，GitHub Actions 自动执行构建并发布到 GitHub Pages。

**首次配置步骤：**

1. 仓库 → Settings → Pages → Source 选 **GitHub Actions**
2. 仓库 → Settings → Secrets → Actions → 添加 `VITE_ADMIN_PIN`
3. 修改 `.github/workflows/deploy.yml` 的 Build 步骤，注入 PIN：
   ```yaml
   - name: Build
     run: npm run build
     env:
       VITE_ADMIN_PIN: ${{ secrets.VITE_ADMIN_PIN }}
   ```

**如果更换仓库名**，同步修改 `vite.config.js` 中的 `base`：

```js
base: '/新仓库名/',
```

---

## 分支与协作规范

```
main    ← 保护分支，禁止直接 push，只接受 PR 合并，合并后自动部署
dev     ← 日常开发集成分支
```

**分支命名**

| 类型 | 格式 | 示例 |
|------|------|------|
| 新功能 | `feat/描述` | `feat/新闻公告模块` |
| Bug 修复 | `fix/描述` | `fix/移动端导航折叠` |
| 内容更新 | `content/描述` | `content/2026秋季招募` |
| 样式调整 | `style/描述` | `style/首页Banner优化` |

**标准工作流**

```bash
git checkout dev
git pull origin dev
git checkout -b feat/你的功能名

# ... 开发 ...

git add .
git commit -m "feat: 简短描述"
git push origin feat/你的功能名
# 在 GitHub 上提 Pull Request → dev → 审核 → 合并
# dev 测试稳定后，再 PR 合并到 main 触发部署
```

**Commit 消息规范**

| 前缀 | 含义 |
|------|------|
| `feat:` | 新功能 |
| `fix:` | Bug 修复 |
| `content:` | 内容数据更新 |
| `style:` | 样式调整 |
| `refactor:` | 代码重构 |
| `docs:` | 文档更新 |

---

## 未来扩展指引

当社团规模扩大、需要多端同步内容时，可按以下路径升级：

### v2：接入真实后端

所有数据读写均通过 `src/api/` 层，**只需修改 api 文件的函数体**，所有页面组件无需改动：

```js
// 将 api/activities.js 中的 load() 替换为：
const res = await axios.get('/api/activities')
return res.data
```

推荐后端方案：Node.js (Express/Hono) + SQLite / Supabase（免费托管）

### v3：成员登录与权限控制

`src/stores/user.js` 已预留登录状态结构，路由 meta 已有 `requiresAuth` 扩展点，可在此基础上实现：
- 微信/GitHub OAuth 登录
- 成员可见的内部资料页
- 管理员角色分级（超管 / 内容编辑）

### Logo 替换

1. 将 Logo 图片放入 `public/logo.png`
2. 搜索项目中所有 `TODO: 替换 Logo` 注释，按注释说明替换占位块

---

## 联系方式

如有问题请联系当前技术负责人，或发邮件至社团邮箱。
Issues 和 PR 欢迎提交到本仓库。
