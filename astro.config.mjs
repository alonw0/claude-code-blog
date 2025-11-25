// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';

// https://astro.build/config
export default defineConfig({
  site: 'https://claude-blog.setec.rs', // Update this with your actual domain
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), sitemap()],

  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]
    ],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      wrap: true
    }
  }
});