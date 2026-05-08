import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { siteConfig } from './src/config/site';

export default defineConfig({
  site: siteConfig.siteUrl,
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  vite: {
    css: {
      preprocessorMaxWorkers: true,
    },
  },
});
