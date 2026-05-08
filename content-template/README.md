# 博客内容仓库模板

将此目录作为独立的 Git 仓库管理，文章与站点代码分离。

## 目录结构

```
posts/          # 所有文章（.md 文件）
  hello-world.md
```

## 文章格式

每篇文章是一个 Markdown 文件，文件名即 URL slug。文件头部为 YAML frontmatter：

```yaml
---
title: "文章标题"           # 必填
date: "2024-06-15"          # 必填，YYYY-MM-DD 或 YYYY-MM-DD HH:MM
updated: "2024-08-20"       # 可选，最后更新日期
category: "前端"             # 可选，分类名
tags: ["astro", "blog"]     # 可选，标签数组
excerpt: "手动摘要"          # 可选，不填则自动截取
thumbnail: "/images/posts/cover.png"  # 可选，缩略图
pinned: false               # 可选，是否置顶（默认 false）
draft: false                # 可选，草稿不发布（默认 false）
---
```

## 使用方式

1. 创建内容仓库（如 `my-blog-content`）
2. 将 `posts/` 目录中的所有 `.md` 文件替换为自己的文章
3. 部署站点时设置环境变量：

```bash
CONTENT_REPO=https://github.com/你的用户名/你的内容仓库.git npm run build
```

站点构建脚本会自动拉取内容仓库到 `src/content/` 并构建。
