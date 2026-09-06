---
title: 给博客绑上自己的域名：Cloudflare + GitHub Pages 实录
description: 从买域名到 HTTPS 证书生效，全程只花了不到半小时，中间还踩了一个证书卡死的坑。
cover: cover-cloudflare-domain.png
publishDate: 2026-08-30
category: 网站与 SEO
tags:
  - 域名
  - Cloudflare
  - GitHub Pages
featured: true
draft: false
---

GitHub Pages 默认送一个 `xxx.github.io` 的地址，能用，但不像「自己的网站」。这篇记录我给博客换上自有域名的全过程，以及中间踩的那个证书坑。

## 为什么选 Cloudflare 管 DNS

不是因为别的，就两条：

1. 免费套餐够用，DNS 解析速度快
2. 改记录即时生效，不用等 registrar 那边慢吞吞地同步

域名本身在哪买的都行，把 DNS 服务器指到 Cloudflare 就好。

## 具体配置（就 5 条记录）

在 Cloudflare 的 DNS 面板里加：

- **A 记录 ×4**：`@` 指向 `185.199.108.153` ~ `185.199.111.153`（GitHub Pages 的四个固定 IP）
- **CNAME 记录**：`www` 指向 `你的用户名.github.io`

关键点：这些记录的代理状态要选**仅 DNS（灰色云朵）**。开了橙色云朵（CDN 代理），GitHub 没法给你签证书，HTTPS 会一直转圈。

然后仓库里加一个 `CNAME` 文件，内容就一行：你的域名。GitHub 仓库设置里的 Pages 页面填上自定义域名，等签发。

## 踩坑：HTTPS 证书卡死

我的证书状态卡在「/null」，等了一个多小时都不签发。最后有效的解法：

1. 删掉 Pages 站点，重新 Create
2. 重新触发部署工作流

重建后几分钟内证书就签下来了。这类状态损坏在 Pages 上不算罕见，遇到卡死别傻等，直接重建。

## 换完之后

- 旧 `github.io` 地址会自动 301 到新域名，老链接不丢
- HTTPS 全站生效，搜索引擎收录用的是新域名
- 全程没花一分钱托管费，只有域名本身的年费

普通人做个人网站，这条链路（Astro + GitHub Pages + Cloudflare DNS）目前是我用过性价比最高的组合。
