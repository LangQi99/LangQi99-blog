# PRD: 博客文章定制化 Landing Page 改造

## 目标

将每一篇博客文章从「Markdown 渲染 + Tailwind prose 容器」的统一模板，改造为**每篇文章都是一个独立的、高级的、有设计感的宣传网站**。文章大意不变，但视觉呈现、排版、交互、动效各篇独立定制，不再是千篇一律的 prose 渲染。

## 核心原则

1. **每篇文章是一个独立 landing page** - 有自己的视觉语言、配色、排版节奏、动效策略
2. **内容不变** - 文章原有观点、代码、图片、段落大意完全保留
3. **RSS 正常工作** - RSS feed 仍能输出文章的纯文本/HTML 内容摘要，订阅者能正常阅读
4. **保持 SEO** - 标题、描述、URL slug 不变，结构化数据保留

## 技术方案

### 架构设计

```
src/content/blog/
  ├── context-is-all-you-need.mdx          # 保留 frontmatter + 纯文本内容（给 RSS 用）
  ├── how-i-gave-agent-unique-abilities.mdx # 同上
  └── ...

src/pages/blog/[...slug].astro             # 路由入口，检测是否有定制布局
src/layouts/
  ├── BaseLayout.astro                      # 不变
  └── blog-custom/                          # 新增：每篇文章的定制布局
      ├── context-is-all-you-need.astro
      ├── how-i-gave-agent-unique-abilities.astro
      ├── github-issues-as-blog.astro
      └── ...
```

### 工作方式

1. **MDX 文件保留** - frontmatter 和纯文本 body 保留，RSS 依赖 `blog.body` 通过 `marked()` 转 HTML，这条链路不动
2. **路由层加载定制布局** - `[...slug].astro` 中检测 `src/layouts/blog-custom/{slug}.astro` 是否存在：
   - 存在 -> 使用定制布局渲染（忽略默认 prose 容器）
   - 不存在 -> fallback 到原有的 `<Content />` prose 渲染
3. **定制布局文件** - 每个 `.astro` 文件是一个完整的 landing page 组件，使用 Tailwind + 原生 HTML + CSS 动画 + 少量 JS，直接硬编码文章内容（因为每篇都是唯一的）

### RSS 兼容性保障

当前 RSS 逻辑（`src/pages/rss.xml.ts`）：
- 读取 `blog.body`（MDX 文件中 frontmatter 之后的原始文本）
- 用 `marked()` 转为 HTML
- 这意味着：只要 MDX 文件的纯文本内容还在，RSS 就正常

**方案**：MDX 文件中保留完整的纯文本 markdown 内容（即使渲染时不使用它），RSS 继续从 `body` 字段读取。定制布局只影响网页端渲染。

### 每篇文章的设计执行方式

**必须使用 subagent + `$design-taste-frontend` skill。**

每篇文章的定制布局由独立的 subagent 完成，subagent 在执行时必须加载 `design-taste-frontend` skill，遵循其完整的 Brief Inference、Three Dials、Pre-Flight Check 流程。不预设任何文章的设计方向，由 subagent 根据文章内容自行推断 Design Read、配色、动效策略。

### 技术细节

**每个定制布局文件的结构**：

```astro
---
// Props 从 [...slug].astro 传入
const { blog, remarkPluginFrontmatter } = Astro.props;
---

<BaseLayout title={blog.data.title} image={blog.data.image}>
  <!-- 完全自定义的 HTML 结构 -->
  <article class="custom-layout-xxx">
    <!-- Hero Section -->
    <section class="...">
      <h1>...</h1>
      <p>...</p>
    </section>

    <!-- Content Sections - 每个段落/章节独立设计 -->
    <section class="...">
      ...
    </section>

    <!-- 保留 License 组件 -->
    <License ... />
  </article>

  <!-- Scoped styles -->
  <style>
    /* 每篇文章独立的样式 */
  </style>

  <!-- 动效脚本 -->
  <script>
    // Intersection Observer / scroll-driven animations
  </script>
</BaseLayout>
```

**使用的技术栈**：
- Astro 组件（`.astro` 文件，零 JS 默认）
- Tailwind CSS（项目已有）
- 原生 CSS 动画 + `@keyframes`
- CSS `scroll-driven animations`（`animation-timeline: view()`）
- 少量原生 JS（IntersectionObserver, 打字机效果等）
- 不引入 React/Motion/GSAP（保持 Astro 零 JS 优势，用原生方案）

**不使用**：
- 不引入新的前端框架
- 不改变 Astro 的 SSG 输出模式
- 不修改 RSS 生成逻辑

## 工作计划

### Phase 1: 基础设施
1. 修改 `[...slug].astro` 路由，支持检测定制布局
2. 创建 `src/layouts/blog-custom/` 目录
3. 验证 RSS 在修改后仍正常工作

### Phase 2: 逐篇定制（按优先级）
1. `how-i-gave-agent-unique-abilities` - 最新文章，优先展示
2. `context-is-all-you-need` - 内容适合做视觉化
3. `github-issues-as-blog` - 开发者受众高
4. 其余文章按时间倒序逐篇完成

### Phase 3: 收尾
1. 全站 RSS 验证
2. 移动端适配检查
3. 性能验证（LCP < 2.5s）

## 约束

- URL 不变：`/blog/{slug}/`
- frontmatter schema 不变
- RSS 输出内容可读（纯文本 markdown 被 marked 转 HTML 后的内容）
- 每篇文章支持深色/浅色模式切换（跟随博客全局主题）
- `prefers-reduced-motion` 尊重无障碍偏好
- 移动端响应式（每个定制布局都必须有 < 768px 的明确降级）

## 验收标准

1. 打开任意一篇有定制布局的文章，视觉上不再是「markdown prose 白底黑字」，而是一个有设计感的独立页面
2. RSS 订阅客户端（如 Feedly、NetNewsWire）能正常显示文章内容
3. 没有定制布局的文章，fallback 到原有渲染，无回归
4. Lighthouse Performance > 90
5. 每篇文章有独立的配色和视觉语言，打开 5 篇文章不会觉得「长一样」
