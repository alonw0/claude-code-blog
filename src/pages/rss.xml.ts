import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const blog = await getCollection('blog');
  const publishedPosts = blog
    .filter(post => !post.data.draft)
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());

  return rss({
    title: 'Claude Code Blog',
    description: 'News, features, and guides for Claude Code - the official CLI for Claude.',
    site: context.site || 'https://claude-code-blog.dev',
    items: publishedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}
