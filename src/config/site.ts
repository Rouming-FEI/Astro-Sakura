// ============================================================
// 站点配置文件 — 所有用户可修改的选项都在这里
// 修改后重新运行 npx astro build 即可生效
// ============================================================

export interface SiteConfig {
  // ========== 站点基本信息 ==========

  /** 站点标题，显示在首页封面和浏览器标签页 */
  title: string;
  /** 站点副标题 / 简介，显示在首页封面和 SEO 描述 */
  description: string;
  /** 站点完整网址，用于生成 sitemap、RSS，不要以 / 结尾 */
  siteUrl: string;
  /** 作者名称，显示在关于页面 */
  author: string;
  /** 作者简介，显示在关于页面 */
  authorBio: string;
  /** 头像图片路径，放在 public 目录，如 '/avatar.png' */
  avatar: string;
  /** 建站日期 (YYYY-MM-DD)，用于计算运行天数 */
  startDate: string;

  // ========== 字体 ==========

  fonts: {
    /** 衬线字体（标题使用），需为 Google Fonts 上可用的字体名 */
    serif: string;
    /** 无衬线字体（正文、UI），需为 Google Fonts 上可用的字体名 */
    sans: string;
    /** 等宽字体（代码），需为 Google Fonts 上可用的字体名 */
    mono: string;
  };

  // ========== 功能开关 ==========

  features: {
    /** 追番页面 /bangumi */
    bangumi: boolean;
    /** B站收藏页面 /bilibili */
    bilibili: boolean;
    /** Steam 游戏库页面 /steam */
    steam: boolean;
    /** 追剧页面 /videos */
    videos: boolean;
  };

  // ========== 社交链接（首页封面图标） ==========

  social: {
    /** 是否在封面显示社交图标 */
    enabled: boolean;
    /** GitHub 主页链接 */
    github?: string;
    /** B站主页链接 */
    bilibili?: string;
    /** X (Twitter) 主页链接 */
    twitter?: string;
    /** 知乎主页链接 */
    zhihu?: string;
    /** 邮箱地址 */
    email?: string;
  };

  // ========== 首页封面背景 ==========

  cover: {
    /** true = 每次访问随机选一张；false = 始终用第一张 */
    randomPool: boolean;
    /** 背景图列表，图片放在 public 目录下，如 '/images/cover/1.png' */
    images: string[];
  };

  // ========== 关于页面 ==========

  about: {
    /** GitHub 用户名，用于拉取最近提交记录 */
    githubUsername: string;
    /** GitHub 仓库名，用于拉取最近提交记录 */
    githubRepo: string;
  };

  // ========== 评论系统 (Giscus) ==========

  giscus: {
    /** 格式：'用户名/仓库名' */
    repo: string;
    /** 从 https://github.com/<repo> 的 Discussions 设置页面获取 */
    repoId: string;
    /** Discussions 分类名 */
    category: string;
    /** Discussions 分类 ID */
    categoryId: string;
  };

  // ========== B站 ==========

  bilibili: {
    /** B站用户 UID，用于 B站收藏页和追番（bilibili 源） */
    uid: string;
  };

  // ========== 追番 ==========

  bangumi: {
    /** 数据来源：bilibili | bangumi (bgm.tv) | mal (MyAnimeList) */
    source: 'bilibili' | 'bangumi' | 'mal';
    /** B站 UID（source 为 bilibili 时需要） */
    bilibiliUid: string;
    /** Bangumi UID（source 为 bangumi 时需要） */
    bangumiUid: string;
    /** MyAnimeList 用户名（source 为 mal 时需要） */
    malUsername: string;
  };

  // ========== Steam ==========

  steam: {
    /** Steam API Key，从 https://steamcommunity.com/dev/apikey 获取 */
    apiKey: string;
    /** Steam 64位数字 ID */
    steamId: string;
  };

  // ========== 友链 ==========

  links: Array<{
    /** 友链标题 */
    title: string;
    /** 友链网址 */
    url: string;
    /** 头像图片 URL */
    avatar: string;
    /** 简短描述 */
    description: string;
  }>;
}

// ============================================================
// 下方为实际配置值，按需修改
// ============================================================

export const siteConfig: SiteConfig = {
  // ----- 基本信息 -----
  title: 'My Blog',
  description: 'A personal blog built with Astro',
  siteUrl: 'https://example.com',
  author: 'Author Name',
  authorBio: 'A short bio about the author.',
  avatar: '/avatar.png',
  startDate: '2024-01-01',

  // ----- 字体 -----
  fonts: {
    serif: 'Noto Serif SC',
    sans: 'Noto Sans SC',
    mono: 'Fira Code',
  },

  // ----- 功能开关 -----
  features: {
    bangumi: true,
    bilibili: true,
    steam: true,
    videos: true,
  },

  // ----- 社交链接 -----
  social: {
    enabled: true,
    github: 'https://github.com/username',
    bilibili: '',
    twitter: '',
    zhihu: '',
    email: '',
  },

  // ----- 封面背景 -----
  cover: {
    randomPool: true,
    images: ['/images/cover/2.png'],
  },

  // ----- 关于页面 -----
  about: {
    githubUsername: 'username',
    githubRepo: 'blog-repo',
  },

  // ----- 评论 (Giscus) -----
  giscus: {
    repo: 'username/repo',
    repoId: '',
    category: 'Announcements',
    categoryId: '',
  },

  // ----- B站 -----
  bilibili: {
    uid: '',
  },

  // ----- 追番 -----
  bangumi: {
    source: 'bilibili',
    bilibiliUid: '',
    bangumiUid: '',
    malUsername: '',
  },

  // ----- Steam -----
  steam: {
    apiKey: '',
    steamId: '',
  },

  // ----- 友链 -----
  links: [],
};
