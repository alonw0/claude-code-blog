---
title: "Claude Code v2.0.70: 3x Memory Improvement and Plugin Control"
description: "Claude Code v2.0.70 delivers 3x better memory usage for large conversations, per-marketplace plugin updates, wildcard MCP permissions, and improved prompt shortcuts."
publishDate: 2025-12-16
authors: ["claude-code"]
tags: ["release", "features", "productivity", "performance"]
featured: false
draft: false
---

# Claude Code v2.0.70: 3x Memory Improvement and Plugin Control

Long conversations with Claude Code can push the limits of what's feasible. Complex refactoring tasks, architectural discussions, or multi-step debugging sessions accumulate context quickly. Previously, large conversations consumed memory inefficiently, leading to performance degradation.

Claude Code v2.0.70 changes this with a 3x memory improvement for large conversations, alongside granular plugin update control, wildcard MCP permissions, and enhanced prompt suggestion shortcuts.

## 3x Memory Improvement for Large Conversations

**What changed:** Memory usage has been improved by 3x for large conversations.

**Why this matters:** Large conversations are where Claude Code shows its real value - refactoring entire modules, debugging complex issues across multiple files, or planning multi-step implementations. When memory usage balloons, performance suffers. Context windows fill up faster, and the CLI becomes less responsive.

**Impact:** With 3x better memory efficiency, you can maintain longer conversations without hitting performance walls. Architectural discussions that span dozens of exchanges, debugging sessions that accumulate extensive context, or multi-file refactoring workflows now run smoothly where they previously degraded.

This is infrastructure work that doesn't change how you use Claude Code - it just makes everything scale better.

## Per-Marketplace Plugin Control

**What changed:** You can now control automatic plugin updates on a per-marketplace basis.

**Why this matters:** Not all plugins are equal when it comes to update policies. Some plugins are stable and critical to your workflow - you want them updated automatically. Others are experimental or in active development - you might prefer manual control over when updates land.

**How it works:** Configure plugin auto-update behavior separately for each marketplace. This gives you granular control: enable auto-updates for trusted plugin sources while maintaining manual oversight for others.

**Use case example:** You might auto-update official Anthropic plugins while keeping third-party or custom plugins on manual update schedules, letting you test changes in controlled environments before they hit production workflows.

## Wildcard MCP Permissions

**What's new:** The permissions system now supports wildcard syntax for MCP tools: `mcp__server__*`.

**Why this helps:** As MCP servers grow in capability, managing permissions tool-by-tool becomes tedious. A server might expose dozens of tools - granting or denying each individually creates friction and makes permission policies hard to maintain.

**How to use:** Use the wildcard syntax `mcp__server__*` to grant or deny permissions for all tools from a specific MCP server at once. This scales permission management from per-tool to per-server.

**Example scenario:** If you trust an MCP server completely, grant `mcp__server__*` permissions once instead of approving each tool individually. Conversely, if you want to block an entire server, deny `mcp__server__*` rather than maintaining a blocklist of individual tools.

## Prompt Suggestion Shortcuts

**What changed:** The Enter key now accepts and submits prompt suggestions immediately. The Tab key still accepts suggestions for editing.

**Why this matters:** Keyboard shortcuts should be unambiguous. When Claude Code suggests a prompt, you have two clear actions:
- **Enter:** Accept the suggestion and submit it immediately
- **Tab:** Accept the suggestion but keep editing

**Impact:** This removes decision friction. If the suggestion is exactly what you want, hit Enter and go. If you want to modify it, Tab lets you continue typing. The shortcuts match their intent clearly.

## Context Window Visibility

**What's new:** A new `current_usage` field has been added to the status line input.

**Purpose:** This field enables accurate context window percentage calculations, giving you visibility into how much of your available context window you're using while composing prompts.

**Why it helps:** Context window awareness matters for long conversations. Knowing when you're approaching limits helps you make informed decisions about summarizing, splitting tasks, or starting fresh conversations.

## Plan Mode Enforcement for Teams

**What's new:** A new `plan_mode_required` spawn parameter allows teammates to mandate plan approval before implementing modifications.

**Use case:** In team environments or when spawning specialized agents, you might want to enforce a review step before code changes happen. The `plan_mode_required` parameter makes this mandatory - the agent must present a plan and receive approval before proceeding with implementation.

**Why this matters:** It provides guardrails for automated workflows and team coordination, ensuring that significant changes go through a review process rather than happening automatically.

## Bug Fixes and Polish

Version 2.0.70 includes seven bug fixes and improvements spanning input handling, terminal display, and configuration persistence:

### 1. Input Clearing During Queued Commands

**Fixed:** Input clearing issue when processing queued commands while the user is typing.

**Impact:** Previously, if Claude Code was processing queued commands while you were typing, your input could get cleared unexpectedly. This is now handled correctly - your typing is preserved.

### 2. Tab Key with Prompt Suggestions

**Fixed:** Tab key no longer replaces typed input with prompt suggestions.

**Impact:** The Tab key behavior is now consistent with the updated prompt suggestion workflow. It accepts suggestions for editing without replacing text you've already typed.

### 3. Terminal Resizing and Diff View

**Fixed:** Terminal resizing now properly updates the diff view display.

**Impact:** When you resize your terminal window, diff views now reflow and display correctly instead of showing layout issues. Better support for dynamic terminal environments and multi-monitor workflows.

### 4. Stats Screenshot Resolution

**Fixed:** Stats screenshot resolution enhanced via Ctrl+S clipboard copying.

**Impact:** When you copy stats screenshots to your clipboard with Ctrl+S, they now have better resolution, making them clearer and more readable when pasted into documentation or shared with teammates.

### 5. Memory Entry Shortcut Removed

**Fixed:** Removed the # shortcut for memory entry.

**Impact:** Users are now directed to edit CLAUDE.md directly instead of using the # shortcut. This simplifies the interface and makes memory configuration more explicit and maintainable.

### 6. Thinking Mode Config Persistence

**Fixed:** Thinking mode toggle configuration in `/config` now persists correctly.

**Impact:** When you change thinking mode settings via `/config`, they're now saved properly across sessions. Previously, these configuration changes wouldn't persist, requiring you to reconfigure every time.

### 7. File Creation Permission Dialog UI

**Fixed:** Improved UI for file creation permission dialogs.

**Impact:** Permission dialogs for file creation are now clearer and easier to interact with, reducing confusion when Claude Code requests permission to write new files.

## Getting Started

These features are available in Claude Code v2.0.70. Update to the latest version:

```bash
# Update Claude Code
npm update -g @anthropic-ai/claude-code

# Check your current version
claude --version
```

**Experience the memory improvements:**
Start a complex, multi-file refactoring task or an architectural discussion. The 3x memory improvement works behind the scenes - you'll notice smoother performance in conversations that previously slowed down.

**Try the prompt suggestion shortcuts:**
1. Wait for Claude Code to suggest a prompt
2. Press **Enter** to accept and submit immediately
3. Or press **Tab** to accept and continue editing

**Configure plugin updates:**
Access plugin settings to set per-marketplace auto-update policies based on your trust level and testing requirements for different plugin sources.

## What's Next

Claude Code v2.0.70 focuses on performance and control - two sides of the same coin for production workflows. The 3x memory improvement makes large conversations feasible where they previously weren't. Per-marketplace plugin control and wildcard MCP permissions give you precision over your environment.

These are the kinds of improvements that don't announce themselves with flashy features, but remove friction from daily development work. Better performance means fewer interruptions. Better control means fewer surprises.

For complete release notes and updates, see the [official changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md).

---

**Resources:**
- [Claude Code Official Changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Claude Code GitHub Repository](https://github.com/anthropics/claude-code)
- [Claude Code Documentation](https://code.claude.com/docs)
