# 自由行Studio

基于 [Astro](https://astro.build) 的个人博客：极简设计、深浅色模式、完整 SEO（sitemap / RSS / JSON-LD）、移动端适配。

## 本地运行

```bash
npm install
npm run dev      # 开发服务器 http://localhost:4321
npm run build    # 构建到 dist/
npm run check    # 类型检查（应输出 0 errors）
npm run preview  # 预览构建结果
```

## 日常写作

1. 在 `src/content/blog/` 新建 `.md` 文件（文件名即 URL slug）
2. 填写 frontmatter：

```yaml
---
title: 文章标题
description: 一句话摘要（用于列表和 SEO）
publishDate: 2026-09-05
updatedDate: 2026-09-06   # 可选
category: AI 实战          # 必须是 config.ts CATEGORIES 里的 label
tags:
  - AI
  - 网站
cover: cover-xxx.png      # 可选，文件名对应 src/assets/covers/ 下的图
featured: true            # 可选，是否上首页精选
draft: false
---
```

3. 正文直接写 Markdown，支持代码块、图片（放 `src/assets/` 用相对路径引用）

封面图规范：16:9，宽边 ≥ 1200px，jpg/png/webp 均可，放 `src/assets/covers/`。

## 站点配置

**改一处生效全站**：`src/config.ts`

- 站名、副标题、简介、域名（`SITE.url`，部署前必须改成正式域名）
- 联系方式 `CONTACT`：至少填一项，「联系」导航入口会自动出现
- 社交链接 `SOCIAL`、分类 `CATEGORIES`、服务 `SERVICES`

## 部署

纯静态输出，GitHub Pages / Cloudflare Pages / Vercel 均可：

- Build command: `npm run build`
- Output directory: `dist`

部署前确认 `SITE.url` 已是正式域名（影响 canonical / sitemap / RSS / OG）。

## 生成封面 / OG 图（可选）

```bash
node scripts/make-covers.mjs   # 批量生成文章封面
node scripts/make-og.mjs       # 重新生成 OG 分享图
```
