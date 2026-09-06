---
title: Codex 使用过程中我踩过的几个坑
description: 几个真实的踩坑记录，帮你少走弯路。
cover: cover-codex-pitfalls.png
publishDate: 2026-08-26
category: AI 实战
tags:
  - AI
  - Codex
  - 效率
draft: false
---

用了一段时间 Codex，记录几个真实踩过的坑。

## 坑一：网络代理导致的连接失败

本地代理工具开着的时候，CLI 请求可能被拦截或走错出口。表现为莫名超时或证书错误。

解决方法：给终端明确设置代理变量，或者对 API 域名配置直连规则。

## 坑二：认证模式互相冲突

配了第三方中转之后，官方登录态可能覆盖 token 配置，出现「curl 通、CLI 不通」的情况。

```toml
# config.toml 里的 provider 要和认证方式配套
experimental_bearer_token = "sk-..."
```

## 坑三：上下文太长导致质量下降

会话开太久，AI 开始重复犯之前的错误。开新会话、把关键上下文写进项目说明文件，比无限续聊有效。

## 小结

工具本身不难用，难的是环境问题排查。遇到「明明配置对了但不工作」，先怀疑网络和认证，再怀疑工具本身。
