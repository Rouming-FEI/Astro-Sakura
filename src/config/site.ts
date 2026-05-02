export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  authorBio: string;
  avatar: string;
  defaultLanguage: 'zh' | 'ja' | 'fr';
  languages: Array<'zh' | 'ja' | 'fr'>;
  startDate: string;
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
