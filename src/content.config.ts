import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const resumeScope = z.enum(["software", "hardware", "ai-ml", "embedded"]);

const resumeMetadata = z.object({
    enabled: z.boolean().default(true),
    scopes: z.array(resumeScope).default([
        "software",
        "hardware",
        "ai-ml",
        "embedded",
    ]),
    order: z.number().int().nonnegative().default(0),
    highlights: z.array(z.string()).default([]),
});

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
        date: z.string().optional(),
        resume: resumeMetadata.optional(),
    }),
});

const experience = defineCollection({
    loader: glob({ base: "./src/content/experience", pattern: "**/*.{md,mdx}" }),
    schema: z.object({
        title: z.string(),
        organization: z.string().optional(),
        location: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        section: z.enum(["employment", "community"]),
        highlights: z.array(z.string()),
        resume: resumeMetadata,
    }),
});

const education = defineCollection({
    loader: glob({ base: "./src/content/education", pattern: "**/*.{md,mdx}" }),
    schema: z.object({
        credential: z.string(),
        institution: z.string(),
        location: z.string(),
        startDate: z.string().optional(),
        endDate: z.string(),
        distinction: z.string().optional(),
        highlights: z.array(z.string()).default([]),
        relatedProjects: z.array(z.string()).default([]),
        resume: resumeMetadata,
    }),
});

const resume = defineCollection({
    loader: glob({ base: "./src/content/resume", pattern: "**/*.{md,mdx}" }),
    schema: z.object({
        name: z.string(),
        headline: z.string(),
        location: z.string(),
        email: z.string().email(),
        phone: z.string(),
        linkedin: z.string(),
        about: z.array(z.string()),
    }),
});

export const collections = { projects, experience, education, resume };
