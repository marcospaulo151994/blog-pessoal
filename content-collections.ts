import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMDX, type Options as MdxOptions } from '@content-collections/mdx';
import { z } from 'zod';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';

const mdxOptions: MdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    [
      rehypePrettyCode,
      {
        theme: { dark: 'github-dark-dimmed', light: 'github-light' },
        keepBackground: false,
      },
    ],
  ],
};

const Post = defineCollection({
  name: 'posts',
  directory: 'content/posts',
  include: '*.{pt,en}.mdx',
  schema: z.object({
    translationKey: z.string(),
    slug: z.string(),
    lang: z.enum(['pt', 'en']),
    title: z.string(),
    description: z.string().max(200),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    status: z.enum(['draft', 'published']).default('draft'),
    projectKey: z.string().optional(),
    cover: z.string().optional(),
    readingTime: z.number().optional(),
  }),
  transform: async (doc, ctx) => {
    const body = await compileMDX(ctx, doc, mdxOptions);
    return { ...doc, body };
  },
});

const Projeto = defineCollection({
  name: 'projetos',
  directory: 'content/projetos',
  include: '*.{pt,en}.mdx',
  schema: z.object({
    translationKey: z.string(),
    slug: z.string(),
    lang: z.enum(['pt', 'en']),
    title: z.string(),
    tagline: z.string().max(120),
    description: z.string(),
    period: z.object({
      start: z.coerce.date(),
      end: z.coerce.date().optional(),
    }),
    status: z.enum(['active', 'completed', 'archived']),
    stack: z.array(z.string()),
    links: z
      .object({
        repo: z.string().url().optional(),
        demo: z.string().url().optional(),
        paper: z.string().url().optional(),
      })
      .optional(),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
  transform: async (doc, ctx) => {
    const body = await compileMDX(ctx, doc, mdxOptions);
    return { ...doc, body };
  },
});

const Nota = defineCollection({
  name: 'notas',
  directory: 'content/notas',
  include: '*.{pt,en}.mdx',
  schema: z.object({
    translationKey: z.string(),
    slug: z.string(),
    lang: z.enum(['pt', 'en']),
    title: z.string(),
    maturity: z.enum(['seedling', 'budding', 'evergreen']).default('seedling'),
    planted: z.coerce.date(),
    tended: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),
  }),
  transform: async (doc, ctx) => {
    const body = await compileMDX(ctx, doc, mdxOptions);
    return { ...doc, body };
  },
});

export default defineConfig({
  content: [Post, Projeto, Nota],
});
