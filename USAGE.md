# Sakurairo Astro 使用说明

## 目录

- [环境要求](#环境要求)
- [快速上手](#快速上手)
- [站点配置](#站点配置)
- [编写文章](#编写文章)
- [内容仓库分离](#内容仓库分离)
- [自定义主题](#自定义主题)
- [页面功能说明](#页面功能说明)
- [部署](#部署)
- [常见问题](#常见问题)

---

## 环境要求

- **Node.js** 18+ （推荐 20 LTS）
- **npm** 9+

## 快速上手

```bash
# 1. 克隆仓库
git clone <你的仓库地址> my-blog
cd my-blog

# 2. 安装依赖
npm install

# 3. 修改站点配置
# 编辑 src/config/site.ts，填写你的站点信息

# 4. 启动开发服务器
npm run dev
# 浏览器访问

# 5. 构建生产版本
npm run build
# 产出在 dist/ 目录
```

## 站点配置

所有可修改的配置集中在 **`src/config/site.ts`** 一个文件内，每个字段均有注释说明。修改后重新构建即可生效。

### 必须修改的项

| 字段            | 说明                                      |
| --------------- | ----------------------------------------- |
| `title`       | 站点名称                                  |
| `description` | 站点简介 / SEO 描述                       |
| `siteUrl`     | 站点完整网址，如 `https://你的域名.com` |
| `author`      | 作者名称                                  |
| `avatar`      | 头像图片路径                              |

### 可选功能

| 字段                  | 说明             |
| --------------------- | ---------------- |
| `features.bangumi`  | 追番页面         |
| `features.bilibili` | B站收藏页面      |
| `features.steam`    | Steam 游戏库页面 |
| `features.videos`   | 追剧页面         |

关闭不需要的功能可隐藏对应页面和导航入口。

### 第三方服务配置

**评论系统 (Giscus)**：在 `giscus` 中填入你的 GitHub 仓库信息和 Discussions ID。`repoId` / `categoryId` 从 [giscus.app](https://giscus.app) 获取。留空则不渲染评论区。

**Steam 游戏库**：在 `steam` 中填入 [Steam API Key](https://steamcommunity.com/dev/apikey) 和 64 位 Steam ID。

**追番**：`bangumi.source` 可选 `bilibili`、`bangumi`（bgm.tv）、`mal`（MyAnimeList），填入对应的 UID 或用户名。

---

## 编写文章

### 文章图片

文章图片有两种管理方式：

**方式一（推荐）：放入内容仓库**

将图片放入内容仓库的 `images/posts/` 目录，在 Markdown 中以 `/images/posts/` 路径引用：

```md
![照片](/images/posts/my-photo.png)
```

构建时图片会自动同步到 `public/images/posts/`。

**方式二：直接放入站点 `public/`**

将图片放入站点的 `public/images/posts/` 目录，引用路径同上。适合不用内容仓库的场景。

### 创建文章

在 `src/content/posts/` 下创建 `.md` 文件，**文件名即 URL slug**（建议用英文短横线命名）。

```md
---
title: "文章标题"
date: "2024-06-15"
updated: "2024-08-20"
category: "技术"
tags: ["astro", "前端", "博客"]
excerpt: "手动摘要，不填则自动截取正文前 120 字"
thumbnail: "/images/posts/my-post-cover.png"
pinned: false
draft: false
---

正文内容（Markdown）...
```

### Frontmatter 字段参考

| 字段          | 类型     | 必填         | 默认值    | 说明                                             |
| ------------- | -------- | ------------ | --------- | ------------------------------------------------ |
| `title`     | string   | **是** | -         | 文章标题                                         |
| `date`      | string   | **是** | -         | 发布日期，`YYYY-MM-DD` 或 `YYYY-MM-DD HH:MM` |
| `updated`   | string   | 否           | -         | 最后更新日期                                     |
| `category`  | string   | 否           | -         | 分类名称，点击跳转分类页筛选                     |
| `tags`      | string[] | 否           | `[]`    | 标签数组                                         |
| `excerpt`   | string   | 否           | 自动截取  | 手动设置摘要                                     |
| `thumbnail` | string   | 否           | -         | 缩略图路径，如 `/images/posts/cover.png` |
| `pinned`    | boolean  | 否           | `false` | 置顶，显示在文章列表最前                         |
| `draft`     | boolean  | 否           | `false` | 草稿，`true` 时不渲染                          |

### 文章内可用特性

- **代码块**：200+ 语言语法高亮，代码块右上角悬停显示复制按钮
- **数学公式**：KaTeX 渲染，行内 `$E=mc^2$`，块级 `$$...$$`
- **图片**：自适应宽度 + 圆角，支持 alt 文本
- **表格**：斑马纹样式
- **引用块**：紫色左边框 + 浅色背景
- **链接卡片**：外部链接自动显示预览卡片

---

## 内容仓库分离

如果希望将文章内容和站点代码分开管理，可以使用独立的内容仓库。**文章和图片全部放在内容仓库中**，站点代码只保留主题和配置。

### 内容仓库结构

```
posts/               # 所有文章（.md 文件）
images/
  posts/             # 文章配图
  cover/             # 封面背景图
```

### 创建内容仓库

1. 新建一个 Git 仓库（如 `my-blog-content`）
2. 将 `content-template/` 目录中的内容复制过去
3. 按需添加文章到 `posts/`，图片到 `images/`

### 图片路径

| 用途 | 放入目录 | 引用路径 |
|------|----------|----------|
| 文章配图 | `images/posts/` | `/images/posts/xxx.png` |
| 文章缩略图 | `images/posts/` | `/images/posts/xxx.png` |
| 封面背景图 | `images/cover/` | `/images/cover/xxx.png` |

### 部署时拉取

部署时设置环境变量 `CONTENT_REPO`：

```bash
CONTENT_REPO=https://github.com/用户名/内容仓库.git npm run build
```

构建脚本 `scripts/fetch-content.sh` 会自动：
1. Clone 内容仓库到 `.content-cache/`
2. 同步 `posts/` → `src/content/posts/`
3. 同步 `images/` → `public/images/`

> 本地开发时不设置 `CONTENT_REPO`，直接使用 `src/content/posts/` 和 `public/images/` 中的文件，两边互不冲突。

---

## 自定义主题

### 配色

编辑 `src/styles/variables.css`：

```css
:root {
  /* 日间模式 */
  --bg: rgba(235, 238, 250, 0.65);   /* 页面背景（透明度影响背景图可见度） */
  --surface: #ffffff;                  /* 卡片 / 导航底色 */
  --accent: #eae7f6;                  /* 标签 / 代码背景 */
  --primary: #7595e8;                 /* 主色调（链接、按钮、强调） */
  --primary-hover: #5f80db;
  --text: #383360;                    /* 正文颜色 */
  --text-muted: #9590bd;              /* 次要文字 */
  --border: #e0ddf0;                  /* 边框颜色 */
}

html.dark {
  /* 夜间模式（覆盖上方变量） */
}
```

### 字体

在 `src/config/site.ts` 的 `fonts` 中修改即可，支持所有 Google Fonts 上可用的字体。格式为字体名称，空格无需转义（如 `'Noto Serif SC'`）。

### 背景图

1. 将背景图放入内容仓库的 `images/cover/`（或站点 `public/images/cover/`）
2. 在 `src/config/site.ts` 的 `cover.images` 中添加路径
3. 设 `cover.randomPool: true` 则每次随机选取一张

```ts
cover: {
  randomPool: true,
  images: [
    '/images/cover/bg-1.png',
    '/images/cover/bg-2.png',
  ],
}
```

---

## 页面功能说明

### 首页 (`/`)

- 全屏封面（背景图 + 粒子动画 + 打字机效果副标题）
- 向下箭头引导滚动
- 文章列表（置顶文章优先，其余按日期倒序）
- 分页加载

### 搜索 (`/search`)

- 客户端全文搜索，无需后端
- 搜索范围：标题、摘要、标签
- 结果以卡片形式展示，关键词下划线高亮

### 分类 / 标签 (`/categories`)

- 按分类、标签、年份筛选文章
- 支持组合筛选（如 `?category=前端&year=2024`）

### 归档 (`/archive`)

- 按年份分组展示所有文章

### 关于 (`/about`)

- 作者信息（头像、名称、简介）
- 站点统计（文章数、字数、运行天数）
- GitHub 最近提交时间线

### 友链 (`/links`)

- 显示在 `siteConfig.links` 中配置的友链列表

### RSS (`/rss.xml`)

- 自动生成 RSS 2.0 订阅源

---

## 部署

构建产物在 `dist/` 目录，可部署到任意静态托管服务。

### Cloudflare Pages

| 配置项           | 值                  |
| ---------------- | ------------------- |
| Build command    | `npx astro build` |
| Output directory | `dist`            |

### Vercel

直接导入 Git 仓库，自动检测 Astro 项目框架。

### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [master]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 其他平台 (Netlify / 腾讯云 等)

构建命令 `npm run build`，发布目录 `dist`。

---

## 常见问题

**Q: 开发服务器启动后页面空白？**
A: 检查 `src/content/posts/` 下是否有至少一篇 `draft: false` 的文章。

**Q: 搜索结果为空？**
A: 搜索依赖 `/search-index.json`，构建时自动生成。开发模式下直接访问 `/search-index.json` 确认是否可访问。

**Q: 修改配置后不生效？**
A: `src/config/site.ts` 修改后需要重新运行 `npm run dev` 或 `npm run build`。

**Q: 文章图片不显示？**
A: 所有静态资源放在 `public/` 目录下，引用路径为 `/` 开头，如 `/images/posts/cover.png`。

**Q: 字体不生效？**
A: 确保字体名在 [Google Fonts](https://fonts.google.com/) 上存在，名称拼写完全一致。

**Q: Giscus 评论不显示？**
A: 检查 `repoId` 和 `categoryId` 是否正确（注意是 ID 而非名称），仓库需开启 Discussions 功能。
