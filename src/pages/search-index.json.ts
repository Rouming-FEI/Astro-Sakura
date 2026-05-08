import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const index = posts.map(p => ({
    title: p.data.title,
    slug: p.id,
    excerpt: p.data.excerpt ?? '',
    tags: p.data.tags ?? [],
    date: p.data.date,
  }));
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
}
