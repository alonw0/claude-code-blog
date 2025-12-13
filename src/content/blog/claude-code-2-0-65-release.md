---
title: "Claude Code v2.0.65: Switch Models Mid-Prompt and More"
description: "Claude Code v2.0.65 lets you switch models while typing with alt+p/option+p, shows context window info in the status line, adds custom file suggestions, and includes bug fixes."
publishDate: 2025-12-11
authors: ["claude-code"]
tags: ["release", "features", "productivity"]
featured: false
draft: false
---

# Claude Code v2.0.65: Switch Models Mid-Prompt and More

You're halfway through composing a detailed prompt. Three paragraphs explaining the context, two code examples, specific requirements. Then you realize: wrong model. You need Opus for this, not Sonnet.

**Before v2.0.65:** Ctrl+C to abort. `/model` to switch. Retype everything. Or copy-paste if you remembered to select it first.

**With v2.0.65:** Hit `alt+p` (or `option+p` on macOS). Switch models. Your prompt stays intact. Continue typing.

Claude Code v2.0.65 introduces mid-prompt model switching alongside several quality-of-life improvements and bug fixes.

## Model Switching: The Headline Feature

**What changed:** You can now switch models while composing a prompt using a keyboard shortcut. Your prompt text is preserved - no retyping required.

**Keyboard shortcuts:**
- **Linux/Windows:** `alt+p`
- **macOS:** `option+p`

**Why it matters:** You don't always know which model you need until you're formulating the request. Maybe you started typing assuming it's a quick task, then realized it requires deeper reasoning. Or you picked Haiku for speed but encountered complexity that needs Opus. Previously, switching models meant losing your work-in-progress. Now it's a keystroke.

**How it works:** Press the shortcut while typing your prompt. Select the model. Continue from where you left off.

## Context Window in Status Line

Claude Code now displays context window information in the status line input.

**What this means:** You can see the model's context limits while composing your prompt. This visibility helps you understand how much context you're working with and whether you're approaching limits.

## Custom File Suggestions

Version 2.0.65 adds a new `fileSuggestion` setting.

**Purpose:** Customize `@` file search commands.

**What you can do:** The changelog doesn't elaborate on specific configuration options, but this setting provides control over how Claude Code suggests files when you use the `@` mention system for referencing files in your prompts.

## Shell Override Variable

A new environment variable `CLAUDE_CODE_SHELL` allows you to override automatic shell detection.

**Use case:** When your login shell differs from your actual working shell.

**Why this exists:** Claude Code automatically detects your shell, but in some environments (particularly when login shells are configured differently from interactive shells), you need manual control. Set `CLAUDE_CODE_SHELL` to specify which shell Claude Code should use.

**Example scenarios:**
- Your login shell is `/bin/bash` but you use `zsh` for work
- Corporate environments with restricted default shells
- Custom shell configurations that auto-detection doesn't handle correctly

## Bug Fixes

### Prompt History on Escape

**Fixed:** Prompts are now properly saved to history when you abort a query with the Escape key.

**Before:** Aborting with Escape meant your prompt wasn't recorded in history. If you wanted to reference or reuse it later, it was gone.

**After:** Escape-aborted prompts save to history like completed ones. You can retrieve them with up-arrow or history search.

### Read Tool Image Format Detection

**Fixed:** The Read tool now identifies image formats from file bytes instead of relying on file extensions.

**Why this matters:** File extensions can be wrong, missing, or misleading. JPEGs masquerading as PNGs, files without extensions, or incorrectly named images would confuse the Read tool. Detecting format from actual file content (magic bytes) is more reliable and handles edge cases gracefully.

## Getting Started

These features are available immediately in Claude Code v2.0.65. For the model switching shortcut, just update to the latest version:

```bash
# Update Claude Code
npm update -g @anthropic-ai/claude-code
```

**Try the model switcher:**
1. Start composing a prompt in Claude Code
2. Press `alt+p` (or `option+p` on macOS) mid-composition
3. Select a different model
4. Continue typing - your prompt remains intact

**Environment variable setup:**
```bash
# Add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
export CLAUDE_CODE_SHELL=/path/to/your/preferred/shell
```

## What's Next

Claude Code v2.0.65 continues the pattern of workflow refinements that remove friction from daily development tasks. Model switching is the kind of feature you don't realize you need until you have it - then switching models without it feels broken.

Check the [official changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) for complete release notes and updates.

---

**Resources:**
- [Claude Code Official Changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Claude Code GitHub Repository](https://github.com/anthropics/claude-code)
- [Claude Code Documentation](https://code.claude.com/docs)
