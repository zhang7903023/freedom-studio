---
title: iOS 免越狱侧载实录：SideStore 从装到能用
description: 不越狱、不掏开发者账号年费，让 iPhone 装上商店里没有的 App。踩坑过程全记录。
cover: cover-sidestore.png
publishDate: 2026-09-05
category: 数码折腾
tags:
  - iOS
  - 侧载
  - 折腾
featured: false
draft: false
---

iOS 的封闭性劝退过我很多次，但这回认真折腾了一圈免越狱侧载，把能跑通的路径都试了一遍。结论先行：**能成，但有代价**。

## 为什么是 SideStore

免越狱侧载常见三条路：

1. **Sideloadly**：电脑端签名工具，7 天签一次，手机连电脑操作
2. **AltStore**：需要同一 Wi-Fi 下电脑常开，手机端定期刷新
3. **SideStore**：AltStore 的分支，签名刷新在手机上自己完成，不依赖电脑

对不想天天插线的人来说，SideStore 是体验最好的那条路。

## 安装过程

- 电脑端装 SideServer（或 Sideloadly），用普通 Apple ID 给 SideStore 本体签名
- 首次安装要在设置里信任开发者证书
- 装 SideStore 的时候会提示一并装一个虚拟 VPN 描述文件，别慌，它不走流量，只是用来在后台触发刷新的

普通免费 Apple ID 的限制：最多同时签 3 个 App、单个 App 7 天有效期。SideStore 的价值就是手机端自动续签，只要偶尔打开一下 App，签名就续上了。

## 实际体验

- 常用工具类 App（第三方客户端、调试工具）都能正常装、正常跑
- 需要 JIT 的应用要额外开调试权限，步骤多几步但也能免越狱实现
- 最大的坑是**证书掉签**：Apple 免费证书偶尔抽风大面积失效，只能等 SideStore 社区出方案

## 值不值得

如果你只是想装一两个商店没有的工具，值得，一次配置后基本无感。如果想装一堆，7 天签名和 3 App 上限会持续烦你。花 99 刀开开发者账号是终极解法，但那是另一个故事了。

折腾的意义不在于省那点钱，在于知道这条路通到哪里。
