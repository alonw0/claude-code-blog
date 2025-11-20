# Contributing to Claude Code Blog

Thank you for your interest in contributing to the Claude Code Blog! This document provides guidelines and instructions for submitting blog posts.

## Table of Contents

- [How to Contribute](#how-to-contribute)
- [Content Guidelines](#content-guidelines)
- [Technical Setup](#technical-setup)
- [Submission Process](#submission-process)
- [Style Guide](#style-guide)
- [Code of Conduct](#code-of-conduct)

## How to Contribute

We welcome contributions in several forms:

- **Blog Posts**: Tutorials, guides, tips, and insights about Claude Code
- **Author Profiles**: Your profile to be listed as a contributor
- **Improvements**: Fixes to existing posts, typos, or technical corrections
- **Suggestions**: Ideas for content or site improvements

## Content Guidelines

### What We're Looking For

- Tutorials and how-to guides for Claude Code
- Tips, tricks, and productivity hacks
- Real-world use cases and success stories
- Integration guides with other tools
- Best practices and design patterns
- Feature announcements and updates

### Content Requirements

- **Originality**: Content should be your own or properly attributed
- **Relevance**: Posts should relate to Claude Code or AI-assisted development
- **Quality**: Well-written, proofread content with working code examples
- **Length**: 500-2000 words is ideal, but quality over quantity
- **Tone**: Professional yet conversational, accessible to developers of all levels

## Technical Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- A GitHub account
- Familiarity with Markdown or MDX

### Local Development

1. **Fork the repository**
   ```bash
   # Visit https://github.com/alonw0/claude-code-blog and click "Fork"
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/alonw0/claude-code-blog.git
   cd claude-code-blog
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **View the site**
   Open http://localhost:4321 in your browser

## Submission Process

### 1. Create Your Author Profile

If this is your first contribution, create an author profile:

Create `src/content/authors/your-username.md`:

```markdown
---
name: "Your Name"
bio: "A short bio about yourself (max 160 characters)"
avatar: "https://your-avatar-url.com/image.jpg"
social:
  github: "your-github-username"
  twitter: "your-twitter-handle" # optional
  website: "https://yourwebsite.com" # optional
  linkedin: "your-linkedin" # optional
---
```

**Avatar Guidelines:**
- Use a square image (recommended: 400x400px)
- Accepted formats: JPG, PNG, WebP
- You can use services like [Gravatar](https://gravatar.com) or [DiceBear](https://dicebear.com)

### 2. Write Your Blog Post

Create your post in `src/content/blog/your-post-slug.md` or `.mdx`:

```markdown
---
title: "Your Amazing Post Title"
description: "A compelling description (max 160 characters for SEO)"
publishDate: 2025-01-15
authors: ["alonw0"]  # Must match your author file
tags: ["tutorial", "cli", "productivity"]  # 2-5 tags recommended
featured: false  # Set to true if you think it should be featured
draft: false  # Set to true if you want to submit as draft
---

# Your Post Title

Your content starts here...

## Section Heading

More content...

### Subsection

Code examples:

\`\`\`javascript
console.log('Hello, Claude Code!');
\`\`\`
```

### 3. Add Images (Optional)

If your post includes images:

1. Add images to `public/images/blog/your-post-slug/`
2. Reference them in your post:
   ```markdown
   ![Alt text](/images/blog/your-post-slug/image.png)
   ```

### 4. Test Locally

Before submitting:

```bash
# Run the development server
npm run dev

# Build the site to check for errors
npm run build

# Preview the production build
npm run preview
```

Visit your post at `http://localhost:4321/blog/your-post-slug`

### 5. Submit a Pull Request

1. **Create a new branch**
   ```bash
   git checkout -b add-post-your-topic
   ```

2. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add post: Your Post Title"
   ```

3. **Push to your fork**
   ```bash
   git push origin add-post-your-topic
   ```

4. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template with:
     - Brief description of your post
     - Why it's valuable to the community
     - Any special considerations

## Style Guide

### Markdown Formatting

- Use ATX-style headers (`#` not `===`)
- Use fenced code blocks with language identifiers
- Use meaningful link text (not "click here")
- Add alt text to all images

### Code Examples

- Include complete, runnable examples where possible
- Add comments to explain complex code
- Use syntax highlighting by specifying the language:
  ````markdown
  ```javascript
  // Your code here
  ```
  ````

### Writing Style

- **Be clear**: Avoid jargon unless necessary, explain acronyms
- **Be concise**: Get to the point, respect readers' time
- **Be practical**: Include real-world examples and use cases
- **Be accurate**: Test all code examples and commands
- **Be inclusive**: Use "we" and "you", avoid assumptions about reader knowledge

### Common Tags

Use consistent tags to help readers find content:

- `getting-started` - Introductory content
- `tutorial` - Step-by-step guides
- `tips` - Quick tips and tricks
- `advanced` - Advanced techniques
- `cli` - CLI-specific content
- `features` - New features or announcements
- `guides` - Comprehensive guides
- `productivity` - Workflow and productivity
- `integration` - Tool integrations
- `best-practices` - Recommended patterns

## Review Process

1. **Automated Checks**: PRs run automated checks (build, lint, etc.)
2. **Editorial Review**: Maintainers review for content quality and accuracy
3. **Feedback**: We may request changes or improvements
4. **Approval**: Once approved, your post will be merged
5. **Publication**: Posts go live immediately after merge

**Timeline**: We aim to review PRs within 2-3 business days.

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment, trolling, or discriminatory comments
- Spam or self-promotion without value
- Publishing others' private information
- Any conduct that could reasonably be considered inappropriate

## Recognition

All contributors are recognized in:

- The blog post author section
- Our contributors list
- Social media announcements for featured posts

## Questions?

- **General Questions**: Open an [issue](https://github.com/alonw0/claude-code-blog/issues/new)
- **Technical Problems**: Check existing issues or create a new one
- **Content Ideas**: Open a discussion in the repository

Thank you for contributing to the Claude Code community! 🚀
