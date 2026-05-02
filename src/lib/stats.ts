import { siteConfig } from '../config/site';
import { getCollection } from 'astro:content';

export async function getSiteStats() {
  const posts = await getCollection('posts');
  const startDate = new Date(siteConfig.startDate);
  const days = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  let totalWords = 0;
  for (const post of posts) {
    totalWords += post.body?.length ?? 0;
  }

  return {
    posts: posts.length,
    words: totalWords,
    days,
  };
}
