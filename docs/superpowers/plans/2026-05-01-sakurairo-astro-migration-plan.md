# Sakurairo → Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pure Astro static blog site replicating Sakurairo's design with soft blue-purple theme, i18n, search, comments, and custom pages.

**Architecture:** Astro SSG with Content Collections for posts/pages, View Transitions for SPA-like navigation, CSS custom properties for theming, and CDN-loaded client libraries (particles.js, Aplayer, Giscus, Pagefind). Content lives in a separate repo, pulled at build time.

**Tech Stack:** Astro 5, TypeScript, CSS custom properties, Pagefind, Giscus, particles.js, Aplayer, GitHub REST API

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `astro.config.ts`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`

- [ ] **Step 1: Initialize project**

```bash
mkdir -p src/styles src/components src/layouts src/pages src/lib src/config src/content src/types
npm init -y
npm install astro @astrojs/rss @astrojs/sitemap sharp
npm install -D @types/node typescript
```

- [ ] **Step 2: Write `astro.config.ts`**

```ts
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com',
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'ja', 'fr'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  vite: {
    css: {
      preprocessorMaxWorkers: true,
    },
  },
});
```

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 4: Write `src/env.d.ts`**

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 5: Install and verify**

```bash
npx astro build --dry-run
```

---

### Task 2: Theme System (CSS Custom Properties)

**Files:**
- Create: `src/styles/variables.css`
- Create: `src/styles/global.css`
- Create: `src/styles/code.css`

- [ ] **Step 1: Write `src/styles/variables.css`**

```css
:root {
  /* Light mode */
  --bg: #f5f5fa;
  --surface: #ffffff;
  --accent: #d8e4f8;
  --primary: #7090d0;
  --primary-hover: #5a7abf;
  --text: #3e3865;
  --text-muted: #888888;
  --border: #e0e0e8;
  --shadow: 0 1px 3px rgba(62, 56, 101, 0.08);

  --nav-height: 60px;
  --content-width: 780px;
  --sidebar-width: 240px;
  --radius: 8px;

  --font-serif: 'Noto Serif SC', serif;
  --font-sans: 'Noto Sans SC', system-ui, sans-serif;
  --font-mono: 'Fira Code', monospace;

  --cover-gradient: linear-gradient(135deg, #667eea, #764ba2);
}

html.dark {
  --bg: #1a1a2e;
  --surface: #252540;
  --accent: #2d2d50;
  --primary: #7090d0;
  --primary-hover: #8aa5e0;
  --text: #c8d8f0;
  --text-muted: #aaaaaa;
  --border: #3a3a58;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

@media (prefers-color-scheme: dark) {
  html:not(.light) {
    --bg: #1a1a2e;
    --surface: #252540;
    --accent: #2d2d50;
    --text: #c8d8f0;
    --text-muted: #aaaaaa;
    --border: #3a3a58;
    --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  background: var(--bg);
  color: var(--text);
  transition: background-color 0.3s, color 0.3s;
}

a {
  color: var(--primary);
  text-decoration: none;
}
a:hover {
  color: var(--primary-hover);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-serif);
  color: var(--text);
  line-height: 1.4;
}
```

- [ ] **Step 2: Write `src/styles/code.css`**

```css
pre {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  position: relative;
}

pre code {
  font-family: var(--font-mono);
}

.copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--accent);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.75rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}
pre:hover .copy-btn {
  opacity: 1;
}
```

- [ ] **Step 3: Write `src/styles/global.css`** — import all CSS files

```css
@import './variables.css';
@import './code.css';
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: scaffold project with theme system"
```

---

### Task 3: i18n Infrastructure

**Files:**
- Create: `src/i18n/zh.ts`
- Create: `src/i18n/ja.ts`
- Create: `src/i18n/fr.ts`
- Create: `src/i18n/utils.ts`

- [ ] **Step 1: Write `src/i18n/zh.ts`**

```ts
export default {
  home: '首页',
  about: '关于',
  links: '友链',
  archive: '归档',
  search: '搜索',
  searchPlaceholder: '想找些什么？',
  lightMode: '浅色模式',
  darkMode: '深色模式',
  posts: '文章列表',
  pinned: '置顶',
  noPosts: '暂无文章',
  previous: '上一篇',
  next: '下一篇',
  toc: '目录',
  comments: '评论',
  relatedPosts: '相关文章',
  readMore: '阅读更多',
  viewAll: '查看全部',
  days: '天',
  articles: '篇',
  words: '字',
  runningDays: '运行天数',
  totalPosts: '文章总数',
  totalWords: '总字数',
  recentCommits: '最近提交',
  randomBg: '随机背景',
  scrollDown: '向下滚动',
  allRightsReserved: '版权所有',
  poweredBy: '由 Astro 驱动',
  langSwitch: '切换语言',
};
```

- [ ] **Step 2: Write `src/i18n/ja.ts`**

```ts
export default {
  home: 'ホーム',
  about: '概要',
  links: 'リンク',
  archive: 'アーカイブ',
  search: '検索',
  searchPlaceholder: '何か探していますか？',
  lightMode: 'ライトモード',
  darkMode: 'ダークモード',
  posts: '記事一覧',
  pinned: 'ピン留め',
  noPosts: '記事がありません',
  previous: '前へ',
  next: '次へ',
  toc: '目次',
  comments: 'コメント',
  relatedPosts: '関連記事',
  readMore: '続きを読む',
  viewAll: 'すべて見る',
  days: '日',
  articles: '記事',
  words: '字',
  runningDays: '運営日数',
  totalPosts: '記事総数',
  totalWords: '総文字数',
  recentCommits: '最近のコミット',
  randomBg: 'ランダム背景',
  scrollDown: 'スクロール',
  allRightsReserved: 'All Rights Reserved',
  poweredBy: 'Astroで構築',
  langSwitch: '言語切替',
};
```

- [ ] **Step 3: Write `src/i18n/fr.ts`**

```ts
export default {
  home: 'Accueil',
  about: 'À propos',
  links: 'Liens',
  archive: 'Archives',
  search: 'Rechercher',
  searchPlaceholder: 'Vous cherchez quelque chose ?',
  lightMode: 'Mode clair',
  darkMode: 'Mode sombre',
  posts: 'Articles',
  pinned: 'Épinglé',
  noPosts: 'Aucun article',
  previous: 'Précédent',
  next: 'Suivant',
  toc: 'Table des matières',
  comments: 'Commentaires',
  relatedPosts: 'Articles similaires',
  readMore: 'Lire plus',
  viewAll: 'Voir tout',
  days: 'jours',
  articles: 'articles',
  words: 'mots',
  runningDays: 'Jours en ligne',
  totalPosts: 'Total articles',
  totalWords: 'Total mots',
  recentCommits: 'Commits récents',
  randomBg: 'Fond aléatoire',
  scrollDown: 'Défiler',
  allRightsReserved: 'Tous droits réservés',
  poweredBy: 'Propulsé par Astro',
  langSwitch: 'Changer de langue',
};
```

- [ ] **Step 4: Write `src/i18n/utils.ts`**

```ts
import zh from './zh';
import ja from './ja';
import fr from './fr';

const dictionaries = { zh, ja, fr };
type Lang = keyof typeof dictionaries;

export function getDict(lang: string): typeof zh {
  return dictionaries[lang as Lang] ?? dictionaries.zh;
}

export const locales = ['zh', 'ja', 'fr'] as const;
export const defaultLocale = 'zh';

export function getLangFromUrl(url: URL): string {
  const [, lang] = url.pathname.split('/');
  return locales.includes(lang as (typeof locales)[number]) ? lang : defaultLocale;
}

export function useTranslations(lang: string) {
  return getDict(lang);
}

export function localizedPath(path: string, lang: string): string {
  const clean = path.replace(/^\//, '');
  return `/${lang}/${clean}`;
}
```

- [ ] **Step 5: Commit**

```bash
git add src/i18n && git commit -m "feat: add i18n dictionaries and utilities"
```

---

### Task 4: Site Configuration

**Files:**
- Create: `src/config/site.ts`

- [ ] **Step 1: Write `src/config/site.ts`**

```ts
export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  authorBio: string;
  avatar: string;
  defaultLanguage: 'zh' | 'ja' | 'fr';
  languages: Array<'zh' | 'ja' | 'fr'>;
  startDate: string; // ISO date for site age calculation
  features: {
    bangumi: boolean;
    bilibili: boolean;
    steam: boolean;
    videos: boolean;
  };
  cover: {
    randomPool: boolean;
    images: string[];
  };
  about: {
    githubUsername: string;
    githubRepo: string;
  };
  footer: {
    aplayer: {
      enabled: boolean;
      server: string;
      playlistId: string;
      preload: string;
      order: string;
      volume: number;
    };
    upyunCdn: boolean;
  };
  giscus: {
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
  };
}

export const siteConfig: SiteConfig = {
  title: 'My Blog',
  description: 'A personal blog built with Astro',
  author: 'Author Name',
  authorBio: 'A short bio about the author.',
  avatar: '/avatar.png',
  defaultLanguage: 'zh',
  languages: ['zh', 'ja', 'fr'],
  startDate: '2024-01-01',
  features: {
    bangumi: true,
    bilibili: true,
    steam: true,
    videos: true,
  },
  cover: {
    randomPool: true,
    images: ['/images/cover/default.webp'],
  },
  about: {
    githubUsername: 'username',
    githubRepo: 'blog-repo',
  },
  footer: {
    aplayer: {
      enabled: false,
      server: 'netease',
      playlistId: '',
      preload: 'none',
      order: 'random',
      volume: 0.7,
    },
    upyunCdn: false,
  },
  giscus: {
    repo: 'username/repo',
    repoId: '',
    category: 'Announcements',
    categoryId: '',
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/config && git commit -m "feat: add site configuration"
```

---

### Task 5: ThemeToggle Component

**Files:**
- Create: `src/components/ThemeToggle.astro`

- [ ] **Step 1: Write `src/components/ThemeToggle.astro`**

```astro
---
const { class: className = '' } = Astro.props;
---

<button
  id="theme-toggle"
  class={className}
  aria-label="Toggle theme"
  type="button"
>
  <span class="icon-light">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  </span>
  <span class="icon-dark">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  </span>
</button>

<script>
  const html = document.documentElement;
  const toggle = document.getElementById('theme-toggle')!;

  const saved = localStorage.getItem('theme');
  if (saved === 'dark') html.classList.add('dark');
  else if (saved === 'light') html.classList.add('light');
  // else rely on prefers-color-scheme

  toggle.addEventListener('click', () => {
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      html.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  });
</script>

<style>
  #theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    color: inherit;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #theme-toggle:hover {
    background: var(--accent);
  }
  html.light .icon-dark,
  html:not(.light):not(.dark) .icon-dark,
  html.dark .icon-light {
    display: none;
  }
  html.light .icon-light,
  html.dark .icon-dark {
    display: block;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ThemeToggle.astro && git commit -m "feat: add theme toggle component"
```

---

### Task 6: Nav Component

**Files:**
- Create: `src/components/Nav.astro`

- [ ] **Step 1: Write `src/components/Nav.astro`**

```astro
---
import ThemeToggle from './ThemeToggle.astro';
import { siteConfig } from '../config/site';
import { getDict, locales } from '../i18n/utils';

const { lang = siteConfig.defaultLanguage } = Astro.props as { lang?: string };
const t = getDict(lang);
const currentPath = Astro.url.pathname;

const pages = [
  { href: `/${lang}/`, label: t.home },
  { href: `/${lang}/about/`, label: t.about },
  { href: `/${lang}/links/`, label: t.links },
  { href: `/${lang}/archive/`, label: t.archive },
];

const isHome = currentPath === '/' || currentPath === `/${lang}/`;
---

<header class="site-nav" class:list={{ transparent: isHome }}>
  <div class="nav-inner">
    <a href={`/${lang}/`} class="logo">{siteConfig.title}</a>

    <nav class="nav-links" aria-label="Main navigation">
      {pages.map(p => (
        <a
          href={p.href}
          class="nav-link"
          class:list={{ active: currentPath.startsWith(p.href) }}
        >
          {p.label}
        </a>
      ))}
    </nav>

    <div class="nav-actions">
      <a href={`/${lang}/search/`} class="search-trigger" aria-label={t.search}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </a>

      <div class="lang-switcher">
        {locales.map(loc => (
          <a href={`/${loc}/`} class:list={{ active: loc === lang }}>{loc.toUpperCase()}</a>
        ))}
      </div>

      <ThemeToggle />
    </div>
  </div>
</header>

<script>
  const nav = document.querySelector('.site-nav')!;
  if (nav.classList.contains('transparent')) {
    const observer = new IntersectionObserver(
      ([e]) => {
        nav.classList.toggle('scrolled', !e!.isIntersecting);
      },
      { threshold: 0 }
    );
    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.top = '100vh';
    sentinel.style.height = '1px';
    sentinel.style.width = '1px';
    document.body.prepend(sentinel);
    observer.observe(sentinel);
  }
</script>

<style>
  .site-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    height: var(--nav-height);
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    transition: background-color 0.3s, border-color 0.3s;
  }

  .site-nav.transparent:not(.scrolled) {
    background: transparent;
    border-bottom-color: transparent;
  }

  .site-nav.transparent:not(.scrolled) .nav-link,
  .site-nav.transparent:not(.scrolled) .logo {
    color: #fff;
    text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }

  .nav-inner {
    max-width: calc(var(--content-width) + 200px);
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }

  .logo {
    font-family: var(--font-serif);
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text);
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    gap: 24px;
  }

  .nav-link {
    font-size: 0.9rem;
    color: var(--text-muted);
    transition: color 0.2s;
  }
  .nav-link:hover,
  .nav-link.active {
    color: var(--primary);
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .lang-switcher {
    display: flex;
    gap: 6px;
    font-size: 0.75rem;
  }
  .lang-switcher a {
    color: var(--text-muted);
    padding: 2px 4px;
    border-radius: 3px;
  }
  .lang-switcher a.active {
    color: var(--primary);
    font-weight: 600;
  }

  .search-trigger {
    color: var(--text-muted);
    padding: 6px;
    display: flex;
  }

  @media (max-width: 640px) {
    .nav-links { display: none; }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.astro && git commit -m "feat: add nav component"
```

---

### Task 7: Footer Component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Write `src/components/Footer.astro`**

```astro
---
import { siteConfig } from '../config/site';
import { getDict } from '../i18n/utils';

const { lang = siteConfig.defaultLanguage, stats } = Astro.props as {
  lang?: string;
  stats?: { posts: number; words: number; days: number };
};
const t = getDict(lang);
---

<footer class="site-footer">
  {siteConfig.footer.aplayer.enabled && (
    <div class="aplayer-container">
      <div id="aplayer"></div>
    </div>
  )}

  {stats && (
    <p class="site-stats">
      {t.runningDays}: {stats.days} {t.days} &nbsp;·&nbsp;
      {t.totalPosts}: {stats.posts} {t.articles} &nbsp;·&nbsp;
      {t.totalWords}: {stats.words.toLocaleString()} {t.words}
    </p>
  )}

  <div class="footer-info">
    <p>&copy; {new Date().getFullYear()} {siteConfig.title}. {t.allRightsReserved}.</p>
    <p class="credit">Theme Sakurairo &middot; {t.poweredBy}</p>
  </div>
</footer>

<style>
  .site-footer {
    margin-top: 60px;
    padding: 24px 20px;
    text-align: center;
    background: var(--surface);
    border-top: 1px solid var(--border);
    font-size: 0.825rem;
    color: var(--text-muted);
  }

  .aplayer-container {
    max-width: var(--content-width);
    margin: 0 auto 16px;
  }

  .site-stats {
    margin: 0 0 8px;
  }

  .footer-info {
    margin: 0;
  }

  .credit {
    margin-top: 4px;
    font-size: 0.75rem;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro && git commit -m "feat: add footer component"
```

---

### Task 8: Base Layout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Write `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import { siteConfig } from '../config/site';
import { getDict } from '../i18n/utils';

interface Props {
  lang?: string;
  title?: string;
  description?: string;
  ogImage?: string;
  stats?: { posts: number; words: number; days: number };
}

const {
  lang = siteConfig.defaultLanguage,
  title = siteConfig.title,
  description = siteConfig.description,
  ogImage = '/og-default.png',
  stats,
} = Astro.props;

const t = getDict(lang);
const pageTitle = title === siteConfig.title ? title : `${title} - ${siteConfig.title}`;
---

<!doctype html>
<html lang={lang} dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <meta name="theme-color" content="#7090d0" />

    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:type" content="website" />

    <link rel="alternate" type="application/rss+xml" title={siteConfig.title} href="/rss.xml" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC|Noto+Sans+SC|Fira+Code&display=swap" />

    <title>{pageTitle}</title>

    <meta name="astro-view-transitions-enabled" content="true" />
    <meta name="astro-view-transitions-fallback" content="swap" />
  </head>
  <body>
    <Nav {lang} />
    <main id="main-content">
      <slot />
    </main>
    <Footer {lang} {stats} />
  </body>
</html>

<script is:inline>
  // Theme detection for Giscus sync
  function getTheme() {
    if (document.documentElement.classList.contains('dark')) return 'dark';
    if (document.documentElement.classList.contains('light')) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  window.getTheme = getTheme;
</script>

<style is:global>
  html { scroll-behavior: smooth; }

  @media (max-width: 640px) {
    :root {
      --content-width: 100%;
      --sidebar-width: 0;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro && git commit -m "feat: add base layout"
```

---

### Task 9: Cover Component

**Files:**
- Create: `src/components/Cover.astro`

- [ ] **Step 1: Write `src/components/Cover.astro`**

```astro
---
import { siteConfig } from '../config/site';
import { getDict } from '../i18n/utils';

const { lang = siteConfig.defaultLanguage } = Astro.props as { lang?: string };
const t = getDict(lang);

const images = siteConfig.cover.images;
const randomImage = siteConfig.cover.randomPool && images.length > 0
  ? images[Math.floor(Math.random() * images.length)]
  : (images[0] ?? null);
---

<div class="cover" style={randomImage ? `background-image: url(${randomImage})` : ''}>
  <div id="particles-js" class="particles"></div>
  <div class="cover-content">
    <h1 class="cover-title">{siteConfig.title}</h1>
    <p class="cover-desc">{siteConfig.description}</p>
    <span class="scroll-hint">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </span>
  </div>
</div>

<script>
  import('particles.js').then(() => {
    const cfgEl = document.getElementById('particles-js-cfg');
    const cfg = cfgEl ? JSON.parse(cfgEl.textContent || '{}') : {
      particles: {
        number: { value: 50 },
        color: { value: '#ffffff' },
        opacity: { value: 0.5 },
        size: { value: 3 },
        line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.2, width: 1 },
        move: { enable: true, speed: 2 },
      },
    };
    (window as any).particlesJS?.('particles-js', cfg);
  });
</script>

<style>
  .cover {
    position: relative;
    width: 100%;
    height: 100vh;
    background: var(--cover-gradient);
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .particles {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .cover-content {
    position: relative;
    z-index: 2;
    text-align: center;
    color: #fff;
  }

  .cover-title {
    font-family: var(--font-serif);
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 8px;
    color: #fff;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  .cover-desc {
    font-size: 1.05rem;
    opacity: 0.9;
    margin: 0;
  }

  .scroll-hint {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0.6;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(8px); }
  }

  @media (max-width: 640px) {
    .cover-title { font-size: 1.75rem; }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Cover.astro && git commit -m "feat: add cover component with particles"
```

---

### Task 10: PostCard Component

**Files:**
- Create: `src/components/PostCard.astro`

- [ ] **Step 1: Write `src/components/PostCard.astro`**

```astro
---
import { getDict } from '../i18n/utils';

interface Props {
  title: string;
  slug: string;
  lang: string;
  date: string;
  excerpt?: string;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  pinned?: boolean;
}

const { title, slug, lang, date, excerpt = '', thumbnail, category, tags = [], pinned } = Astro.props;
const t = getDict(lang);
const formattedDate = new Date(date).toLocaleDateString(lang === 'ja' ? 'ja-JP' : lang === 'fr' ? 'fr-FR' : 'zh-CN');
---

<article class="post-card" class:list={{ pinned }}>
  {thumbnail && (
    <a href={`/${lang}/posts/${slug}/`} class="post-thumb">
      <img src={thumbnail} alt={title} loading="lazy" decoding="async" />
    </a>
  )}
  <div class="post-body">
    <h2 class="post-title">
      {pinned && <span class="pinned-badge">&#x1F4CC; {t.pinned}</span>}
      <a href={`/${lang}/posts/${slug}/`}>{title}</a>
    </h2>
    <div class="post-meta">
      <time datetime={date}>{formattedDate}</time>
      {category && <span class="post-category">{category}</span>}
    </div>
    {excerpt && <p class="post-excerpt">{excerpt}</p>}
    {tags.length > 0 && (
      <div class="post-tags">
        {tags.map(tag => <span class="tag">{tag}</span>)}
      </div>
    )}
  </div>
</article>

<style>
  .post-card {
    display: flex;
    gap: 16px;
    padding: 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 12px;
    transition: box-shadow 0.2s;
  }
  .post-card:hover {
    box-shadow: var(--shadow);
  }
  .post-card.pinned {
    border-left: 3px solid var(--primary);
  }

  .post-thumb {
    flex-shrink: 0;
    width: 100px;
    height: 70px;
    overflow: hidden;
    border-radius: 4px;
  }
  .post-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .post-body {
    flex: 1;
    min-width: 0;
  }

  .post-title {
    font-size: 1.05rem;
    margin: 0 0 4px;
  }
  .post-title a {
    color: var(--text);
  }
  .post-title a:hover {
    color: var(--primary);
  }

  .pinned-badge {
    font-size: 0.75rem;
    color: var(--primary);
    margin-right: 6px;
  }

  .post-meta {
    font-size: 0.75rem;
    color: var(--text-muted);
    display: flex;
    gap: 12px;
  }

  .post-excerpt {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin: 6px 0 0;
    line-height: 1.5;
  }

  .post-tags {
    display: flex;
    gap: 6px;
    margin-top: 8px;
    flex-wrap: wrap;
  }

  .tag {
    font-size: 0.7rem;
    background: var(--accent);
    color: var(--text);
    padding: 2px 8px;
    border-radius: 10px;
  }

  @media (max-width: 500px) {
    .post-card {
      flex-direction: column;
    }
    .post-thumb {
      width: 100%;
      height: 120px;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PostCard.astro && git commit -m "feat: add post card component"
```

---

### Task 11: PostList Component

**Files:**
- Create: `src/components/PostList.astro`

- [ ] **Step 1: Write `src/components/PostList.astro`**

```astro
---
import PostCard from './PostCard.astro';
import { getDict } from '../i18n/utils';

interface Post {
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  pinned?: boolean;
}

interface Props {
  posts: Post[];
  lang: string;
}

const { posts, lang } = Astro.props;
const t = getDict(lang);

const pinnedPosts = posts.filter(p => p.pinned);
const normalPosts = posts.filter(p => !p.pinned);
---

<div class="post-list">
  <h2 class="list-title">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
    {t.posts}
  </h2>

  {pinnedPosts.length > 0 && (
    <div class="pinned-section">
      {pinnedPosts.map(post => <PostCard {...post} {lang} />)}
    </div>
  )}

  {normalPosts.map(post => <PostCard {...post} {lang} />)}

  {posts.length === 0 && (
    <p class="empty">{t.noPosts}</p>
  )}
</div>

<style>
  .list-title {
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 16px;
  }

  .pinned-section {
    margin-bottom: 16px;
  }

  .post-list {
    margin-bottom: 24px;
  }

  .empty {
    text-align: center;
    color: var(--text-muted);
    padding: 40px 0;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PostList.astro && git commit -m "feat: add post list component"
```

---

### Task 12: Homepage

**Files:**
- Create: `src/pages/[lang]/index.astro`
- Create: `src/pages/index.astro`

- [ ] **Step 1: Write `src/pages/[lang]/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Cover from '../../components/Cover.astro';
import PostList from '../../components/PostList.astro';
import { siteConfig } from '../../config/site';
import { getDict } from '../../i18n/utils';

export async function getStaticPaths() {
  return siteConfig.languages.map(lang => ({ params: { lang } }));
}

const { lang } = Astro.params;

// Placeholder: posts will come from content collections in Task 20
const posts: any[] = [];
const t = getDict(lang);
---

<BaseLayout {lang} title={siteConfig.title}>
  <Cover {lang} />
  <section class="home-content">
    <PostList {posts} {lang} />
  </section>
</BaseLayout>

<style>
  .home-content {
    max-width: var(--content-width);
    margin: 40px auto 0;
    padding: 0 20px;
  }
</style>
```

- [ ] **Step 2: Write `src/pages/index.astro`** — redirect to default language

```astro
---
import { siteConfig } from '../config/site';
const url = new URL(Astro.url);
return Astro.redirect(`/${siteConfig.defaultLanguage}/`, 302);
---
```

- [ ] **Step 3: Verify build**

```bash
npx astro build
```

- [ ] **Step 4: Commit**

```bash
git add src/pages && git commit -m "feat: add homepage with cover and post list"
```

---

### Task 13: Post Layout

**Files:**
- Create: `src/layouts/PostLayout.astro`

- [ ] **Step 1: Write `src/layouts/PostLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';
import TableOfContents from '../components/TableOfContents.astro';
import RelatedPosts from '../components/RelatedPosts.astro';
import CommentSection from '../components/CommentSection.astro';
import { siteConfig } from '../config/site';

interface Props {
  title: string;
  date: string;
  lang: string;
  description?: string;
  ogImage?: string;
  category?: string;
  tags?: string[];
  headings?: { depth: number; text: string; slug: string }[];
  relatedPosts?: Array<{ title: string; slug: string; excerpt?: string }>;
}

const {
  title, date, lang, description, ogImage,
  category, tags = [], headings = [],
  relatedPosts = [],
} = Astro.props;

const formattedDate = new Date(date).toLocaleDateString(
  lang === 'ja' ? 'ja-JP' : lang === 'fr' ? 'fr-FR' : 'zh-CN'
);
---

<BaseLayout {title} {description} {ogImage} {lang}>
  <article class="post-article">
    <header class="post-header">
      <h1 class="post-title">{title}</h1>
      <div class="post-meta">
        <time datetime={date}>{formattedDate}</time>
        {category && <span class="category">{category}</span>}
      </div>
      {tags.length > 0 && (
        <div class="tags">
          {tags.map(t => <span class="tag">{t}</span>)}
        </div>
      )}
    </header>

    <div class="post-wrapper">
      {headings.length > 0 && <TableOfContents {headings} {lang} />}
      <div class="post-content">
        <slot />
      </div>
    </div>

    {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} {lang} />}
    <CommentSection {lang} />
  </article>
</BaseLayout>

<style>
  .post-article {
    max-width: calc(var(--content-width) + 280px);
    margin: 80px auto 0;
    padding: 0 20px;
  }

  .post-header {
    max-width: var(--content-width);
    margin: 0 auto 32px;
    text-align: center;
  }

  .post-title {
    font-size: 2rem;
    margin: 0 0 8px;
  }

  .post-meta {
    font-size: 0.875rem;
    color: var(--text-muted);
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .tags {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-top: 12px;
  }

  .tag {
    font-size: 0.75rem;
    background: var(--accent);
    padding: 3px 10px;
    border-radius: 12px;
  }

  .post-wrapper {
    display: flex;
    gap: 40px;
    max-width: var(--content-width);
    margin: 0 auto;
  }

  .post-content {
    flex: 1;
    min-width: 0;
    line-height: 1.8;
    font-size: 1rem;
  }

  @media (max-width: 900px) {
    .post-wrapper {
      flex-direction: column;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/PostLayout.astro && git commit -m "feat: add post layout"
```

---

### Task 14: TableOfContents Component

**Files:**
- Create: `src/components/TableOfContents.astro`

- [ ] **Step 1: Write `src/components/TableOfContents.astro`**

```astro
---
import { getDict } from '../i18n/utils';

interface Props {
  headings: { depth: number; text: string; slug: string }[];
  lang: string;
}

const { headings, lang } = Astro.props;
const t = getDict(lang);
---

<nav class="toc" aria-label={t.toc}>
  <span class="toc-title">{t.toc}</span>
  <ul>
    {headings.filter(h => h.depth <= 3).map(h => (
      <li class={`toc-depth-${h.depth}`}>
        <a href={`#${h.slug}`}>{h.text}</a>
      </li>
    ))}
  </ul>
</nav>

<style>
  .toc {
    position: sticky;
    top: calc(var(--nav-height) + 20px);
    width: 220px;
    flex-shrink: 0;
    align-self: flex-start;
    max-height: calc(100vh - var(--nav-height) - 40px);
    overflow-y: auto;
    font-size: 0.85rem;
    padding-right: 16px;
    border-right: 1px solid var(--border);
  }

  .toc-title {
    font-weight: 700;
    color: var(--text);
    display: block;
    margin-bottom: 8px;
  }

  .toc ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .toc li {
    margin-bottom: 4px;
    line-height: 1.4;
  }

  .toc-depth-2 { padding-left: 0; }
  .toc-depth-3 { padding-left: 12px; font-size: 0.8rem; }

  .toc a {
    color: var(--text-muted);
  }
  .toc a:hover {
    color: var(--primary);
  }

  @media (max-width: 900px) {
    .toc { display: none; }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TableOfContents.astro && git commit -m "feat: add table of contents component"
```

---

### Task 15: CodeBlock Component

**Files:**
- Create: `src/components/CodeBlock.astro`

- [ ] **Step 1: Write `src/components/CodeBlock.astro`**

```astro
---
// Wraps Shiki-highlighted code with copy button
---

<div class="code-block-wrapper">
  <button class="copy-btn" type="button">Copy</button>
  <slot />
</div>

<script>
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = btn.nextElementSibling as HTMLPreElement;
      const code = pre?.textContent ?? '';
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => (btn.textContent = 'Copy'), 2000);
      });
    });
  });
</script>

<style>
  .code-block-wrapper {
    position: relative;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CodeBlock.astro && git commit -m "feat: add code block with copy button"
```

---

### Task 16: CommentSection Component

**Files:**
- Create: `src/components/CommentSection.astro`

- [ ] **Step 1: Write `src/components/CommentSection.astro`**

```astro
---
import { siteConfig } from '../config/site';
import { getDict } from '../i18n/utils';

const { lang = siteConfig.defaultLanguage } = Astro.props as { lang?: string };
const t = getDict(lang);
const { repo, repoId, category, categoryId } = siteConfig.giscus;
---

<section class="comments">
  <h3 class="comments-title">{t.comments}</h3>
  <div
    class="giscus"
    data-repo={repo}
    data-repo-id={repoId}
    data-category={category}
    data-category-id={categoryId}
    data-mapping="pathname"
    data-strict="0"
    data-reactions-enabled="1"
    data-emit-metadata="0"
    data-input-position="top"
    data-theme="preferred_color_scheme"
    data-lang={lang}
    loading="lazy"
  ></div>
</section>

<script>
  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', document.querySelector('.giscus')!.getAttribute('data-repo')!);
  script.setAttribute('data-repo-id', document.querySelector('.giscus')!.getAttribute('data-repo-id')!);
  script.setAttribute('data-category', document.querySelector('.giscus')!.getAttribute('data-category')!);
  script.setAttribute('data-category-id', document.querySelector('.giscus')!.getAttribute('data-category-id')!);
  script.setAttribute('data-mapping', 'pathname');
  script.setAttribute('data-strict', '0');
  script.setAttribute('data-reactions-enabled', '1');
  script.setAttribute('data-emit-metadata', '0');
  script.setAttribute('data-input-position', 'top');
  script.setAttribute('data-theme', getTheme());
  script.setAttribute('data-lang', document.querySelector('.giscus')!.getAttribute('data-lang')!);
  script.crossOrigin = 'anonymous';
  script.async = true;
  document.querySelector('.giscus')!.appendChild(script);

  // Sync theme changes
  const observer = new MutationObserver(() => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (iframe) {
      iframe.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: getTheme() } } },
        'https://giscus.app'
      );
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
</script>

<style>
  .comments {
    max-width: var(--content-width);
    margin: 40px auto 0;
  }

  .comments-title {
    font-size: 1.1rem;
    margin-bottom: 16px;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CommentSection.astro && git commit -m "feat: add comment section (Giscus)"
```

---

### Task 17: RelatedPosts Component

**Files:**
- Create: `src/components/RelatedPosts.astro`

- [ ] **Step 1: Write `src/components/RelatedPosts.astro`**

```astro
---
import { getDict } from '../i18n/utils';

interface Props {
  posts: Array<{
    title: string;
    slug: string;
    excerpt?: string;
  }>;
  lang: string;
}

const { posts, lang } = Astro.props;
const t = getDict(lang);
if (posts.length === 0) return null;
---

<section class="related-posts">
  <h3>{t.relatedPosts}</h3>
  <div class="related-grid">
    {posts.map(p => (
      <a href={`/${lang}/posts/${p.slug}/`} class="related-card">
        <span class="related-title">{p.title}</span>
        {p.excerpt && <span class="related-excerpt">{p.excerpt}</span>}
      </a>
    ))}
  </div>
</section>

<style>
  .related-posts {
    max-width: var(--content-width);
    margin: 40px auto 0;
  }

  .related-posts h3 {
    font-size: 1.1rem;
    margin-bottom: 12px;
  }

  .related-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .related-card {
    display: block;
    padding: 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text);
  }
  .related-card:hover {
    border-color: var(--primary);
  }

  .related-title {
    display: block;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .related-excerpt {
    display: block;
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: 4px;
  }

  @media (max-width: 640px) {
    .related-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RelatedPosts.astro && git commit -m "feat: add related posts component"
```

---

### Task 18: Sidebar Component

**Files:**
- Create: `src/components/Sidebar.astro`

- [ ] **Step 1: Write `src/components/Sidebar.astro`**

```astro
---
import { getDict } from '../i18n/utils';

interface Props {
  lang: string;
  stats?: { posts: number; words: number; days: number };
}

const { lang, stats } = Astro.props;
const t = getDict(lang);
---

<aside class="sidebar">
  {stats && (
    <div class="stat-card">
      <div class="stat">
        <span class="stat-value">{stats.days}</span>
        <span class="stat-label">{t.runningDays}</span>
      </div>
      <div class="stat">
        <span class="stat-value">{stats.posts}</span>
        <span class="stat-label">{t.totalPosts}</span>
      </div>
      <div class="stat">
        <span class="stat-value">{(stats.words / 1000).toFixed(1)}k</span>
        <span class="stat-label">{t.totalWords}</span>
      </div>
    </div>
  )}
</aside>

<style>
  .sidebar {
    width: var(--sidebar-width);
    flex-shrink: 0;
  }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .stat {
    text-align: center;
  }

  .stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary);
  }

  .stat-label {
    display: block;
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 2px;
  }

  @media (max-width: 768px) {
    .sidebar { display: none; }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Sidebar.astro && git commit -m "feat: add sidebar component"
```

---

### Task 19: GitHub Commits Fetcher

**Files:**
- Create: `src/lib/github.ts`

- [ ] **Step 1: Write `src/lib/github.ts`**

```ts
import { siteConfig } from '../config/site';

export interface CommitEntry {
  date: string;
  message: string;
  hash: string;
}

export async function fetchRecentCommits(): Promise<CommitEntry[]> {
  const { githubUsername: user, githubRepo: repo } = siteConfig.about;

  if (!user || !repo) return [];

  try {
    const res = await fetch(
      `https://api.github.com/repos/${user}/${repo}/commits?per_page=20`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
      }
    );

    if (!res.ok) return [];

    const data = (await res.json()) as Array<{
      sha: string;
      commit: { message: string; author: { date: string } };
    }>;

    return data.map((c) => ({
      hash: c.sha.slice(0, 7),
      message: c.commit.message.split('\n')[0],
      date: c.commit.author.date,
    }));
  } catch {
    return [];
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/github.ts && git commit -m "feat: add github commits fetcher"
```

---

### Task 20: Site Stats Utility

**Files:**
- Create: `src/lib/stats.ts`

- [ ] **Step 1: Write `src/lib/stats.ts`**

```ts
import { siteConfig } from '../config/site';
import { getCollection } from 'astro:content';

export async function getSiteStats() {
  const posts = await getCollection('posts');
  const startDate = new Date(siteConfig.startDate);
  const days = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  let totalWords = 0;
  for (const post of posts) {
    const wordCount = post.body?.length ?? 0;
    // Rough Chinese word count: remove whitespace
    totalWords += wordCount;
  }

  return {
    posts: posts.length,
    words: totalWords,
    days,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/stats.ts && git commit -m "feat: add site stats utility"
```

---

### Task 21: Content Collections

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/posts/.gitkeep`
- Create: `src/content/pages/.gitkeep`

- [ ] **Step 1: Write `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    pinned: z.boolean().default(false),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    excerpt: z.string().optional(),
    thumbnail: z.string().optional(),
    lang: z.enum(['zh', 'ja', 'fr']).default('zh'),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    lang: z.enum(['zh', 'ja', 'fr']).default('zh'),
  }),
});

export const collections = { posts, pages };
```

- [ ] **Step 2: Commit**

```bash
mkdir -p src/content/posts src/content/pages
touch src/content/posts/.gitkeep src/content/pages/.gitkeep
git add src/content && git commit -m "feat: add content collections schema"
```

---

### Task 22: Single Post Page

**Files:**
- Create: `src/pages/[lang]/posts/[slug].astro`

- [ ] **Step 1: Write `src/pages/[lang]/posts/[slug].astro`**

```astro
---
import { getCollection } from 'astro:content';
import PostLayout from '../../../layouts/PostLayout.astro';
import { siteConfig } from '../../../config/site';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const paths: Array<{ params: { lang: string; slug: string } }> = [];

  for (const post of posts) {
    for (const lang of siteConfig.languages) {
      paths.push({
        params: { lang, slug: post.slug },
      });
    }
  }

  return paths;
}

const { slug, lang } = Astro.params;
const posts = await getCollection('posts', ({ data }) => !data.draft && data.lang === lang);
const post = posts.find(p => p.slug === slug);

if (!post) return Astro.redirect(`/${lang}/`);

const { Content, headings } = await post.render();

// Get related posts by shared tags
const relatedPosts = posts
  .filter(p => p.slug !== slug)
  .filter(p => p.data.tags?.some(t => post.data.tags?.includes(t)))
  .slice(0, 3)
  .map(p => ({
    title: p.data.title,
    slug: p.slug,
    excerpt: p.data.excerpt,
  }));
---

<PostLayout
  title={post.data.title}
  date={post.data.date}
  {lang}
  description={post.data.excerpt}
  ogImage={post.data.thumbnail}
  category={post.data.category}
  tags={post.data.tags}
  {headings}
  {relatedPosts}
>
  <Content />
</PostLayout>
```

- [ ] **Step 2: Verify build**

```bash
npx astro build
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/[lang]/posts && git commit -m "feat: add single post page"
```

---

### Task 23: About Page

**Files:**
- Create: `src/pages/[lang]/about.astro`
- Create: `src/components/CommitTimeline.astro`

- [ ] **Step 1: Write `src/components/CommitTimeline.astro`**

```astro
---
import { getDict } from '../i18n/utils';
import type { CommitEntry } from '../lib/github';

interface Props {
  commits: CommitEntry[];
  lang: string;
}

const { commits, lang } = Astro.props;
const t = getDict(lang);
---

<div class="commits-section">
  <h2>{t.recentCommits}</h2>
  <div class="commit-timeline">
    {commits.map(c => (
      <div class="commit-entry">
        <span class="commit-dot"></span>
        <time datetime={c.date} class="commit-date">
          {new Date(c.date).toLocaleDateString(
            lang === 'ja' ? 'ja-JP' : lang === 'fr' ? 'fr-FR' : 'zh-CN'
          )}
        </time>
        <span class="commit-msg">{c.message}</span>
        <code class="commit-hash">{c.hash}</code>
      </div>
    ))}
    {commits.length === 0 && (
      <p class="empty">No commits to show.</p>
    )}
  </div>
</div>

<style>
  .commits-section h2 {
    font-size: 1.2rem;
    margin-bottom: 16px;
  }

  .commit-timeline {
    border-left: 2px solid var(--primary);
    padding-left: 16px;
  }

  .commit-entry {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 10px;
    font-size: 0.85rem;
    position: relative;
  }

  .commit-dot {
    position: absolute;
    left: -22px;
    top: 6px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--primary);
  }

  .commit-date {
    flex-shrink: 0;
    color: var(--text-muted);
    font-size: 0.8rem;
  }

  .commit-msg {
    flex: 1;
    color: var(--text);
  }

  .commit-hash {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .empty {
    color: var(--text-muted);
  }
</style>
```

- [ ] **Step 2: Write `src/pages/[lang]/about.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Sidebar from '../../components/Sidebar.astro';
import CommitTimeline from '../../components/CommitTimeline.astro';
import { siteConfig } from '../../config/site';
import { getDict } from '../../i18n/utils';
import { fetchRecentCommits } from '../../lib/github';
import { getSiteStats } from '../../lib/stats';

export async function getStaticPaths() {
  return siteConfig.languages.map(lang => ({ params: { lang } }));
}

const { lang } = Astro.params;
const t = getDict(lang);
const commits = await fetchRecentCommits();
const stats = await getSiteStats();
---

<BaseLayout title={`${t.about} - ${siteConfig.title}`} {lang} {stats}>
  <div class="about-page">
    <div class="about-main">
      <h1 class="page-title">{t.about}</h1>

      <div class="profile-section">
        <img
          src={siteConfig.avatar}
          alt={siteConfig.author}
          class="avatar"
          width="80"
          height="80"
        />
        <div class="profile-info">
          <h2>{siteConfig.author}</h2>
          <p>{siteConfig.authorBio}</p>
        </div>
      </div>

      <CommitTimeline {commits} {lang} />
    </div>
    <Sidebar {lang} {stats} />
  </div>
</BaseLayout>

<style>
  .about-page {
    max-width: calc(var(--content-width) + 280px);
    margin: 80px auto 0;
    padding: 0 20px;
    display: flex;
    gap: 40px;
  }

  .about-main {
    flex: 1;
    min-width: 0;
  }

  .page-title {
    font-size: 2rem;
    margin: 0 0 24px;
  }

  .profile-section {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-bottom: 32px;
    padding: 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }

  .profile-info h2 {
    margin: 0 0 4px;
  }

  .profile-info p {
    color: var(--text-muted);
    margin: 0;
  }

  @media (max-width: 768px) {
    .about-page {
      flex-direction: column;
    }
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CommitTimeline.astro src/pages/[lang]/about.astro && git commit -m "feat: add about page with github timeline"
```

---

### Task 24: Links Page

**Files:**
- Create: `src/pages/[lang]/links.astro`

- [ ] **Step 1: Write `src/pages/[lang]/links.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { siteConfig } from '../../config/site';
import { getDict } from '../../i18n/utils';

export async function getStaticPaths() {
  return siteConfig.languages.map(lang => ({ params: { lang } }));
}

const { lang } = Astro.params;
const t = getDict(lang);

// Load links from content repo data/links.yaml
// During development, use placeholder empty array
const links: Array<{
  name: string;
  url: string;
  description: string;
  thumbnail?: string;
}> = [];
---

<BaseLayout title={`${t.links} - ${siteConfig.title}`} {lang}>
  <div class="links-page">
    <h1 class="page-title">{t.links}</h1>

    <div class="links-list">
      {links.map(link => (
        <a href={link.url} class="link-card" target="_blank" rel="noopener">
          {link.thumbnail && (
            <div class="link-thumb">
              <img src={link.thumbnail} alt="" loading="lazy" />
            </div>
          )}
          <div class="link-info">
            <span class="link-name">{link.name}</span>
            <span class="link-desc">{link.description}</span>
          </div>
        </a>
      ))}
    </div>

    {links.length === 0 && (
      <p class="empty">Links coming soon.</p>
    )}
  </div>
</BaseLayout>

<style>
  .links-page {
    max-width: var(--content-width);
    margin: 80px auto 0;
    padding: 0 20px;
  }

  .page-title {
    font-size: 2rem;
    margin: 0 0 24px;
  }

  .links-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .link-card {
    display: flex;
    gap: 16px;
    padding: 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .link-card:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow);
  }

  .link-thumb {
    width: 120px;
    height: 70px;
    flex-shrink: 0;
    border-radius: 4px;
    overflow: hidden;
  }
  .link-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .link-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .link-name {
    font-weight: 600;
  }

  .link-desc {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .empty {
    text-align: center;
    color: var(--text-muted);
    padding: 40px 0;
  }

  @media (max-width: 500px) {
    .link-thumb { width: 80px; height: 50px; }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/[lang]/links.astro && git commit -m "feat: add links page"
```

---

### Task 25: Archive Page

**Files:**
- Create: `src/pages/[lang]/archive.astro`

- [ ] **Step 1: Write `src/pages/[lang]/archive.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { siteConfig } from '../../config/site';
import { getDict } from '../../i18n/utils';

export async function getStaticPaths() {
  return siteConfig.languages.map(lang => ({ params: { lang } }));
}

const { lang } = Astro.params;
const t = getDict(lang);

const posts = await getCollection('posts', ({ data }) => !data.draft && data.lang === lang);
const sorted = posts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

// Group by year
const grouped: Record<string, typeof posts> = {};
for (const post of sorted) {
  const year = new Date(post.data.date).getFullYear().toString();
  (grouped[year] ??= []).push(post);
}
---

<BaseLayout title={`${t.archive} - ${siteConfig.title}`} {lang}>
  <div class="archive-page">
    <h1 class="page-title">{t.archive}</h1>

    {Object.entries(grouped).map(([year, yearPosts]) => (
      <section class="year-group">
        <h2 class="year-title">{year}</h2>
        <ul class="post-entries">
          {yearPosts.map(post => (
            <li>
              <time datetime={post.data.date} class="post-date">
                {new Date(post.data.date).toLocaleDateString(
                  lang === 'ja' ? 'ja-JP' : lang === 'fr' ? 'fr-FR' : 'zh-CN'
                )}
              </time>
              <a href={`/${lang}/posts/${post.slug}/`}>{post.data.title}</a>
            </li>
          ))}
        </ul>
      </section>
    ))}
  </div>
</BaseLayout>

<style>
  .archive-page {
    max-width: var(--content-width);
    margin: 80px auto 0;
    padding: 0 20px;
  }

  .page-title {
    font-size: 2rem;
    margin: 0 0 24px;
  }

  .year-group {
    margin-bottom: 24px;
  }

  .year-title {
    font-size: 1.3rem;
    margin: 0 0 8px;
    color: var(--primary);
  }

  .post-entries {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .post-entries li {
    display: flex;
    gap: 16px;
    padding: 6px 0;
    border-bottom: 1px solid var(--border);
  }

  .post-date {
    flex-shrink: 0;
    color: var(--text-muted);
    font-size: 0.85rem;
  }

  .post-entries a {
    color: var(--text);
  }
  .post-entries a:hover {
    color: var(--primary);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/[lang]/archive.astro && git commit -m "feat: add archive page"
```

---

### Task 26: Custom Pages (Bangumi, Bilibili, Steam, Videos)

**Files:**
- Create: `src/pages/[lang]/bangumi.astro`
- Create: `src/pages/[lang]/bilibili.astro`
- Create: `src/pages/[lang]/steam.astro`
- Create: `src/pages/[lang]/videos.astro`

- [ ] **Step 1: Write `src/pages/[lang]/bangumi.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { siteConfig } from '../../config/site';

export async function getStaticPaths() {
  return siteConfig.languages.map(lang => ({ params: { lang } }));
}

const { lang } = Astro.params;

if (!siteConfig.features.bangumi) {
  return Astro.redirect(`/${lang}/`, 302);
}
---

<BaseLayout title={`Bangumi - ${siteConfig.title}`} {lang}>
  <div class="custom-page">
    <h1>Bangumi</h1>
    <p>Anime tracking page. Content from content repo data/.</p>
  </div>
</BaseLayout>

<style>
  .custom-page {
    max-width: var(--content-width);
    margin: 80px auto 0;
    padding: 0 20px;
  }
</style>
```

- [ ] **Step 2: Write `src/pages/[lang]/bilibili.astro`** (same structure, check `siteConfig.features.bilibili`)

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { siteConfig } from '../../config/site';

export async function getStaticPaths() {
  return siteConfig.languages.map(lang => ({ params: { lang } }));
}

const { lang } = Astro.params;

if (!siteConfig.features.bilibili) {
  return Astro.redirect(`/${lang}/`, 302);
}
---

<BaseLayout title={`Bilibili - ${siteConfig.title}`} {lang}>
  <div class="custom-page">
    <h1>Bilibili Favorites</h1>
    <p>Content from content repo data/.</p>
  </div>
</BaseLayout>

<style>
  .custom-page {
    max-width: var(--content-width);
    margin: 80px auto 0;
    padding: 0 20px;
  }
</style>
```

- [ ] **Step 3: Write `src/pages/[lang]/steam.astro`** (check `siteConfig.features.steam`)

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { siteConfig } from '../../config/site';

export async function getStaticPaths() {
  return siteConfig.languages.map(lang => ({ params: { lang } }));
}

const { lang } = Astro.params;

if (!siteConfig.features.steam) {
  return Astro.redirect(`/${lang}/`, 302);
}
---

<BaseLayout title={`Steam - ${siteConfig.title}`} {lang}>
  <div class="custom-page">
    <h1>Steam Games</h1>
    <p>Content from content repo data/.</p>
  </div>
</BaseLayout>

<style>
  .custom-page {
    max-width: var(--content-width);
    margin: 80px auto 0;
    padding: 0 20px;
  }
</style>
```

- [ ] **Step 4: Write `src/pages/[lang]/videos.astro`** (check `siteConfig.features.videos`)

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { siteConfig } from '../../config/site';

export async function getStaticPaths() {
  return siteConfig.languages.map(lang => ({ params: { lang } }));
}

const { lang } = Astro.params;

if (!siteConfig.features.videos) {
  return Astro.redirect(`/${lang}/`, 302);
}
---

<BaseLayout title={`Videos - ${siteConfig.title}`} {lang}>
  <div class="custom-page">
    <h1>Followed Videos</h1>
    <p>Content from content repo data/.</p>
  </div>
</BaseLayout>

<style>
  .custom-page {
    max-width: var(--content-width);
    margin: 80px auto 0;
    padding: 0 20px;
  </style>
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/[lang]/bangumi.astro src/pages/[lang]/bilibili.astro src/pages/[lang]/steam.astro src/pages/[lang]/videos.astro && git commit -m "feat: add custom pages with feature toggles"
```

---

### Task 27: Search Page (Pagefind)

**Files:**
- Create: `src/pages/[lang]/search.astro`
- Create: `src/components/SearchModal.astro`

- [ ] **Step 1: Write `src/components/SearchModal.astro`**

```astro
---
import { getDict } from '../i18n/utils';

const { lang } = Astro.props as { lang: string };
const t = getDict(lang);
---

<div id="search-modal" class="search-overlay" hidden>
  <div class="search-dialog">
    <div id="search-input-wrapper"></div>
    <div id="search-results"></div>
    <button id="search-close" class="search-close" type="button" aria-label="Close search">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>
</div>

<style>
  .search-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 200;
    display: flex;
    justify-content: center;
    padding-top: 80px;
  }

  .search-overlay[hidden] {
    display: none;
  }

  .search-dialog {
    background: var(--surface);
    border-radius: var(--radius);
    width: 100%;
    max-width: 560px;
    max-height: 70vh;
    overflow-y: auto;
    padding: 20px;
    position: relative;
  }

  .search-close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
  }
</style>
```

- [ ] **Step 2: Write `src/pages/[lang]/search.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import SearchModal from '../../components/SearchModal.astro';
import { siteConfig } from '../../config/site';
import { getDict } from '../../i18n/utils';

export async function getStaticPaths() {
  return siteConfig.languages.map(lang => ({ params: { lang } }));
}

const { lang } = Astro.params;
const t = getDict(lang);
---

<BaseLayout title={`${t.search} - ${siteConfig.title}`} {lang}>
  <div class="search-page">
    <h1>{t.search}</h1>
    <div id="search-input-wrapper"></div>
    <div id="search-results"></div>
  </div>
</BaseLayout>

<link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
<script src="/pagefind/pagefind-ui.js"></script>
<script>
  // PagefindUI is globally available after loading pagefind-ui.js
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof PagefindUI !== 'undefined') {
      new PagefindUI({
        element: '#search-input-wrapper',
        showImages: false,
      });
    }
  });
</script>

<style>
  .search-page {
    max-width: var(--content-width);
    margin: 80px auto 0;
    padding: 0 20px;
    min-height: 60vh;
  }

  .search-page h1 {
    font-size: 2rem;
    margin-bottom: 20px;
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SearchModal.astro src/pages/[lang]/search.astro && git commit -m "feat: add search page with Pagefind"
```

---

### Task 28: RSS Feed

**Files:**
- Create: `src/pages/rss.xml.ts`

- [ ] **Step 1: Write `src/pages/rss.xml.ts`**

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../config/site';

export async function GET() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: Astro.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt ?? '',
      pubDate: new Date(post.data.date),
      link: `/${post.data.lang}/posts/${post.slug}/`,
    })),
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/rss.xml.ts && git commit -m "feat: add RSS feed"
```

---

### Task 29: OG Image Generation

**Files:**
- Create: `src/pages/og/[slug].png.ts`

- [ ] **Step 1: Write `src/pages/og/[slug].png.ts`**

```ts
import { getCollection } from 'astro:content';
import { siteConfig } from '../../config/site';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { title: post.data.title, date: post.data.date },
  }));
}

// Simple SVG-based OG image
export async function GET({ props }: any) {
  const { title, date } = props;
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f5f5fa"/>
    <rect y="500" width="100%" height="130" fill="#7090d0"/>
    <text x="60" y="350" font-family="serif" font-size="48" fill="#3e3865">${title}</text>
    <text x="60" y="580" font-family="sans-serif" font-size="28" fill="#fff">${siteConfig.title}</text>
    <text x="60" y="420" font-family="sans-serif" font-size="22" fill="#888">${date}</text>
  </svg>`;

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/og && git commit -m "feat: add OG image generation"
```

---

### Task 30: Content Repo Integration

**Files:**
- Create: `scripts/fetch-content.sh`
- Create: `.github/workflows/build.yml` (optional)

- [ ] **Step 1: Write `scripts/fetch-content.sh`**

```bash
#!/bin/bash
# Fetch content repo on build
set -e

CONTENT_REPO="${CONTENT_REPO:-}"
CONTENT_DIR="src/content"

if [ -z "$CONTENT_REPO" ]; then
  echo "CONTENT_REPO not set, skipping content fetch"
  exit 0
fi

if [ -d "$CONTENT_DIR/.git" ]; then
  echo "Updating content submodule..."
  git submodule update --remote "$CONTENT_DIR"
else
  echo "Cloning content repo..."
  git clone "$CONTENT_REPO" "$CONTENT_DIR"
fi

echo "Content repo ready."
```

- [ ] **Step 2: Update `astro.config.ts`** — add Pagefind integration

```ts
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com',
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'ja', 'fr'],
    routing: { prefixDefaultLocale: true },
  },
  build: {
    // Pagefind runs after build
  },
});
```

- [ ] **Step 3: Update `package.json`** — add build scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && npx pagefind --source dist",
    "preview": "astro preview",
    "fetch-content": "bash scripts/fetch-content.sh"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add scripts/ package.json && git commit -m "feat: add content repo integration and build scripts"
```

---

### Task 31: Integration & Final Polish

**Files:**
- (various final touches)

- [ ] **Step 1: Wire PostList to content collections on homepage**

Update `src/pages/[lang]/index.astro` frontmatter:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Cover from '../../components/Cover.astro';
import PostList from '../../components/PostList.astro';
import { siteConfig } from '../../config/site';

export async function getStaticPaths() {
  return siteConfig.languages.map(lang => ({ params: { lang } }));
}

const { lang } = Astro.params;
const allPosts = await getCollection('posts', ({ data }) => !data.draft && data.lang === lang);
const posts = allPosts
  .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
  .map(p => ({
    title: p.data.title,
    slug: p.slug,
    date: p.data.date,
    excerpt: p.data.excerpt,
    thumbnail: p.data.thumbnail,
    category: p.data.category,
    tags: p.data.tags,
    pinned: p.data.pinned,
  }));
---
```

- [ ] **Step 2: Update BaseLayout font loading to respect `prefers-reduced-motion`** — add `@media (prefers-reduced-motion)` to disable animations.

- [ ] **Step 3: Add View Transitions to `astro.config.ts`** — set `viewTransitions: true` if explicitly configuring.

- [ ] **Step 4: Run full build and verify output**

```bash
npm run build
ls dist/
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: final integration and polish"
```
