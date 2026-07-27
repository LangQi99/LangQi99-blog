# Process Log

## 2026-07-27: 博客文章定制化 Landing Page 改造

### 完成情况

全部 17 篇博客文章已完成定制化 landing page 布局改造。

### 做了什么

1. **修改路由层** (`src/pages/blog/[...slug].astro`)
   - 添加 `import.meta.glob` 检测 `src/layouts/blog-custom/{slug}.astro` 是否存在
   - 存在则使用定制布局，不存在则 fallback 到原有 prose 渲染

2. **创建 17 个定制布局文件** (`src/layouts/blog-custom/`)
   - 每篇文章由独立 subagent 完成，遵循 `design-taste-frontend` skill 规则
   - 每篇文章参考不同的产品官网风格（见 `plan.md`）
   - 每篇都有独立的 Design Read、配色、动效策略

3. **构建验证**
   - `astro build` 成功，72 个页面全部正常生成
   - RSS feed 正常输出全部 17 篇文章内容
   - 修复了多个 Astro 模板中 `{}` 被解析为 JSX 表达式的问题（代码块中的 shell 变量、LaTeX 语法、tmux 配置等）

### 改了哪些文件

- `src/pages/blog/[...slug].astro` - 添加定制布局检测逻辑
- `src/layouts/blog-custom/` - 新增 17 个 `.astro` 布局文件
- `prd.md` - 新建需求文档
- `plan.md` - 新建参考网站对照表

### 每篇文章的设计特色

| 文章 | 参考 | 强调色 | 风格 |
|------|------|--------|------|
| how-i-gave-agent-unique-abilities | cursor.com | #22c55e 绿 | 暗色开发工具风 |
| context-is-all-you-need | anthropic.com | #D97706 琥珀 | 研究论文风 |
| github-issues-as-blog | linear.app | #6366f1 靛蓝 | 开发者产品页 |
| docker-starter | railway.app | #2496ED Docker蓝 | 容器化工程风 |
| ai-paper-latex | typst.app | #0D9488 青色 | 学术文档风 |
| LilacCTF-writeup | hackthebox.com | #39FF14 荧光绿 | 黑客终端风 |
| v2raya-xray-setup | tailscale.com | #F97316 橙色 | 网络运维手册 |
| linux-base | pop.system76.com | #48B9C7 青绿 | Linux终端美学 |
| linux-pinyin | warp.dev | #06B6D4 青色 | 现代终端工具 |
| linux-ssh-persist | ghostty.org | #A78BFA 紫罗兰 | 终端模拟器风 |
| python1 | replit.com | #F59E0B 琥珀 | 活泼开发者风 |
| web-starter | vercel.com | #10B981 翡翠绿 | 安全/矩阵风 |
| re1 | binary.ninja | #EF4444 红色 | 逆向工程风 |
| re2 | hex-rays.com | #F97316 橙色 | IDA反汇编风 |
| algorithm-visualization | observablehq.com | #8B5CF6 紫罗兰 | 数据可视化 |
| dlut2025_5_1 | read.cv | #EC4899 粉色 | 竞赛编辑风 |
| tree-complete | excalidraw.com | #14B8A6 青色 | 白板画布风(混合布局) |

### RSS 兼容性

- MDX 文件中的纯文本 body 保持不变
- RSS 从 `blog.body` 读取内容，通过 `marked()` 转 HTML
- 定制布局只影响网页端渲染，RSS 链路完全不受影响
- 验证: `dist/rss.xml` 包含全部 17 篇文章的完整内容

### 遗留问题

- 部分文章的图片引用路径需要在 dev server 中实际验证（特别是 `src/content/blog/image/` 下的相对路径图片）
- `tree-complete` 使用混合布局（自定义 hero + `<Content />` 渲染 MDX 交互组件），需确认交互组件在新布局下正常工作
- 建议逐篇在浏览器中检查移动端适配
