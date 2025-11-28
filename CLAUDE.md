# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based blog for Claude Code built with Tailwind CSS v4. It features a custom design system using Claude Code's signature clay orange color palette and supports both Markdown and MDX content.

## Development Commands

```bash
# Start development server at localhost:4321
npm run dev

# Build for production (output to ./dist/)
npm run build

# Preview production build locally
npm run preview

# Run Astro type checking
npm run check

# Run any Astro CLI command
npm run astro [command]
```

## Architecture

### Content Collections

The blog uses Astro Content Collections (v5 with glob loaders) defined in `src/content/config.ts`:

- **blog**: Blog posts (`.md` or `.mdx` files) in `src/content/blog/`
  - Required frontmatter: `title`, `description`, `publishDate`, `authors` (array of author references), `tags`
  - Optional: `image`, `draft`, `featured`, `externalUrl`, `source`, `originalPublishDate`, `youtubeUrl`
  - Authors field uses Astro's `reference()` to link to author collection

- **authors**: Author profiles (`.md` files) in `src/content/authors/`
  - Required: `name`, `bio`, `avatar`
  - Optional social links: `github`, `twitter`, `website`, `linkedin`, `medium`

### Routing & Pages

File-based routing in `src/pages/`:

- `/` - Homepage with featured posts
- `/blog/` - Blog index with all posts
- `/blog/[...slug]` - Individual blog post pages
- `/blog/tag/[tag]` - Tag-filtered blog listings
- `/authors/` - All authors page
- `/authors/[author]` - Author-specific posts
- `/news` - Fetches and displays Anthropic news from external RSS feed
- `/changelog` - Fetches and renders Claude Code's CHANGELOG.md from GitHub
- `/tools` - Directory of community tools and extensions
- `/contribute` - Contribution guidelines
- `/status` - Links to status page
- `/rss.xml` - RSS feed (generated in `src/pages/rss.xml.ts`)

### External Data Fetching

The site fetches live data from external sources:

- **Changelog** (`src/utils/changelog.ts`): Fetches and parses `CHANGELOG.md` from the official Claude Code GitHub repo using `marked`
- **News** (`src/utils/rss.ts`): Fetches Anthropic news RSS feed using `fast-xml-parser`

Both use `cache: 'default'` for browser caching.

### Design System

Custom design tokens in `src/styles/global.css`:

- **Primary Colors**: Clay Orange (`#D97757`), Crail (`#C15F3C`)
- **Typography**: JetBrains Mono (headings/mono), Crimson Pro (body/serif)
- **Effects**: Glass morphism, shimmer gradients, clay glow on hover
- Uses Tailwind CSS v4 with `@tailwindcss/typography` for prose content

### Markdown Processing

Configured in `astro.config.mjs`:

- `rehype-external-links`: Automatically adds `target="_blank"` and `rel="noopener noreferrer"` to external links
- Syntax highlighting: Dual themes (github-light/github-dark) with code wrapping enabled
- MDX support via `@astrojs/mdx`
- Embeds support via `astro-embed` (Twitter, YouTube, etc.)

### Build & Deployment

- **Framework**: Astro 5 (static site generation)
- **Output**: Static files to `./dist/`
- **Deployment**: Optimized for Vercel (see `vercel.json`)
- **Site URL**: Configured in `astro.config.mjs` (currently `https://claude-blog.setec.rs`)

## Content Guidelines

### Writing Blog Posts

1. Create either `.md` or `.mdx` file in `src/content/blog/`
2. Use kebab-case filenames (e.g., `my-awesome-post.md`)
3. Include all required frontmatter fields
4. Store images in `public/images/blog/[post-slug]/`
5. Reference images as `/images/blog/[post-slug]/image.png`

### Creating Author Profiles

1. Create `.md` file in `src/content/authors/` matching the author ID
2. Author ID in filename must match the ID used in blog post `authors` array
3. Avatar URLs should be permanent (use Gravatar, GitHub, or DiceBear)

### Tags

Common tags (from `CONTRIBUTING.md`): `getting-started`, `tutorial`, `tips`, `advanced`, `cli`, `features`, `guides`, `productivity`, `integration`, `best-practices`

### External Posts

For posts originally published elsewhere, use the `externalUrl`, `source`, and `originalPublishDate` fields to properly attribute content.

## TypeScript Configuration

- Extends Astro's strict TypeScript config
- Type checking via `npm run check`
- Auto-generated types in `.astro/types.d.ts`

## Analytics & Monitoring

- Vercel Analytics integrated via `@vercel/analytics`
- External status page linked from `/status`
