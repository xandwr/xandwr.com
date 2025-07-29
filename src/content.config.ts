import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const info = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/info' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
  }),
});

export const collections = { info };