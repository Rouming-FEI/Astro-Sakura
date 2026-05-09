# 博客内容仓库

将所有文章和图片放在此仓库，与站点代码分离管理。

## 目录结构

```
posts/               # 所有文章（.md 文件）
  hello-world.md

images/              # 所有图片
  posts/             # 文章配图
  cover/             # 封面背景图
```

## 图片引用

### 文章配图

将图片放入 `images/posts/`，在 Markdown 中引用时**去掉 `images/` 前缀**，直接以 `/images/posts/` 开头：

```md
![照片](/images/posts/my-photo.png)
```

> 构建时 `images/` 目录会被复制到站点的 `public/images/`，所以路径以 `/images/` 开头。

### 封面背景图

将背景图放入 `images/cover/`，然后在站点配置文件 `src/config/site.ts` 中添加：

```ts
cover: {
  randomPool: true,
  images: [
    '/images/cover/bg-1.png',
    '/images/cover/bg-2.png',
  ],
}
```

## 文章格式

每篇文章是一个 Markdown 文件，文件名即 URL slug。YAML frontmatter：

```yaml
---
title: "文章标题"              # 必填
date: "2025-06-15"             # 必填，YYYY-MM-DD
updated: "2025-08-20"          # 可选
category: "技术"                # 可选
tags: ["astro", "blog"]        # 可选
excerpt: "手动摘要"             # 可选
thumbnail: "/images/posts/cover.png"  # 可选
pinned: false                  # 可选，置顶
draft: false                   # 可选，草稿
---
```

## 部署

部署时设置环境变量 `CONTENT_REPO` 指向此仓库：

```bash
CONTENT_REPO=https://github.com/用户名/内容仓库.git npm run build
```

构建脚本会自动拉取内容仓库，将文章放入 `src/content/posts/`，图片放入 `public/images/`。
