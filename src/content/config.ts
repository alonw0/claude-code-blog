import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const authors = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/authors" }),
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    avatar: z.string(),
    social: z.object({
      github: z.string().optional(),
      twitter: z.string().optional(),
      website: z.string().optional(),
      linkedin: z.string().optional(),
    }).optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    authors: z.array(reference("authors")),
    tags: z.array(z.string()),
    image: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = { authors, blog };
