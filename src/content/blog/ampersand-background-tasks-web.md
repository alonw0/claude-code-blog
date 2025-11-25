---
title: "Teleport Tasks to the Cloud with the & Prefix"
description: "Version 2.0.45 introduced a powerful feature: start any message with & in the Claude Code CLI to run it as a background task on Claude Code Web."
publishDate: 2025-11-21
authors: ["alon-wolenitz"]
tags: ["features", "tips", "productivity"]
featured: true
---

# Teleport Tasks to the Cloud with the & Prefix

Claude Code version 2.0.45 introduced a feature that bridges your local terminal with cloud infrastructure: **type `&` before any message in the Claude Code CLI to start a background task that runs on Claude Code Web**.

Think of it as "teleporting" a task from your terminal to the cloud, where it continues running even if you close your local session.

## How It Works

When you prefix a message with `&` in the Claude Code CLI, the task doesn't run locally. Instead, it gets sent to Claude Code Web where it executes on Anthropic's cloud infrastructure. Your local CLI stays free for other work while the remote session handles the task.

For example:

```
& Enable dark mode by default
```

```
& Refactor the authentication module to use JWT
```

```
& Run the full test suite and fix any failures
```

The task appears under "Remote sessions" when you check with the `/tasks` command:

```
> /tasks

Background tasks
1 active session

  Remote sessions (1)
  > Enable dark mode by default starting...

↑/↓ to select · Enter to view · Esc to close
```

## Prerequisites

To use this feature, you need:

1. **Claude Code Web setup** - Complete the onboarding at claude.ai/code
2. **GitHub repository connected** - The feature only works for repos connected to Claude Code Web

This makes sense because the remote task needs somewhere to run. Claude Code Web provides the sandboxed cloud environment and GitHub integration that makes this possible.

## Why This Matters

The `&` prefix solves a real problem: what do you do when you want to kick off a long-running task but also need your terminal for something else?

Before this feature, your options were:
- **Local background tasks** (`Ctrl+B`) - keeps the task running locally, but ties up your machine
- **Start a separate Claude Code Web session** - works, but requires context switching

Now you can stay in your terminal workflow and offload tasks to the cloud with a single character. The task runs on Claude Code Web's infrastructure with full access to your connected repository.

## Use Cases

**Parallel development**: Work on one feature locally while Claude handles another in the cloud.

```
& Add unit tests for the payment service
```
Then continue working on the UI locally.

**Resource-intensive tasks**: Offload heavy operations like full test suites or large refactors.

```
& Run the entire CI pipeline and report results
```

**End-of-day handoffs**: Start a task before closing your laptop.

```
& Review all PRs opened today and leave comments
```

The task continues running on Claude Code Web regardless of your local session state.

## Checking Remote Sessions

Use `/tasks` to see all background tasks, including remote sessions running on Claude Code Web. You can:
- Use `↑/↓` to navigate between tasks
- Press `Enter` to view a task's details
- Press `Esc` to close the task list

The conversation persists on Claude Code Web, though there's currently a known issue where messages may not display immediately in the web interface.

## Part of the Prefix Family

The `&` prefix joins other useful shortcuts in Claude Code:

| Prefix | Purpose |
|--------|---------|
| `&` | Send task to Claude Code Web (background) |
| `!` | Run a shell command directly |
| `#` | Add instructions to CLAUDE.md |

## Getting Started

1. Update to Claude Code 2.0.45 or later:
   ```bash
   npm update -g @anthropic-ai/claude-code
   ```
2. Set up Claude Code on the web and complete onboarding
3. Connect a GitHub repository to Claude Code Web
4. In your CLI, prefix any message with `&` to teleport it to the cloud

## Conclusion

The `&` prefix represents a shift in how we can think about AI-assisted development. Instead of choosing between local and cloud, you can use both simultaneously - keeping your terminal for immediate work while offloading tasks to Claude Code Web.

It's a small syntax addition with significant workflow implications. Try it next time you have a task that doesn't need your immediate attention.
