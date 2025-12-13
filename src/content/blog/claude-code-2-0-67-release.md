---
title: "Claude Code v2.0.67: Prompt Suggestions and Thinking Mode by Default"
description: "Claude Code v2.0.67 adds prompt suggestions (Tab to accept), enables thinking mode by default for Opus 4.5, improves /permissions search, and fixes 7 bugs."
publishDate: 2025-12-11
authors: ["claude-code"]
tags: ["release", "features", "productivity"]
featured: false
draft: false
---

# Claude Code v2.0.67: Prompt Suggestions and Thinking Mode by Default

You start typing a request. Before you finish, Claude suggests the complete prompt. Press Tab to accept it. Press Enter to submit as-is.

Claude Code v2.0.67 introduces prompt suggestions to speed up your workflow, enables thinking mode by default for Opus 4.5, adds search to the permissions system, and ships with 7 bug fixes including better support for non-Latin text.

## Prompt Suggestions: The Headline Feature

**What changed:** Claude now suggests prompts to speed up your workflow. As you type, Claude offers suggestions for completing your request.

**How to use:**
- **Tab**: Accept the suggested prompt
- **Enter**: Submit your prompt as-is (ignoring the suggestion)

**Why it matters:** Common workflows get faster. If Claude recognizes the pattern of what you're typing, it can suggest the complete prompt - saving you keystrokes and time on repetitive tasks.

The feature is designed to accelerate familiar patterns without getting in the way when you're crafting custom requests.

## Thinking Mode: Now Default for Opus 4.5

**What changed:** Thinking mode is now enabled by default for Claude Opus 4.5.

**Why this matters:** Opus 4.5 benefits from extended reasoning for complex tasks. By enabling thinking mode by default, you get this capability automatically without manual configuration.

**Configuration moved:** Thinking mode settings have moved to the `/config` command. If you need to adjust thinking mode behavior, use `/config` instead of previous configuration methods.

## Permissions Search

**What's new:** The `/permissions` command now includes search functionality.

**How to use:** Press `/` (forward slash) to activate search and filter permission rules by tool name.

**Why it helps:** If you have many permission rules configured, finding the one you need to review or modify can be tedious. The search filter makes large permission lists manageable - type a tool name to instantly filter the view.

## Doctor Improvements

**What's new:** The `/doctor` diagnostic command now shows the reason why the autoupdater is disabled (when applicable).

**Why this helps:** Previously, if autoupdate wasn't working, `/doctor` would tell you it was disabled but not why. Now you get the specific reason, making it easier to troubleshoot update issues or understand intentional configurations.

## Bug Fixes

Version 2.0.67 includes seven bug fixes spanning workflow improvements, internationalization, and platform-specific issues:

### 1. False Update Error

**Fixed:** False "Another process is currently updating Claude" error when running `claude update` while another instance is already on the latest version.

**Impact:** You can now run `claude update` on multiple instances without spurious errors when they're already current.

### 2. MCP Servers in Non-Interactive Mode

**Fixed:** MCP servers from `.mcp.json` being stuck in pending state when running in non-interactive mode (`-p` flag or piped input).

**Impact:** Scripted or piped workflows that rely on MCP servers now work correctly. Previously, non-interactive execution would leave MCP servers in a pending state, breaking automation.

### 3. Permissions Scroll Reset

**Fixed:** Scroll position resetting after deleting a permission rule in `/permissions`.

**Impact:** When managing multiple permission rules, deleting one no longer jumps you back to the top of the list. Your scroll position is preserved, making it easier to work through a series of changes.

### 4. Word Operations with Non-Latin Text

**Fixed:** Word deletion (`opt+delete` on macOS, `alt+delete` on Linux/Windows) and word navigation (`opt+arrow` / `alt+arrow`) not working correctly with non-Latin text such as Cyrillic, Greek, Arabic, Hebrew, Thai, and Chinese.

**Impact:** Better internationalization support. Users working with non-Latin scripts can now use keyboard shortcuts for word-based editing operations just like English users.

**Before:** Word deletion and navigation would behave incorrectly with scripts like:
- Cyrillic (Russian, Bulgarian, Serbian, etc.)
- Greek
- Arabic and Hebrew (RTL scripts)
- Thai
- Chinese

**After:** These operations correctly recognize word boundaries in all supported scripts.

### 5. Install Force with Stale Locks

**Fixed:** `claude install --force` not bypassing stale lock files.

**Impact:** The `--force` flag now does what it promises. If installation is blocked by a stale lock file (from a crashed or killed installation), `--force` will bypass it and proceed.

### 6. File Reference Parsing in CLAUDE.md

**Fixed:** Consecutive `@~/` file references in CLAUDE.md being incorrectly parsed due to markdown strikethrough interference.

**Impact:** If your CLAUDE.md file uses multiple `@~/` references in sequence, they're now parsed correctly. Previously, markdown's strikethrough syntax (`~~text~~`) was interfering with the tilde characters in file paths.

**Example that now works correctly:**
```markdown
Follow conventions from @~/standards/code-style.md and @~/standards/testing.md
```

### 7. Windows: Plugin MCP Servers

**Windows-specific fix:** Plugin MCP servers failing due to colons in log directory paths.

**Impact:** Windows users can now use plugin-based MCP servers without path-related failures. Colons in Windows paths (like `C:\Users\...`) were causing issues with plugin logging - this is now handled correctly.

## Getting Started

These features are available in Claude Code v2.0.67. Update to the latest version:

```bash
# Update Claude Code
npm update -g @anthropic-ai/claude-code

# Or check your current version
claude --version
```

**Try prompt suggestions:**
1. Start typing a common request in Claude Code
2. Watch for Claude's prompt suggestion to appear
3. Press Tab to accept the suggestion, or Enter to submit as-is
4. Continue with your workflow

**Check thinking mode:**
Opus 4.5 now has thinking mode enabled by default. To verify or adjust settings, use `/config`.

**Use permissions search:**
1. Type `/permissions` in Claude Code
2. Press `/` to activate search
3. Type a tool name to filter the list

## What's Next

Claude Code v2.0.67 focuses on workflow acceleration (prompt suggestions), smarter defaults (thinking mode for Opus 4.5), and internationalization (non-Latin text support). The release demonstrates ongoing attention to both headline features and quality-of-life improvements.

For complete release notes and updates, see the [official changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md).

---

**Resources:**
- [Claude Code Official Changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Claude Code GitHub Repository](https://github.com/anthropics/claude-code)
- [Claude Code Documentation](https://code.claude.com/docs)
