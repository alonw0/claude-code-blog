---
title: "Claude Code v2.0.72: Control Your Browser from the Terminal"
description: "Claude Code v2.0.72 introduces Chrome integration (beta), enabling browser automation, live debugging, and web app testing directly from your terminal."
publishDate: 2025-12-18
authors: ["claude-code"]
tags: ["release", "features", "integration", "browser", "chrome", "automation"]
featured: true
draft: false
---

# Claude Code v2.0.72: Control Your Browser from the Terminal

Building web applications means constant context switching. Write code in your terminal, flip to Chrome to test it, check the console for errors, flip back to your editor, make changes, flip to Chrome again. The friction adds up - every switch breaks flow, interrupts thought, and slows development.

Claude Code v2.0.72 changes this with **Claude in Chrome (Beta)**, a new integration that brings browser automation directly into your terminal. Ask Claude to debug your web app, test form validation, or extract data from pages - all without leaving the command line.

This release also delivers performance improvements including 3x faster file suggestions in git repositories, reduced terminal flickering, and refined UX across the CLI.

## Claude in Chrome: Browser Automation from Your Terminal

**What's new:** Claude Code now integrates with the [Claude in Chrome extension](https://claude.ai/chrome) to enable browser automation directly from your terminal. Start Claude Code with the `--chrome` flag, and Claude can open pages, click elements, read console logs, test user flows, and interact with any website you have access to.

**Why this matters:** Web development lives at the intersection of code and browser. Debugging requires seeing what's in the console. Testing forms requires filling fields and clicking submit buttons. Verifying designs requires comparing Figma mocks to actual rendered pages. Previously, all of this required manual context switching - stopping your conversation with Claude, opening Chrome, performing tasks, copying results back.

Now Claude handles it directly. Ask Claude to check your localhost for console errors, and it opens the page, reads the console, and reports what it finds. Ask it to test your checkout flow, and it navigates through the steps, verifies behavior, and identifies issues. The browser becomes another tool in Claude's toolkit, like reading files or running bash commands.

**How it works:** The integration uses Chrome's Native Messaging API to connect Claude Code with the Claude in Chrome browser extension. When you enable Chrome integration, the extension receives commands from Claude Code, executes them in your browser, and sends results back.

The extension maintains your browser's login state - if you're signed into Google Docs, Gmail, Notion, or any other service, Claude can interact with those authenticated pages without requiring API keys or OAuth flows. When Claude encounters blockers like login pages or CAPTCHAs, it pauses and asks you to handle them manually.

Chrome opens new tabs for Claude's tasks rather than taking over your existing browsing session. This keeps your work separate and makes it easy to see what Claude is doing.

### Prerequisites

Before using Chrome integration, you'll need:

- **Google Chrome browser** (currently Chrome only - Arc and Dia are not yet supported)
- **Claude in Chrome extension** installed from the [Chrome Web Store](https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn)
- **Claude Code CLI** installed
- **Paid Claude plan** (Pro, Team, or Enterprise)

**Note:** WSL (Windows Subsystem for Linux) is not currently supported.

### Quick Setup

Getting started takes three steps:

**1. Update Claude Code**

```bash
claude update
```

**2. Start with Chrome enabled**

```bash
claude --chrome
```

**3. Verify connection**

Once Claude Code starts, run `/chrome` to check connection status and manage settings.

On first use, Claude Code installs a native messaging host that enables communication with Chrome. If you encounter permission errors, restart Chrome for the installation to take effect.

### Use Cases

The Chrome integration unlocks workflows that were previously tedious or impossible. Here are seven scenarios where browser automation from your terminal makes a difference:

#### 1. Live Debugging

**Scenario:** You just deployed a fix to your local development server. Instead of manually opening Chrome, navigating to the page, and checking the console:

```
Go to localhost:3000/dashboard and check the console for any errors
when the page loads.
```

Claude opens the page, reads console output, and reports JavaScript errors, warnings, and network failures. If it finds issues, it can read your source code and suggest fixes - all in the same conversation.

#### 2. Design Verification

**Scenario:** You've implemented a UI from a Figma design and want to verify it matches the mockup:

```
Open localhost:3000/pricing and compare the layout to the Figma design
at figma.com/file/abc123. Tell me what's different.
```

Claude opens both pages, analyzes the rendered result against the design specification, and identifies discrepancies in spacing, colors, typography, or layout.

#### 3. Web App Testing

**Scenario:** You need to test form validation logic:

```
I just updated the login form validation. Can you open localhost:3000,
try submitting the form with invalid data, and check if the error
messages appear correctly?
```

Claude navigates to the page, interacts with form fields, triggers validation, and verifies that error states display as expected. It can test both client-side validation and server responses.

#### 4. Authenticated Web Apps

**Scenario:** You want to draft meeting notes in a Google Doc without leaving your terminal:

```
Draft a project update based on our recent commits and add it to my
Google Doc at docs.google.com/document/d/abc123
```

Claude reads your recent commits, generates a summary, opens your Google Doc (using your existing browser login), and adds the content. This works with any authenticated service - Gmail, Notion, CRMs, project management tools - without requiring API integration.

#### 5. Data Extraction

**Scenario:** You need to extract structured data from a website:

```
Go to the product listings page and extract the name, price, and
availability for each item. Save the results as a CSV file.
```

Claude navigates to the page, extracts the requested data, structures it, and writes it to a local file. This works for scraping competitor pricing, gathering research data, or pulling information from sites without APIs.

#### 6. Task Automation

**Scenario:** You have repetitive data entry across multiple sites:

```
I have a spreadsheet of customer contacts in contacts.csv. For each row,
go to our CRM at crm.example.com, click "Add Contact", and fill in the
name, email, and phone fields.
```

Claude reads the spreadsheet, navigates to the CRM for each entry, and automates the form filling. Multi-site workflows are also possible - checking calendars, looking up LinkedIn profiles, updating multiple systems.

#### 7. Session Recording

**Scenario:** You need to create a demo showing your application's checkout flow:

```
Record a GIF showing how to complete the checkout flow, from adding
an item to the cart through to the confirmation page.
```

Claude navigates through the workflow while recording, producing a GIF you can share with teammates or include in documentation.

### Best Practices

To get the most out of Chrome integration:

**Handle modal dialogs manually:** JavaScript alerts, confirms, and prompts block browser events. If Claude's commands stop responding, check for modal dialogs, dismiss them manually, and tell Claude to continue.

**Use fresh tabs:** If a tab becomes unresponsive or gets into an unexpected state, ask Claude to create a new tab and try again rather than debugging the stuck tab.

**Filter console output:** Console logs can be verbose. Instead of asking for all console output, tell Claude what patterns to look for: "Check the console for errors" or "Look for warnings about the API" produces more useful results than raw dumps.

### Troubleshooting

**Extension not detected:**
1. Verify the Claude in Chrome extension is installed
2. Make sure Chrome is running
3. Run `/chrome` and select "Reconnect extension"

**Browser not responding:**
1. Check if a modal dialog (alert, confirm, prompt) is blocking the page
2. Ask Claude to create a new tab and try the task again
3. Restart the Chrome extension by disabling and re-enabling it in Chrome's extension manager

**First-time setup issues:**
If you encounter permission errors on first use, restart Chrome. The native messaging host installation requires Chrome to reload its configuration.

### Enable by Default

To use Chrome integration without the `--chrome` flag every time, run `/chrome` and select "Enabled by default."

**Note:** Enabling Chrome by default increases context usage, since browser automation tools are loaded into every conversation. Use this when you're primarily doing web development work.

### Permissions

Site-level permissions for Chrome integration are managed through the Claude in Chrome extension, not Claude Code. The extension controls which sites Claude can browse, click on, and type into.

To adjust these permissions, open the extension settings in Chrome and configure site access. Run `/chrome` in Claude Code to see current permission settings.

You can also explore all available browser automation tools by running `/mcp` and clicking into the `claude-in-chrome` MCP server to see the full list of capabilities.

## Performance & UX Improvements

Beyond Chrome integration, v2.0.72 delivers several performance and user experience refinements:

### Speed Improvements

**3x faster @ mention file suggestions:** When you type `@` to reference files in git repositories, suggestion performance has improved by approximately 3x. This makes file references faster and more responsive in large codebases.

**Better performance with ignore files:** File suggestion performance has been improved for repositories using `.ignore` or `.rgignore` files. These ignore patterns are now processed more efficiently, reducing latency when suggesting files.

**Reduced terminal flickering:** Terminal rendering has been optimized to reduce flickering during updates. The CLI now feels smoother when Claude is streaming responses or updating status information.

### UX Enhancements

**Scannable QR code for mobile app:** The mobile app tip now includes a scannable QR code for quick downloads. Point your phone at the code to install the Claude mobile app without typing URLs.

**Loading indicator for resuming conversations:** When resuming a previous conversation, Claude Code now shows a loading indicator to provide feedback that the conversation is loading. This removes ambiguity about whether the resume operation is in progress.

**More prominent settings validation errors:** When configuration settings contain errors, validation messages are now more prominent and easier to notice. This helps catch configuration mistakes before they cause issues.

**Thinking toggle moved to Alt+T:** The keyboard shortcut for toggling thinking mode has changed from Tab to Alt+T (or Option+T on macOS). This prevents accidental triggers - Tab is commonly used for autocomplete and other interactions, making it too easy to toggle thinking mode unintentionally. Alt+T is more deliberate and less likely to conflict with other workflows.

## Bug Fixes

Version 2.0.72 includes two bug fixes:

### 1. Custom System Prompts in Non-Interactive Mode

**Fixed:** The `/context` command now respects custom system prompts when running in non-interactive mode (using the `-p` flag or piped input).

**Impact:** If you set custom system prompts via CLAUDE.md or configuration and run Claude Code in non-interactive mode, those prompts are now correctly applied. Previously, custom system prompts were ignored in non-interactive mode, causing Claude to use default behavior instead of your configured instructions.

### 2. Ctrl+K Line Order When Pasting

**Fixed:** The order of consecutive Ctrl+K (kill line) operations is now preserved correctly when pasting with Ctrl+Y (yank).

**Impact:** When you use Ctrl+K to delete multiple consecutive lines and then paste them back with Ctrl+Y, the lines now appear in the correct order. Previously, the order could be reversed or scrambled, making this editing workflow unreliable.

## Getting Started

These features are available in Claude Code v2.0.72. Update to the latest version:

```bash
# Update Claude Code
npm update -g @anthropic-ai/claude-code

# Check your current version
claude --version
```

### Try Chrome Integration

Start Claude Code with Chrome enabled:

```bash
# Start with Chrome enabled
claude --chrome

# Verify connection
/chrome
```

Once connected, try a simple task:

```
Go to code.claude.com/docs, click on the search box, type "hooks",
and tell me what autocomplete results appear.
```

Claude will open the page, interact with the search interface, and report the results - all from your terminal.

### Enable Chrome by Default

If you're primarily working on web development, enable Chrome integration by default:

1. Run `/chrome` in Claude Code
2. Select "Enabled by default"
3. Chrome integration will be available in all future sessions without the `--chrome` flag

### Learn More

**Documentation:** Read the complete Chrome integration guide at [code.claude.com/docs/en/chrome](https://code.claude.com/docs/en/chrome)

**Explore tools:** Run `/mcp` in Claude Code and click into `claude-in-chrome` to see the full list of available browser automation tools including navigation, clicking, typing, scrolling, reading console logs, managing tabs, recording, and more.

**Install extension:** Get the Claude in Chrome extension from the [Chrome Web Store](https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn)

## What's Next

Claude Code v2.0.72 bridges the terminal and browser, removing a major source of context switching from web development workflows. The Chrome integration transforms tasks that required manual browser interaction into natural language instructions - debug this page, test this form, extract this data.

This is the first browser integration, but the pattern opens possibilities. Support for Arc, Dia, and other browsers is a natural next step. The broader vision is clear: development tools should adapt to your workflow, not force you to adapt to them. Eliminating context switches - between terminal and browser, between coding and testing, between asking and executing - makes development faster and more fluid.

For now, Chrome integration is in beta. The foundation works, the use cases are proven, and the workflow feels right. Try it on your next web development task and see what becomes possible when your terminal can see what's in your browser.

For complete release notes and updates, see the [official changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md).

---

**Resources:**
- [Claude Code Official Changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Claude Code GitHub Repository](https://github.com/anthropics/claude-code)
- [Chrome Integration Documentation](https://code.claude.com/docs/en/chrome)
- [Claude in Chrome Extension](https://claude.ai/chrome)
- [Chrome Web Store: Claude Extension](https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn)
