# Claude Code Blog Writing Guide

This guide helps you research and write articles for the Claude Code blog. It covers everything from understanding the blog's purpose to publishing your first post.

---

## What This Blog Is About

The **Claude Code Blog** is the community-driven knowledge hub for [Claude Code](https://claude.ai/code), Anthropic's official CLI tool for AI-assisted development.

### Purpose
- Share tutorials, tips, and best practices for using Claude Code
- Announce new features and updates
- Showcase community projects and integrations
- Curate high-quality external content about Claude Code
- Help developers get more value from AI-assisted development

### Audience
- Developers using or interested in Claude Code
- Technical users comfortable with CLI tools
- Software engineers exploring AI-assisted workflows
- Open-source contributors and tool builders

### Editorial Voice
- **Technical but accessible** - Assume technical literacy, but explain complex concepts
- **Practical and actionable** - Focus on real-world usage, not theory
- **Honest and direct** - Share both successes and limitations
- **Community-focused** - Highlight user contributions and real experiences
- **Conversational** - First-person perspective is encouraged ("I've discovered...")

---

## Tech Stack

Understanding the blog's technical foundation helps you work with it effectively.

### Framework
- **Astro 5** - Static site generator with content collections
- **Node.js** - Runtime environment
- **Build output**: Static files to `./dist/`
- **Development server**: `http://localhost:4321`

### Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **Custom Design System**:
  - Primary colors: Clay Orange (#D97757), Crail (#C15F3C)
  - Typography: JetBrains Mono (headings/code), Crimson Pro (body text)
  - Effects: Glass morphism, shimmer gradients, clay glow on hover

### Content Management
- **Content Collections** (Astro v5 with glob loaders)
- **Markdown (.md)** and **MDX (.mdx)** support
- **Frontmatter validation** via Zod schemas
- **Author references** linking posts to author profiles

### Markdown Processing
- `rehype-external-links` - Auto-adds `target="_blank"` to external links
- Dual syntax highlighting themes (light/dark)
- `@astrojs/mdx` - Component support in MDX files
- `astro-embed` - Twitter, YouTube embeds

### Development Commands
```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build for production
npm run preview  # Preview production build
npm run check    # Run Astro type checking
```

---

## Content Schema

All blog posts and authors must follow these schemas defined in `src/content/config.ts`.

### Blog Post Schema

#### Required Fields
```yaml
title: string              # Post title (clear, descriptive)
description: string        # SEO-friendly description (40-60 words)
publishDate: date          # Publication date (YYYY-MM-DD format)
authors: array             # Array of author IDs (e.g., ["claude-code"])
tags: array               # Array of tag strings (e.g., ["tutorial", "cli"])
```

#### Optional Fields
```yaml
image: string             # Hero image URL (relative path: /images/blog/post-slug/hero.png)
draft: boolean            # Default: false (set true to hide from production)
featured: boolean         # Default: false (set true to feature on homepage)

# For external posts (redirects to original source)
externalUrl: url          # Full URL to external article
source: string            # Source name (e.g., "Anthropic Blog")
originalPublishDate: date # Original publication date

# For video content
youtubeUrl: url           # YouTube video URL
```

### Author Schema

#### Required Fields
```yaml
name: string              # Author's full name
bio: string              # Author bio (1-2 sentences)
avatar: string           # Avatar URL (absolute URL)
```

#### Optional Fields
```yaml
social:
  github: string         # GitHub username (no @)
  twitter: string        # Twitter/X handle (no @)
  website: string        # Personal website URL
  linkedin: string       # LinkedIn profile slug
  medium: string         # Medium profile slug
```

---

## Publishing Workflow

Follow these steps to create and publish a new blog post.

### Step 1: Research Your Topic
Before writing, gather information:
- Use Claude Code's documentation and changelog
- Search existing blog posts for related content
- Check GitHub issues/discussions for community insights
- Test features yourself to understand user experience
- Review external sources (Anthropic blog, community posts)

### Step 2: Create or Verify Author Profile

**Check if author exists:**
```bash
ls src/content/authors/
```

**Create new author** (if needed):
```bash
# File: src/content/authors/your-name.md
---
name: "Your Name"
bio: "Brief bio about your background and expertise with Claude Code."
avatar: "https://api.dicebear.com/9.x/pixel-art-neutral/svg"
social:
  github: "yourusername"
  website: "https://yoursite.com"
---
```

**Important:** The filename (without `.md`) becomes the author ID used in blog posts.

### Step 3: Choose Your Content Type

Pick the format that best fits your article:

1. **Tutorial** - Step-by-step guides (installation, setup, usage)
2. **Tips & Tricks** - Numbered list of practical shortcuts/techniques
3. **Feature Deep-Dive** - Detailed exploration of a specific feature
4. **Announcement** - New feature releases or major changes
5. **External Curation** - Link to high-quality external content

### Step 4: Create the Blog Post File

**File location:** `src/content/blog/your-post-slug.md`

**Naming convention:** Use kebab-case (lowercase with hyphens)
- Good: `getting-started-with-claude-code.md`
- Bad: `Getting_Started_With_Claude_Code.md`

### Step 5: Write Your Frontmatter

Choose the appropriate template below based on your content type.

### Step 6: Write Your Content

Follow the writing guidelines and structure patterns (see sections below).

### Step 7: Add Images (Optional)

**Image storage:**
- Create directory: `public/images/blog/your-post-slug/`
- Add images: `hero.png`, `screenshot-1.png`, etc.

**Reference in frontmatter:**
```yaml
image: "/images/blog/your-post-slug/hero.png"
```

**Reference in content:**
```markdown
![Alt text](/images/blog/your-post-slug/screenshot-1.png)
```

### Step 8: Preview Locally

```bash
npm run dev
# Visit http://localhost:4321/blog/your-post-slug
```

### Step 9: Validate

Check for:
- All required frontmatter fields present
- Author ID matches existing author file
- Tags use consistent vocabulary (see Tag Reference below)
- Links work correctly
- Code blocks have language specified
- Images load properly

### Step 10: Submit

Commit your changes and create a pull request.

---

## Content Type Templates

Copy and customize these templates for different article types.

### Template 1: Tutorial Post

**Use for:** Installation guides, setup instructions, step-by-step workflows

```markdown
---
title: "Getting Started with [Feature Name]"
description: "A comprehensive guide to [what users will learn]. Perfect for [target audience]."
publishDate: 2025-01-20
authors: ["your-author-id"]
tags: ["getting-started", "tutorial", "cli"]
featured: false
draft: false
---

# Getting Started with [Feature Name]

[Brief introduction explaining what this feature/tool is and why it's useful.]

## Installation

[Installation instructions with code blocks for multiple methods]

```bash
# Using npm
npm install -g package-name

# Using Homebrew (macOS)
brew install package-name

# Using curl
curl -fsSL https://example.com/install.sh | sh
```

## First Steps

[Initial setup and authentication]

## Basic Usage

[Core functionality broken down into subsections]

### Feature 1

[Explanation with example]

```bash
command-example --flag
```

### Feature 2

[Explanation with example]

## Key Features

### [Feature Name]

[Description and usage example]

### [Feature Name]

[Description and usage example]

## Best Practices

- **Tip 1**: [Description]
- **Tip 2**: [Description]
- **Tip 3**: [Description]

## Next Steps

[Links to related resources or advanced topics]

---

**Resources:**
- [Official Documentation](https://example.com)
- [GitHub Repository](https://github.com/example)
```

### Template 2: Tips & Tricks Post

**Use for:** Productivity hacks, shortcuts, lesser-known features

```markdown
---
title: "10 Claude Code Tips Every Developer Should Know"
description: "Boost your productivity with these essential Claude Code tips, tricks, and shortcuts that will transform your AI-assisted development workflow."
publishDate: 2025-01-20
authors: ["your-author-id"]
tags: ["tips", "productivity", "best-practices"]
featured: false
---

# 10 Claude Code Tips Every Developer Should Know

[Introduction explaining why these tips matter and who they're for]

## 1. [Tip Name]

[Explanation of the tip]

**How to use it:**

```bash
example-command
```

**Why it matters:** [Benefit or use case]

## 2. [Tip Name]

[Repeat pattern for each tip]

## Bonus: [Additional Tip]

[Extra tip as a bonus section]

## Conclusion

[Wrap-up encouraging readers to try the tips and share their own]

**Have your own tips?** Share them in the [community discussions](https://github.com/anthropics/claude-code/discussions)!
```

### Template 3: Feature Deep-Dive

**Use for:** In-depth analysis of specific features, technical explanations

```markdown
---
title: "Understanding [Feature]: [Descriptive Subtitle]"
description: "A deep dive into how [feature] works in Claude Code, why it matters, and how to use it effectively in your projects."
publishDate: 2025-01-20
authors: ["your-author-id"]
tags: ["features", "advanced", "guides"]
featured: true
---

# Understanding [Feature]: [Subtitle]

[Hook: Start with a relatable problem or observation]

## The Problem

[Describe the problem this feature solves]

## How It Works

[Technical explanation of the feature]

### Architecture

[Break down the architecture or design]

### Key Components

#### Component 1

[Explanation]

#### Component 2

[Explanation]

## Why This Matters

[Real-world impact and benefits]

- **Benefit 1**: [Description]
- **Benefit 2**: [Description]
- **Benefit 3**: [Description]

## Getting Started

[Step-by-step usage instructions]

```bash
example-command
```

## Advanced Usage

[More complex scenarios]

## Limitations

[Honest discussion of current limitations or edge cases]

## What's Next

[Future improvements or related features to explore]

---

**Further Reading:**
- [Related Post 1](/blog/related-post-slug)
- [Official Documentation](https://example.com)
```

### Template 4: Announcement Post

**Use for:** Feature releases, major updates, version announcements

```markdown
---
title: "[Feature Name] is Here: [Key Benefit]"
description: "Announcing [feature name] - [brief description of what changed and impact on users]."
publishDate: 2025-01-20
authors: ["your-author-id"]
tags: ["features", "announcement"]
featured: true
---

# [Feature Name] is Here: [Key Benefit]

[Announcement summary with key details]

## What Changed

[Clear explanation of the changes]

**Before (v1.x):**
- [Old behavior 1]
- [Old behavior 2]

**After (v2.x):**
- [New behavior 1]
- [New behavior 2]

## Why This Matters

[Impact on users, performance improvements, new capabilities]

## How It Works

[Detailed breakdown of the new feature]

### Stage 1: [Name]

[Description]

### Stage 2: [Name]

[Description]

## Migration Guide

[If applicable, how to upgrade or adapt]

```bash
# Update to latest version
npm update -g @anthropic-ai/claude-code
```

## Known Issues

[If applicable, any limitations or bugs being addressed]

## What's Next

[Future improvements or related features coming soon]

---

**Resources:**
- [Changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Migration Guide](/blog/migration-guide)
```

### Template 5: External Content Curation

**Use for:** Linking to high-quality external articles, videos, or resources

```markdown
---
title: "External Article Title"
description: "Brief description of what the external article covers and why it's valuable."
publishDate: 2025-01-20
authors: ["curator-author-id"]
tags: ["best-practices", "community"]
externalUrl: "https://example.com/full-article-url"
source: "Source Name (e.g., Anthropic Blog)"
originalPublishDate: 2025-01-15
---

This is an external article hosted on [Source Name].

[Optional: 1-2 paragraph summary of why this article is worth reading and what readers will learn]
```

---

## Writing Guidelines

### Tone and Style

**Do:**
- Write in first-person when sharing experiences ("I discovered...")
- Use conversational language ("Let's explore...", "Here's how...")
- Be direct and specific ("This reduces token usage by 40%" vs "This improves efficiency")
- Use active voice ("Claude processes the request" vs "The request is processed")
- Include code examples for every technique discussed
- Link to related blog posts and official documentation

**Don't:**
- Use corporate jargon or marketing speak
- Make unsupported claims or promises
- Skip error cases or limitations
- Write wall-of-text paragraphs (break up with subheadings)
- Use ambiguous pronouns ("it", "this", "that" without clear referent)

### Content Structure

**Every post should have:**
1. **Hook** - Start with a relatable problem or compelling observation
2. **Clear hierarchy** - Use H2 (##) for sections, H3 (###) for subsections
3. **Code examples** - Every technical concept needs a code block
4. **Visual breaks** - Use lists, blockquotes, or code blocks every 3-4 paragraphs
5. **Clear conclusion** - Summary, next steps, or call-to-action

**Optimal post length:**
- Tutorial: 1,000-1,500 words
- Tips & Tricks: 800-1,200 words
- Feature Deep-Dive: 1,500-2,500 words
- Announcement: 600-1,000 words

### Code Blocks

Always specify the language for syntax highlighting:

````markdown
```bash
npm install -g @anthropic-ai/claude-code
```

```javascript
const result = await claude.chat({
  prompt: "Help me debug this function"
});
```

```typescript
interface Config {
  apiKey: string;
  model: string;
}
```
````

**Supported languages:** bash, javascript, typescript, python, json, yaml, markdown, css, html, rust, go, java, etc.

### Links

**Internal links** (to other blog posts):
```markdown
[Related Post](/blog/post-slug)
```

**External links** (automatically open in new tab):
```markdown
[Anthropic Documentation](https://docs.anthropic.com)
```

**Anchor links** (within same post):
```markdown
[Jump to section](#section-heading)
```

### Images

**Hero images** (frontmatter):
```yaml
image: "/images/blog/your-post-slug/hero.png"
```

**Inline images:**
```markdown
![Descriptive alt text](/images/blog/your-post-slug/screenshot.png)
```

**Best practices:**
- Use descriptive alt text for accessibility
- Optimize images (compress before uploading)
- Use consistent aspect ratios
- Store in post-specific directory: `public/images/blog/post-slug/`

### Lists

**Unordered lists** for non-sequential items:
```markdown
- Feature 1
- Feature 2
- Feature 3
```

**Ordered lists** for sequential steps:
```markdown
1. Install Claude Code
2. Authenticate with API key
3. Run your first command
```

**Nested lists:**
```markdown
- Main item
  - Sub-item 1
  - Sub-item 2
- Another main item
```

### Emphasis

- **Bold** for emphasis or key terms: `**important**`
- *Italic* for slight emphasis or terms: `*subtle*`
- `Inline code` for commands, variables, file names: `` `command` ``
- > Blockquotes for important callouts or quotes

---

## Tag Reference

Use consistent tags to improve discoverability and organization.

### Common Tags

**By Topic:**
- `getting-started` - Introductory content for new users
- `tutorial` - Step-by-step instructional content
- `tips` - Quick tips and tricks
- `best-practices` - Recommended approaches and patterns
- `advanced` - Complex or expert-level content
- `guides` - Comprehensive how-to guides

**By Feature Area:**
- `cli` - Command-line interface features
- `features` - New feature announcements or deep-dives
- `skills` - Claude Code skills system
- `agents` - Agent-related functionality
- `planning` - Plan mode and planning features
- `workflow` - Development workflow improvements

**By Technology:**
- `frontend` - Frontend development topics
- `design` - Design-related content
- `integration` - Integration with other tools
- `mcp` - Model Context Protocol

**By Purpose:**
- `productivity` - Productivity improvements
- `development` - General development topics
- `community` - Community contributions or highlights
- `announcement` - Product announcements

### Tagging Guidelines

- Use 3-5 tags per post
- Choose from established tag vocabulary (see above)
- Prioritize specificity (use both `tutorial` and `getting-started` if applicable)
- Don't create new tags without good reason
- Maintain consistency with existing posts on similar topics

---

## Frontmatter Examples

### Example 1: Standard Tutorial

```yaml
---
title: "Getting Started with Claude Code"
description: "A comprehensive guide to installing and using Claude Code, the official CLI for Claude that brings AI-assisted development to your terminal."
publishDate: 2025-01-15
authors: ["claude-code"]
tags: ["getting-started", "tutorial", "cli"]
featured: false
draft: false
---
```

### Example 2: Featured Deep-Dive with Multiple Authors

```yaml
---
title: "Fighting 'AI Slop': How Claude Code Skills Transform Frontend Design"
description: "Anthropic's new frontend design skill fights generic AI aesthetics by teaching Claude to avoid purple gradients, Inter fonts, and cookie-cutter layouts - here's how it works and why it matters"
publishDate: 2025-11-19
authors:
  - alon-wolenitz
  - claude-code
tags:
  - skills
  - frontend
  - design
  - features
  - development
featured: true
draft: false
image: "/images/blog/frontend-design-skills/hero.png"
---
```

### Example 3: Tips & Tricks Post

```yaml
---
title: "10 Claude Code Tips and Tricks"
description: "Boost your productivity with these essential Claude Code tips, tricks, and keyboard shortcuts that will transform your AI-assisted development workflow."
publishDate: 2025-01-16
authors: ["claude"]
tags: ["tips", "productivity", "best-practices"]
featured: false
---
```

### Example 4: External Post (Redirect)

```yaml
---
title: "Claude Code Best Practices for Large Codebases"
description: "Learn proven strategies for using Claude Code effectively with large, complex codebases. Tips for context management, efficient workflows, and getting better results."
publishDate: 2025-01-18
authors: ["claude"]
tags: ["best-practices", "advanced", "productivity"]
externalUrl: "https://www.anthropic.com/news/claude-code-large-repos"
source: "Anthropic Blog"
originalPublishDate: 2025-01-15
---

This is an external article hosted on the Anthropic Blog.
```

### Example 5: Video Content

```yaml
---
title: "Watch: Building a Full-Stack App with Claude Code"
description: "Video walkthrough of building a complete full-stack application using Claude Code, from initial setup to deployment."
publishDate: 2025-01-20
authors: ["community-creator"]
tags: ["tutorial", "video", "full-stack"]
youtubeUrl: "https://www.youtube.com/watch?v=example"
featured: false
---
```

### Example 6: Draft Post (Hidden from Production)

```yaml
---
title: "Upcoming Feature Preview: Multi-Agent Workflows"
description: "Preview of the upcoming multi-agent workflow feature coming to Claude Code."
publishDate: 2025-02-01
authors: ["claude-code"]
tags: ["features", "announcement", "agents"]
draft: true
---
```

---

## Best Practices

### Do's

**Research:**
- Test features yourself before writing about them
- Reference official documentation for accuracy
- Check existing blog posts to avoid duplication
- Cite sources for external information or claims

**Writing:**
- Start with the user's problem or question
- Provide working code examples for every concept
- Include both simple and advanced usage examples
- Explain the "why" not just the "how"
- Link to related posts and resources

**Technical:**
- Always specify language in code blocks
- Use consistent terminology throughout
- Include error handling in code examples
- Mention prerequisites or requirements upfront

**SEO:**
- Write descriptive, keyword-rich titles
- Create compelling 40-60 word descriptions
- Use descriptive headings (H2, H3) for structure
- Include relevant internal links

### Don'ts

**Content:**
- Don't make promises about future features
- Don't skip limitations or edge cases
- Don't assume reader knowledge without linking to resources
- Don't use marketing language or hype

**Technical:**
- Don't include code without testing it
- Don't use screenshots when code blocks are better
- Don't create new tags without checking existing ones
- Don't forget to specify required vs optional fields

**Writing:**
- Don't write walls of text without breaks
- Don't use ambiguous pronouns
- Don't skip code examples for technical concepts
- Don't forget to proofread for typos and errors

---

## Common Patterns in Existing Posts

### Tutorial Structure
1. Introduction (what + why)
2. Installation/Setup
3. Basic Usage
4. Key Features (subsections for each)
5. Best Practices
6. Next Steps/Resources

### Tips & Tricks Structure
1. Introduction
2. Numbered tips (1-10)
   - Tip name
   - Explanation
   - Code example
   - Why it matters
3. Bonus section
4. Community call-to-action

### Feature Deep-Dive Structure
1. Hook/Problem statement
2. Background/Context
3. How it works
   - Architecture
   - Key components
4. Why this matters
5. Getting started
6. Advanced usage
7. Limitations
8. Further reading

### Announcement Structure
1. Summary of change
2. What changed (before/after)
3. Why this matters
4. How it works (breakdown)
5. Migration guide (if applicable)
6. Known issues
7. What's next

---

## File Paths Reference

**Content:**
- Blog posts: `src/content/blog/*.md` or `*.mdx`
- Authors: `src/content/authors/*.md`
- Schema: `src/content/config.ts`

**Images:**
- Public directory: `public/images/blog/[post-slug]/`
- Reference in frontmatter: `/images/blog/[post-slug]/image.png`

**Pages:**
- Homepage: `src/pages/index.astro`
- Blog index: `src/pages/blog/index.astro`
- Post template: `src/pages/blog/[...slug].astro`
- Author page: `src/pages/authors/[author].astro`

**Styles:**
- Global CSS: `src/styles/global.css`
- Design tokens defined with Tailwind CSS v4 syntax

**Configuration:**
- Astro config: `astro.config.mjs`
- TypeScript config: `tsconfig.json`
- Package config: `package.json`

---

## Quick Start Checklist

Use this checklist when creating a new blog post:

- [ ] Author profile exists in `src/content/authors/`
- [ ] Post file created in `src/content/blog/` with kebab-case name
- [ ] All required frontmatter fields included (title, description, publishDate, authors, tags)
- [ ] Author ID matches existing author file
- [ ] Tags chosen from established vocabulary
- [ ] Description is 40-60 words and SEO-friendly
- [ ] Code blocks include language specification
- [ ] External links tested and working
- [ ] Images stored in `public/images/blog/[post-slug]/`
- [ ] Post previewed locally (`npm run dev`)
- [ ] No TypeScript errors (`npm run check`)
- [ ] Content follows writing guidelines (tone, structure)
- [ ] Proofread for typos and technical accuracy

---

## Additional Resources

**Official Documentation:**
- [Astro Documentation](https://docs.astro.build)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Tailwind CSS v4](https://tailwindcss.com)

**Claude Code Resources:**
- [Claude Code GitHub](https://github.com/anthropics/claude-code)
- [Claude Code Documentation](https://docs.anthropic.com/claude/docs/claude-code)
- [Community Discussions](https://github.com/anthropics/claude-code/discussions)

**Blog Repository:**
- Project `CLAUDE.md` file for technical details
- `CONTRIBUTING.md` for contribution guidelines
- Existing blog posts in `src/content/blog/` for examples

---

## Questions?

If you have questions about writing for the blog:
1. Read existing posts for examples and patterns
2. Check the schema in `src/content/config.ts` for validation rules
3. Review `CLAUDE.md` for technical project details
4. Test locally with `npm run dev` before submitting

Happy writing!
