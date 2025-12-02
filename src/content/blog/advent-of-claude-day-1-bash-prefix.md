---
title: "Quick Bash Wins: The ! Prefix"
description: "Stop wasting tokens asking Claude to run commands. The ! prefix executes bash instantly and injects output into context—no model processing, no delay, no wasted tokens."
publishDate: 2025-12-02
authors:
  - alon-wolenitz
tags:
  - tips
  - productivity
  - bash
  - features
draft: false
---

**Quick Bash Wins**

Don't waste tokens asking "can you run git status?" or "can you check the tests?"

Just type: `!` followed by your bash command.

The `!` prefix executes bash **instantly** and injects the output into context. No model processing. No delay. No wasted tokens.

## What the ! Prefix Does

The `!` prefix (also called Bash Mode) runs commands directly in Claude Code's persistent shell session, bypassing Claude's AI entirely.

**Two ways to use it**:

1. **In the chat**: Type `!` followed by any bash command
2. **In custom slash commands**: Embed `!` commands to inject dynamic context

When you use `!`, the command executes immediately in the shell, and the output appears as context—but Claude never processes the command itself. You skip the AI roundtrip entirely.

## Direct Command Examples

Instead of asking Claude to run commands, just run them:

```
! git status
! npm test
! ls -la
! git branch --show-current
! df -h
```

The output appears instantly, and you can reference it in your next prompt. No "Claude, can you..." overhead. No tokens wasted on conversational back-and-forth.

## In Custom Slash Commands

The real power shows up in custom slash commands. You can embed bash execution that runs **before** the slash command processes:

```markdown
---
name: commit
description: Create a git commit with context
allowed-tools: Bash(git status:*), Bash(git diff:*)
---

## Current State

- Status: !`git status`
- Staged changes: !`git diff --staged`
- Branch: !`git branch --show-current`

[Rest of your slash command prompt...]
```

The `!` commands execute first. Their output becomes part of the command context. Claude sees the live state of your repository without needing to ask for it.

This enables **dynamic, context-aware slash commands** that adapt to your project's current state.

## When to Use It

Use `!` anytime you need command output but not AI interpretation:

- **Status checks**: `! git status`, `! git log -1`
- **Directory exploration**: `! ls -la`, `! tree -L 2`
- **Test runs**: `! npm test`, `! pytest`
- **Build verification**: `! npm run build`, `! cargo check`
- **System info**: `! uptime`, `! df -h`

If you just want the output injected as context, use `!`. If you need Claude to analyze or act on the output, use the Bash tool normally.

## Why This Matters

**Token efficiency**: Every time you ask Claude "can you run X command?", you're burning tokens on conversation. The `!` prefix skips that entirely.

**Speed**: Instant execution. No waiting for Claude to process your request, call the Bash tool, and format a response.

**Context clarity**: The output appears exactly as the shell produces it. No conversational wrapper. No "Here's what I found..." preamble.

For developers using Claude Code regularly, the `!` prefix is one of those small features that compounds into significant efficiency gains. Faster workflows, lower token usage, cleaner context.

---

**Try it yourself**: Next time you need git status, don't ask. Just type `! git status`.

**Credit**: This tip was highlighted by [@adocomplete](https://x.com/adocomplete/status/1995523532663755010) from Anthropic as part of his Advent of Claude series.

**Resources**:
- [Claude Code Slash Commands Documentation](https://code.claude.com/docs/en/slash-commands)
- [What is Bash Mode? (ClaudeLog)](https://claudelog.com/faqs/what-is-bash-mode/)
- [Bash Command Execution Guide](https://www.glassthought.com/notes/yo2h9bclex58mmvx7hsgisj/)
