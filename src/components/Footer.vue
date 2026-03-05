<template>
  <footer class="bg-slate-800 text-slate-300 mt-auto">
    <div class="page-container py-10">
      <div class="flex flex-col md:flex-row justify-between gap-8">
        <!-- 社团信息 -->
        <div class="max-w-xs">
          <div class="flex items-center gap-3 mb-3">
            <!--
              TODO: 替换 Logo（与 NavBar 同步）
              <img src="/logo.png" alt="AIA Logo" class="h-8 w-auto brightness-0 invert" />
            -->
            <div class="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
              AIA
            </div>
            <span class="font-semibold text-white text-sm">CUHK(SZ) AI Association</span>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            香港中文大学（深圳）人工智能协会，致力于推动校园 AI 知识普及、学术交流与实践探索。
          </p>
        </div>

        <!-- 快速链接 -->
        <div>
          <h4 class="text-white font-medium text-sm mb-3">快速链接</h4>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/activities" class="hover:text-white transition-colors">社团活动</router-link></li>
            <li><router-link to="/team" class="hover:text-white transition-colors">组织架构</router-link></li>
            <li><router-link to="/projects" class="hover:text-white transition-colors">项目招募</router-link></li>
            <li><router-link to="/about" class="hover:text-white transition-colors">关于我们</router-link></li>
          </ul>
        </div>

        <!-- 联系方式 -->
        <div>
          <h4 class="text-white font-medium text-sm mb-3">联系我们</h4>
          <ul class="space-y-2 text-sm">
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <!-- TODO: 替换为真实邮箱 -->
              <span>aiassoc@cuhksz.edu.cn</span>
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.288 1.093h.004c4.947 0 8.977-4.027 8.979-8.977a8.898 8.898 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.462-7.461 7.462m4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393.112-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a9.65 9.65 0 0 0-.429-.008.826.826 0 0 0-.599.28c-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321c.112.15 1.582 2.415 3.832 3.387.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.067-.056-.094-.207-.151-.43-.263"/>
              </svg>
              <!-- TODO: 替换为真实微信公众号 -->
              <span>微信公众号：AIAssocCUHKSZ</span>
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <!-- TODO: 替换为真实 GitHub 链接 -->
              <a href="https://github.com" target="_blank" rel="noopener" class="hover:text-white transition-colors">GitHub</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-slate-700 mt-8 pt-6 text-center text-xs text-slate-500">
        © {{ new Date().getFullYear() }} 香港中文大学（深圳）人工智能协会 · CUHK(SZ) AI Association. All rights reserved.
      </div>
    </div>
  </footer>
</template>
