import sharp from 'sharp';
import { getCollection } from 'astro:content';
import { siteConfig } from '../../config/site';

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { title: post.data.title, date: post.data.date },
  }));
}

export async function GET({ props }: any) {
  const { title, date } = props;
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#ebeeff"/>
    <rect y="500" width="100%" height="130" fill="#7595e8"/>
    <text x="60" y="350" font-family="serif" font-size="48" fill="#383360">${esc(title)}</text>
    <text x="60" y="580" font-family="sans-serif" font-size="28" fill="#fff">${esc(siteConfig.title)}</text>
    <text x="60" y="420" font-family="sans-serif" font-size="22" fill="#9590bd">${esc(date)}</text>
  </svg>`;

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
}
