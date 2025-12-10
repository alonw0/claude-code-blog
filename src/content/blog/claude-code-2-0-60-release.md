---
title: "Claude Code 2.0.60: Background Agents and Enhanced Workflow Control"
description: "Version 2.0.60 brings background agent support, MCP toggle commands, and enhanced commit attribution for better AI-assisted development workflows."
publishDate: 2025-12-08
authors:
  - alon-wolenitz
tags:
  - features
  - news
  - workflow
  - cli
featured: false
draft: false
---

Anthropic released Claude Code 2.0.60 on December 6, 2025, with a focus on workflow efficiency and developer control. The headline feature is background agent support, which fundamentally changes how you can multitask with Claude Code. Let's break down what's new.

## Background Agent Support

**What it is:** Agents can now run in the background while you continue working. Previously, when you launched an agent for a complex task, Claude Code would block until that agent completed. Now, agents run asynchronously.

**Why it matters:** This is a significant productivity boost for complex workflows. If you're running a comprehensive codebase exploration or a lengthy refactoring analysis, you're no longer stuck waiting. You can continue editing files, running commands, or even starting other tasks while the background agent does its work.

**How to use it:** When you launch agents that support background execution, they'll run independently. You can check their status and retrieve results when ready, without blocking your main workflow.

This is the most impactful change in 2.0.60—it transforms Claude Code from a sequential assistant into a truly concurrent development partner.

## MCP Server Toggle Commands

**What it is:** Quick enable/disable commands for MCP (Model Context Protocol) servers directly from the command line.

**The commands:**
```bash
/mcp enable [server-name]   # Enable a specific MCP server
/mcp disable [server-name]  # Disable a specific MCP server
```

**Why it matters:** If you're working with multiple MCP servers, context management becomes critical. Before 2.0.60, toggling servers required navigating configuration files or settings. Now you can instantly enable or disable servers based on your current task, reducing cognitive overhead and improving context control.

**Use case:** Working on a frontend feature? Disable your database MCP server to reduce noise. Switching to backend work? Re-enable it with a single command.

## Enhanced Commit Attribution

**What it is:** Git commit messages now include the specific Claude model name in the "Co-Authored-By" line.

**Example:**
```
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Why it matters:** Transparency in AI-assisted development. When you're reviewing commit history months later, you'll know exactly which version of Claude contributed to each change. This is valuable for understanding the capabilities and limitations of the code generated, especially as models evolve.

## CLI Control: Disable Slash Commands

**What it is:** A new `--disable-slash-commands` CLI flag that disables all slash commands for the current session.

**Why it matters:** Sometimes you need vanilla CLI behavior without Claude Code's extended command set. This might be for scripting, automation, or when you want to ensure you're working with raw commands only. The flag gives you that control without changing your default configuration.

**How to use it:**
```bash
claude-code --disable-slash-commands
```

## Optimized Fetch Performance

**What it is:** The Fetch tool now skips summarization for pre-approved websites, reducing latency when fetching from trusted sources.

**Why it matters:** When Claude Code fetches web content, it typically summarizes the results to fit within context windows. For frequently accessed, trusted sources (like official documentation sites), this summarization step adds unnecessary overhead. By skipping it for pre-approved sites, fetches complete faster.

**Impact:** Noticeable speed improvement when working with documentation, official repos, and other whitelisted sources.

## VS Code Multi-Client Support

**What it is:** The VS Code extension now supports multiple terminal clients connecting to the IDE server simultaneously.

**Why it matters:** If you're running complex IDE setups—multiple terminal windows, split panes, or even multiple VS Code instances connected to the same workspace—this update ensures they can all communicate with Claude Code's IDE server without conflicts.

**Impact:** More flexible development workflows, especially for developers who work across multiple screens or terminal sessions.

## Getting Started

To update to Claude Code 2.0.60:

```bash
npm install -g @anthropic-ai/claude-code@latest
```

Verify your version:
```bash
claude-code --version
```

To try background agents, launch Claude Code and start working with agents that support background execution. For MCP toggle commands, try:
```bash
/mcp enable [your-server-name]
/mcp disable [your-server-name]
```

## What This Release Means

Version 2.0.60 is about giving you more control and efficiency in your AI-assisted development workflow. Background agent support is the standout feature—it moves Claude Code from a blocking assistant to a concurrent partner. Combined with better MCP control, enhanced attribution, and performance optimizations, this release focuses on real workflow improvements rather than flashy new capabilities.

The updates are incremental but meaningful. If you've found yourself waiting on agents or manually toggling context, 2.0.60 directly addresses those pain points.

Try it out and see how background agents change your workflow.

## Sources

- [Claude Code Official Changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Claude Code npm Package](https://www.npmjs.com/package/@anthropic-ai/claude-code)
- [Claude Code GitHub Repository](https://github.com/anthropics/claude-code)
