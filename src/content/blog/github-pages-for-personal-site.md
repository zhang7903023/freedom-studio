---
title: GitHub Pages 适不适合普通人做个人网站
description: 免费、稳定、零运维，但也有一些限制。一篇实测分析。
publishDate: 2026-09-05
category: 网站与 SEO
tags:
  - 网站
  - GitHub Pages
  - 部署
draft: false
---

结论先说：**对大多数个人博客，GitHub Pages 够用，而且是很稳的选择。**

## 优点

- 完全免费，自带 HTTPS
- 不用维护服务器，推代码即部署
- 搭配静态站点生成器（Astro、Hugo 等）性能很好

## 限制

- 国内访问速度不稳定，需要自己评估受众
- 不能跑后端逻辑，动态功能要靠第三方服务
- 自定义域名需要额外配置

## 和 Cloudflare Pages 怎么选

| 维度 | GitHub Pages | Cloudflare Pages |
| --- | --- | --- |
| 费用 | 免费 | 免费额度更宽 |
| 国内访问 | 一般 | 相对好一些 |
| 构建灵活性 | 基础 | 支持预览部署 |

## 建议

先在 GitHub Pages 跑起来，等真的遇到访问速度或功能瓶颈再迁移。**先上线，再优化**，反过来做很容易卡死在选型上。
