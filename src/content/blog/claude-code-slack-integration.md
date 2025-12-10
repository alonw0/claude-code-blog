---
title: "Claude Code in Slack: Delegate Coding Tasks from Team Conversations"
description: "Claude Code now works directly in Slack. @mention Claude with coding tasks and it creates a web session, posts updates to your thread, and generates PRs—all without leaving your team discussions."
publishDate: 2025-12-09
authors: ["claude-code"]
tags: ["features", "integration", "slack", "workflow", "productivity"]
featured: true
draft: false
---

# Claude Code in Slack: Delegate Coding Tasks from Team Conversations

Your team spots a bug in your Slack channel. Someone shares an error message. The discussion builds context—what triggered it, what users are seeing, potential causes. Then comes the context switch: copy the details, open your editor, find the files, start debugging.

**As of December 8, 2025, there's a better way.**

Claude Code now works directly in Slack. @mention Claude with a coding task, and it creates a Claude Code session on the web, uses your Slack discussion for context, posts status updates to your thread, and generates pull requests—all without you leaving the conversation.

This is a beta research preview that changes how teams can delegate coding work.

## What's New

**What it is:** When you @mention Claude in a Slack channel with a coding task, Claude automatically detects the intent and launches a Claude Code session on the web. You stay in Slack while Claude works, receiving status updates in your thread.

**What happens behind the scenes:**
1. Claude analyzes your message to detect coding intent
2. Gathers context from your thread and recent channel messages
3. Automatically selects the appropriate GitHub repository
4. Creates a Claude Code session on [claude.ai/code](https://claude.ai/code)
5. Posts progress updates to your Slack thread
6. @mentions you when complete with links to view the session or create a PR

**Why it matters:** This enables asynchronous task delegation with full team visibility. Your bug report discussion becomes the input. Your team sees progress updates. The full session lives on the web for detailed review. No context-switching, no manual copy-pasting, no losing track of which Slack thread triggered which coding session.

## How It Works

### Automatic Intent Detection

Claude uses intelligent routing to determine if your message is code-related:

- **"Code only" mode**: All @Claude mentions route to Claude Code sessions. Best for teams using Claude exclusively for development tasks.
- **"Code + Chat" mode**: Claude analyzes each message and routes to either Claude Code (for coding) or Claude Chat (for writing, analysis, general questions). Includes a "Retry as Code" button if it chooses wrong.

You can configure this in the Claude App Home in Slack.

### Context Gathering

**From threads:** Claude reads all messages in the thread to understand the full conversation—what bug was reported, what debugging steps were tried, what solutions were discussed.

**From channels:** Pulls recent channel messages for additional context, helping it select the right repository and understand your project's patterns.

This context informs Claude's approach—it's not just getting your @mention message, it's understanding the discussion that led to the request.

### Repository Selection

Claude automatically selects which GitHub repository to use based on:
- Repository mentions in the conversation
- Project context from recent messages
- Your authenticated repositories at claude.ai/code

If multiple repositories could apply, Claude shows a dropdown to choose. You can also use the "Change Repo" button to switch after the fact.

### Session Flow

1. **You @mention Claude** with a coding task in a Slack channel
2. **Session starts** on claude.ai/code (Claude Code on the web)
3. **Status updates** post to your Slack thread as work progresses
4. **Completion notification** @mentions you with action buttons:
   - **View Session**: Open the full session in your browser
   - **Create PR**: Generate a pull request from the changes
5. **Continue work** in the web session or create the PR directly from Slack

**Important:** Only works in channels (public or private), not in direct messages with Claude.

## Setup Guide

Getting started requires four steps:

### Prerequisites

| Requirement | Details |
|---|---|
| **Claude Plan** | Pro, Team, or Enterprise with Claude Code access |
| **Claude Code on the web** | Access enabled at [claude.ai/code](https://claude.ai/code) |
| **GitHub Account** | Connected to Claude Code with at least one repository authenticated |
| **Slack Workspace** | Admin permission to install apps |

### Step 1: Install the Claude App in Slack

A Slack workspace administrator must install the Claude app:

1. Visit the [Claude app on Slack App Marketplace](https://slack.com/marketplace/A08SF47R6P4)
2. Click "Add to Slack"
3. Authorize the app for your workspace

### Step 2: Connect Your Claude Account

Each user connects their own account:

1. Open the Claude app in Slack (find it in your Apps section)
2. Go to the App Home tab
3. Click "Connect" to link your Slack account with your Claude account
4. Complete authentication in your browser

### Step 3: Authenticate GitHub Repositories

1. Visit [claude.ai/code](https://claude.ai/code)
2. Sign in with the same Claude account you connected to Slack
3. Connect your GitHub account if not already connected
4. Authenticate at least one repository you want Claude to work with

**Note:** Each user can only access repositories they've personally authenticated. Sessions run under your individual Claude account and count against your plan's rate limits.

### Step 4: Choose Your Routing Mode

In the Claude App Home in Slack, configure how Claude handles @mentions:

- **Code only**: All @mentions route to Claude Code sessions
- **Code + Chat**: Claude intelligently routes between Code and Chat based on message analysis, with "Retry as Code" button available

## Key Capabilities

### Bug Investigation and Fixes

**Scenario:** A user reports a bug in your Slack channel. The team discusses the symptoms, shares error messages, identifies affected users.

**Claude Code in Slack:** @mention Claude with "investigate and fix this bug." Claude reads the thread, understands the problem from the discussion, locates the issue in your code, implements a fix, and posts a PR link to the thread.

### Feature Implementation from Feedback

**Scenario:** Your team discusses a feature request in Slack. Product requirements emerge from the conversation. Someone needs to implement it.

**Claude Code in Slack:** @mention Claude with "implement this feature based on the discussion above." Claude uses the thread context to understand requirements, writes the code, and provides a PR for review.

### Collaborative Debugging

**Scenario:** An error keeps appearing in production. Multiple team members share observations, logs, and theories in a Slack thread.

**Claude Code in Slack:** @mention Claude with "debug this issue using the information in this thread." Claude synthesizes the team's collective knowledge, investigates the root cause, and proposes a solution.

### PR Creation from Slack

Once Claude completes work, click "Create PR" directly from the Slack notification. The PR includes all changes from the session, ready for your team's code review process.

### Parallel Task Execution

**Scenario:** You're in a meeting. A coding task comes up. You don't want to break flow to handle it immediately.

**Claude Code in Slack:** @mention Claude with the task in Slack. Continue your meeting. Claude works asynchronously. You get a notification when it's done. Review the session or create the PR when you're ready.

## Use Cases & Best Practices

### When to Use Slack vs. Web

**Use Slack when:**
- Context already exists in a team discussion
- You want asynchronous task delegation
- Your team needs visibility into progress
- You're focused on other work and want notifications when done

**Use the web directly when:**
- You need to upload files or images
- You want real-time back-and-forth interaction
- Working on complex, multi-step tasks requiring iteration
- Building on a previous session's work

### Writing Effective Requests

**Be specific:**
- Include file names, function names, error messages
- Reference specific parts of the codebase when possible
- Provide reproduction steps for bugs

**Provide context:**
- Mention the repository name if you have multiple projects
- Reference related issues or previous discussions
- Explain the business context or user impact

**Define success:**
- Should Claude write tests for this change?
- Does documentation need updating?
- Should it create a PR or just explore the problem?
- Are there specific patterns or conventions to follow?

**Use threads:**
Discuss bugs or features in threads rather than scattered across channel messages. Claude pulls context from the thread, so keeping related discussion together improves its understanding.

### Example Requests

```
Good:
@Claude investigate the timeout error in the user authentication flow
(src/auth/login.js) and implement a fix with tests

Better:
@Claude the login timeout discussed above is affecting 5% of users.
Investigate src/auth/login.js, focusing on the token refresh logic.
Implement a fix with tests and update the error handling docs.
Create a PR when done.
```

## Current Limitations

**Beta research preview:** This feature is in beta. Behavior may evolve based on feedback.

**GitHub only:** Currently supports repositories hosted on GitHub. GitLab, Bitbucket, and other providers aren't supported yet.

**Claude Code access required:** Users need Claude Pro, Team, or Enterprise plans with Claude Code access. Users without access receive standard Claude chat responses.

**One PR per session:** Each Claude Code session can create one pull request. Multiple PRs require multiple sessions.

**Rate limits apply:** Sessions count against your individual Claude plan's rate limits, not shared team limits.

**Channel-only:** Works in public and private channels, but not in direct messages with the Claude bot.

**Web access for full features:** While updates post to Slack, the full session (complete transcript, all changes, ability to continue work) lives on claude.ai/code.

## Getting Started

Ready to try Claude Code in Slack? Here's your quick-start checklist:

- [ ] Slack workspace admin installs [Claude app from marketplace](https://slack.com/marketplace/A08SF47R6P4)
- [ ] Connect your Claude account in Claude App Home in Slack
- [ ] Authenticate GitHub repositories at [claude.ai/code](https://claude.ai/code)
- [ ] Choose routing mode (Code only vs. Code + Chat)
- [ ] @mention Claude in a channel with a coding task
- [ ] Watch for status updates in your Slack thread
- [ ] Click "View Session" or "Create PR" when Claude completes

**Pro tip:** Start with a small, well-defined task in a thread with good context. This helps you understand the flow and see how Claude uses discussion context.

## What This Enables

Claude Code in Slack isn't just about convenience—it's about changing where coding work originates.

Bug reports, feature requests, and technical discussions already happen in Slack. Teams are already building context through conversations. Now that context can flow directly into code changes, without manual translation or context loss.

The full Claude Code session lives on the web for detailed interaction, iteration, and review. But the initiation, status visibility, and completion notification happen where your team already works.

**For async workflows:** Delegate tasks during meetings, standup, or discussions. Get notified when complete. Review and create PRs on your schedule.

**For team visibility:** Everyone in the channel sees Claude's progress updates. No "who's working on that bug?" questions. The thread becomes the project log.

**For context preservation:** No more "what Slack thread was this from?" or "which bug report triggered this PR?" The connection is automatic and visible.

## Resources

- [Official Claude Code in Slack Documentation](https://code.claude.com/docs/en/slack)
- [Claude App on Slack Marketplace](https://slack.com/marketplace/A08SF47R6P4)
- [Claude Code on the Web](https://claude.ai/code)
- [Anthropic Announcement](https://www.claude.com/blog/claude-code-and-slack)
- [Claude Help Center](https://support.claude.com)

---

**Have questions or feedback?** This is a beta feature, and Anthropic is actively gathering user input. Share your experience in the [Claude Code discussions](https://github.com/anthropics/claude-code/discussions) or via the official support channels.
