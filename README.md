# Claude Code Blog

> News, features, and guides for Claude Code - the official CLI for Claude.

A beautiful, open-source blog built with Astro and Tailwind CSS, featuring Claude Code's signature clay orange design language.

## ✨ Features

- 🎨 **Beautiful Design**: Custom design system with Claude Code's clay orange palette
- 🌙 **Dark Mode**: Three-state theme toggle (Light/Dark/Auto)
- 📝 **Hybrid Content**: Support for both Markdown and MDX
- 👥 **Multi-Author**: Built-in author profiles and attribution
- 🏷️ **Tag System**: Organize and filter posts by tags
- 📡 **RSS Feed**: Subscribe to updates
- 🚀 **Fast & Modern**: Built with Astro for optimal performance
- ♿ **Accessible**: WCAG 2.1 AA compliant
- 📱 **Responsive**: Mobile-first design
- 🤝 **Community-Driven**: Accept contributions via GitHub PR

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/alonw0/claude-code-blog.git
cd claude-code-blog

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see the blog.

## 📝 Contributing

We welcome contributions from the community! Here's how you can help:

### Writing a Blog Post

1. Fork this repository
2. Create your author profile in `src/content/authors/alonw0.md`
3. Write your post in `src/content/blog/your-post.md` or `.mdx`
4. Test locally with `npm run dev`
5. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

### Quick Post Template

```markdown
---
title: "Your Post Title"
description: "A compelling description"
publishDate: 2025-01-15
authors: ["alonw0"]
tags: ["tutorial", "tips"]
featured: false
---

# Your Content Here

Write your amazing content...
```

## 🛠️ Development

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro` | Run Astro CLI commands |

### Project Structure

```
claude-code-blog/
├── public/              # Static assets
│   ├── images/          # Blog images
│   └── favicon.svg      # Site favicon
├── src/
│   ├── components/      # Reusable components
│   │   ├── blog/        # Blog-specific components
│   │   ├── layout/      # Layout components
│   │   ├── mdx/         # MDX custom components
│   │   └── ui/          # UI primitives
│   ├── content/         # Content collections
│   │   ├── blog/        # Blog posts (.md, .mdx)
│   │   ├── authors/     # Author profiles (.md)
│   │   └── config.ts    # Collections schema
│   ├── layouts/         # Page layouts
│   ├── pages/           # File-based routing
│   ├── styles/          # Global styles
│   └── utils/           # Utility functions
├── astro.config.mjs     # Astro configuration
└── CONTRIBUTING.md      # Contribution guidelines
```

## 🎨 Design System

The blog uses Claude Code's design language with a custom color palette:

### Colors

- **Clay Orange**: `#D97757` - Primary brand color
- **Crail**: `#C15F3C` - Secondary brand color
- **Dark Neutrals**: Gray-950 to Gray-600
- **Light Neutrals**: Gray-50, Pampas, Cloudy

### Typography

- **Headings**: JetBrains Mono (monospace)
- **Body**: Crimson Pro (serif)
- **Code**: JetBrains Mono

### Key Design Elements

- Glass morphism effects
- Animated shimmer gradients
- Terminal-style decorations
- Clay glow effects on hover

## 🔧 Configuration

### Site Configuration

Update `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://your-domain.com', // Your production URL
  // ... other config
});
```

### Theme Customization

Modify design tokens in `src/styles/global.css`:

```css
:root {
  --color-clay: 217 119 87;
  --font-mono: 'JetBrains Mono', monospace;
  /* ... more variables */
}
```

## 📦 Deployment

### Deploy to Vercel (Recommended)

This project is optimized for Vercel deployment with zero configuration:

**Option 1: Deploy via Vercel Dashboard**

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel will auto-detect Astro framework settings
5. Click "Deploy"

**Option 2: Deploy via Vercel CLI**

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from your project directory
vercel

# Follow the prompts to link/create project
```

**Configuration Files:**
- `vercel.json` - Deployment settings (build command, output directory)
- `.vercelignore` - Files to exclude from deployment

**After Deployment:**
1. Update `astro.config.mjs` with your production domain:
   ```js
   site: 'https://your-app.vercel.app'
   ```
2. Redeploy to update sitemap and RSS URLs

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/alonw0/claude-code-blog)

### Manual Deployment

```bash
# Build the site
npm run build

# The output is in ./dist/
# Upload to your hosting provider
```

**Build Settings for Manual Deployment:**
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 18+

## 📄 License

This project is open source and available under the [MIT License](./LICENSE).

## 🙏 Acknowledgments

- Built with [Astro](https://astro.build)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Inspired by [Claude Code](https://claude.com/claude-code)
- Fonts: [JetBrains Mono](https://www.jetbrains.com/lp/mono/) & [Crimson Pro](https://fonts.google.com/specimen/Crimson+Pro)

## 🤝 Community

- **Discussions**: [GitHub Discussions](https://github.com/alonw0/claude-code-blog/discussions)
- **Issues**: [GitHub Issues](https://github.com/alonw0/claude-code-blog/issues)
- **Contributions**: See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Built with ❤️ and [Claude Code](https://claude.com/claude-code)**
