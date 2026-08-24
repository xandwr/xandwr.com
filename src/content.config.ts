import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
    loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        href: z.string(),
        repository: z.string().url().optional(),
        category: z.enum(["tooling", "personal", "games"]),
        tags: z.array(z.string()).default([]),
        order: z.number().int().nonnegative().default(0),
        draft: z.boolean().default(false),
        writeup: z.boolean().default(false),
    }),
});

export const collections = { projects };
