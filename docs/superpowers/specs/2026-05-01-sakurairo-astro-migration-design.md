# Sakurairo → Astro Migration Design

2026-05-01

## Overview

Migrate the Sakurairo WordPress theme to a pure Astro static site. Content lives in a separate repository (markdown + images). No WordPress dependency remains.

## Architecture

- **SSG**: Astro static generation, deployed to any static host
- **Content Collections**: Markdown posts and pages with frontmatter
- **View Transitions**: Astro built-in SPA-like page transitions (replaces PJAX)
- **i18n**: Astro i18n routing (`/zh/`, `/ja/`, `/fr/`)
- **Content repo**: Separate git repo, pulled at build time (git submodule or fetch script)

## Route Structure

```
/                    → Default language homepage
/[lang]/             → Language homepage
/[lang]/posts/[slug]/→ Single post
/[lang]/page/[slug]/ → Static page
/[lang]/about/       → About page (profile + GitHub commits)
/[lang]/links/       → Friends links
/[lang]/archive/     → Post archive by date
/[lang]/bangumi/     → Anime tracking
/[lang]/bilibili/    → Bilibili favorites
/[lang]/videos/      → Followed videos
/[lang]/steam/       → Steam games showcase
/rss.xml             → RSS feed
/sitemap-index.xml   → Sitemap
```

## Content Repository Structure

```
content-repo/
├── posts/
│   ├── zh/
│   │   ├── 2024-01-15-hello-world/
│   │   │   ├── index.md
│   │   │   └── images/
│   │   └── 2024-02-01-another-post.md
│   ├── ja/
│   │   └── 2024-01-15-hello-world.md
│   └── fr/
│       └── 2024-01-15-hello-world.md
├── pages/
│   └── about.md
├── images/
│   └── 2024/01/photo.jpg
└── data/
    └── links.yaml        # Friends links data
```

## Color Palette

### Light Mode
| Role       | Hex       | Usage                       |
|------------|-----------|-----------------------------|
| Background | `#f5f5fa` | Page background             |
| Surface    | `#ffffff` | Cards, containers           |
| Accent     | `#d8e4f8` | Tags, badges, hover states  |
| Primary    | `#7090d0` | Buttons, links, active nav  |
| Text       | `#3e3865` | Body text, headings         |
| Muted      | `#888888` | Secondary text, dates       |

### Dark Mode
| Role       | Hex       | Usage                       |
|------------|-----------|-----------------------------|
| Background | `#1a1a2e` | Page background             |
| Surface    | `#252540` | Cards, containers           |
| Accent     | `#2d2d50` | Tags, badges                |
| Primary    | `#7090d0` | Buttons, links              |
| Text       | `#c8d8f0` | Body text, headings         |
| Muted      | `#aaaaaa` | Secondary text              |

## Component Tree

```
Layout.astro              — Base layout: nav + slot + footer
├── Nav.astro             — Transparent over cover → solid on scroll/other pages
├── Cover.astro           — Full-viewport hero with particles.js + random bg image
├── PostList.astro        — Article list with sticky post support
│   └── PostCard.astro    — Left thumbnail + title + excerpt + meta
├── PostContent.astro     — Single post layout with TOC
│   ├── TableOfContents.astro  — Floating TOC from headings
│   ├── CodeBlock.astro        — Code highlight + copy button
│   └── RelatedPosts.astro     — Same-tag suggestions
├── AboutLayout.astro     — Two-column: profile/stats + GitHub timeline
├── LinksList.astro       — Friend links with site screenshots
├── Sidebar.astro         — Site info widget (days, posts, word count)
├── Footer.astro          — Aplayer embedded + site stats + credits
├── ThemeToggle.astro     — Dark/light switch
├── SearchModal.astro     — Pagefind-powered search overlay
├── CommentSection.astro  — Giscus wrapper
└── CustomPages/
    ├── Bangumi.astro     — Anime list
    ├── Bilibili.astro    — Bilibili favorites
    ├── Videos.astro      — Followed videos
    └── Steam.astro       — Steam game grid
```

## Page Layouts

### Homepage (`/`)
1. **Cover**: Full-viewport `Cover.astro` — random background image from pool + particles.js overlay + site title + scroll-down indicator
2. **Sticky posts**: If any, rendered first with visual distinction (pinned icon)
3. **Post list**: `PostList.astro` → `PostCard.astro` (left 100px thumbnail + title + date + category + excerpt)
4. **Pagination**: Page numbers or load-more

### Single Post (`/[lang]/posts/[slug]/`)
1. Post header (title, date, author, category, tags)
2. Featured image (if present)
3. `TableOfContents.astro` — floating right sidebar on desktop
4. Post body with `CodeBlock.astro` components
5. `RelatedPosts.astro` — 3 related posts by tag
6. `CommentSection.astro` — Giscus

### About (`/[lang]/about/`)
- Left column: avatar + bio + `Sidebar.astro` (site stats)
- Right column: GitHub commit timeline (fetched at build time via GitHub API, cached)
- Commit entries: date, message, hash link

### Links (`/[lang]/links/`)
- Full-width list: each entry has site screenshot thumbnail + name + description
- Data from content repo `data/links.yaml`

### Custom Pages (Bangumi, Bilibili, Steam, etc.)
- Toggleable via site config
- Simple card/list layouts
- Data from content repo `data/` directory

## Features

### Core
- **Dark/Light mode**: CSS custom properties, toggle in nav, respects `prefers-color-scheme`
- **Multi-language**: Astro i18n routing, `zh`/`ja`/`fr`, language switcher in nav
- **Search**: Pagefind — builds static index at build time, zero runtime cost, Chinese-aware
- **Comments**: Giscus — GitHub Discussions backend, auto-syncs dark/light theme
- **Music player**: Aplayer loaded via CDN, embedded in footer

### Content Enhancement
- **TOC**: Auto-generated from h2/h3 headings, floating sidebar on desktop
- **Code highlighting**: Shiki transformer, copy-to-clipboard button per code block
- **Related posts**: Bottom of post, matched by shared tags, limit 3

### Visual
- **Cover**: Random image pool, particles.js effect, blur backdrop
- **View Transitions**: Smooth page-to-page animations via Astro View Transitions API
- **Sticky posts**: Pinned articles at top of homepage with visual indicator

### SEO & Distribution
- **RSS**: `@astrojs/rss`, full content feed
- **Sitemap**: `@astrojs/sitemap`, auto-generated
- **OG Images**: `astro-og-canvas` — auto-generated social share cards per post

### Site Info
- Display in sidebar/widget areas: days running, total posts, total word count
- Calculated at build time from content collections

## Dependencies

### Astro Integrations
- `@astrojs/rss`
- `@astrojs/sitemap`
- `@astrojs/mdx` (if needed)

### Client Libraries (CDN)
- `particles.js` — cover particle effects
- `Aplayer` — music player
- `Pagefind` — search (build-time CLI + client script)
- `Giscus` — comments widget
- `Shiki` — code highlighting (build-time via Astro)

### Optional Packages
- `astro-og-canvas` — OG image generation
- `sharp` — image optimization (Astro default)
- `github-api` data fetch (build-time fetch to GitHub REST API)

## Configuration

Site config file in blog repo (not content repo):

```yaml
# site.config.yaml
site:
  title: "My Blog"
  description: "..."
  defaultLanguage: zh
  languages: [zh, ja, fr]

features:
  bangumi: true
  bilibili: false
  steam: true
  videos: false

cover:
  randomPool: true
  images: [...]

about:
  githubUsername: "..."
  githubRepo: "..."

footer:
  aplayer:
    server: netease
    playlistId: "..."
  upyunCdn: false
```

## Content Repo Integration

Blog repo pulls content repo at build time:
- Option: `git submodule` for version pinning
- Build script copies/links content into `src/content/`
- Images referenced in markdown resolve to content repo paths
- Site config is separate, lives in blog repo under `src/config/`
