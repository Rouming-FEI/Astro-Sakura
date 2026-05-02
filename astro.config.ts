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
