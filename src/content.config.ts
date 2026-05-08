import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '[^_]*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    pinned: z.boolean().default(false),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    excerpt: z.string().optional(),
    thumbnail: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
