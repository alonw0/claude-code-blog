---
title: "tweakcc: Customize Everything in Claude Code"
description: "tweakcc is a CLI tool that brings customization to Claude Code—from system prompts and themes to toolsets and session naming. Here's what it does and how to get started."
publishDate: 2025-11-29
authors:
  - alon-wolenitz
tags:
  - tools
  - customization
  - workflow
  - community
draft: false
---

Claude Code is powerful out of the box, but it's one-size-fits-all. The terminal theme is fixed. System prompts are hardcoded. You can't customize how Claude thinks, how your sessions are organized, or what your interface looks like.

**tweakcc** solves this.

Created by Piebald-AI, tweakcc is a CLI tool that brings comprehensive customization to Claude Code. You can modify system prompts, create custom themes, design your own toolsets, name your sessions, and polish the UI with custom thinking verbs and spinner animations. It's the de facto standard for Claude Code customization, with 472 GitHub stars and an active community building on top of it.

If you've ever wanted Claude Code to fit your workflow instead of adapting your workflow to Claude Code, this is the tool.

## What You Can Customize

### System Prompts: How Claude Thinks

tweakcc lets you modify **every component** of Claude Code's system prompts:

- **17+ built-in tool descriptions** (Edit, Bash, Grep, Read, Write, etc.)
- **Subagent prompts** (Task, Plan, Explore agents)
- **Utility prompts** (conversation compaction, web summarization, command analysis)
- **Main system prompt** (Claude's core instructions)

Each prompt lives in a separate markdown file at `~/.tweakcc/system-prompts`, so you can edit them individually without touching a massive configuration blob. This is powerful for prompt engineering research, adjusting Claude's behavior for specific projects, or just understanding how Claude Code works under the hood.

### Visual Themes: Make It Yours

Claude Code's default terminal output is functional but bland. tweakcc adds:

- **Custom color themes** with HSL/RGB color pickers
- **Thinking verbs** ("Claude is analyzing..." vs "analyzing...")
- **70+ spinner animations** with adjustable speeds and phases
- **User message styling** beyond the default gray text
- **ASCII border removal** from input boxes for a cleaner look

If you spend hours in Claude Code daily, matching your terminal theme or adding personality with custom animations makes a real difference.

### Workflow Tools: Organization and Efficiency

Two features here are particularly useful:

**Custom Toolsets**: Package frequently-used tool combinations for specific project types. Frontend development? Create a toolset with the tools you always need. Data analysis? Different toolset. Access them via the `/toolset` command.

**Session Naming**: Use `/title my chat title` or `/rename` to manually name sessions instead of relying on auto-generated timestamps. When you're juggling five Claude Code sessions across different projects, named sessions are a lifesaver.

### Bug Fixes and Enhancements

tweakcc also fixes issues Anthropic hasn't addressed yet:

- Resolves frozen spinner animations that occur with certain environment variables
- Adds context limit customization via `CLAUDE_CODE_CONTEXT_LIMIT` for custom Anthropic-compatible APIs
- Expands thinking blocks by default without requiring transcript mode

## Why This Matters

Personalization isn't just aesthetic. It's functional.

**System prompt control** means you can tune Claude's behavior for specific use cases. Working on security-sensitive code? Modify prompts to emphasize caution. Building prototypes? Adjust for speed over perfection.

**Visual consistency** reduces cognitive friction. If your terminal is dark purple and Claude Code is bright cyan, that's jarring. tweakcc fixes that.

**Session organization** scales with complexity. One or two projects? Fine without it. Ten projects with overlapping contexts? Named sessions become essential.

And tweakcc is **community-driven**. Anthropic builds Claude Code for general use; the community builds tools for specific needs. tweakcc fills the customization gap Anthropic hasn't prioritized, and it does it well enough that related projects like `ccstatusline`, `claude-powerline`, and `CCometixLine` have emerged to extend it further.

## How It Works (The Short Version)

tweakcc patches Claude Code's minified `cli.js` file. For npm installations, it modifies the file in place. For native/binary installations, it extracts the file from the binary, applies patches, and repacks it.

All your configurations—system prompts, themes, toolsets—live in markdown or JSON files at `~/.tweakcc/` (or `$XDG_CONFIG_HOME/tweakcc`). When Claude Code updates and overwrites your customizations, you just run `npx tweakcc --apply` to reapply them.

The smart part: when Anthropic updates prompts that you've also modified, tweakcc generates HTML diff visualizations showing your changes alongside Anthropic's updates side-by-side. You can manually resolve conflicts instead of losing your work.

It maintains backups (`cli.backup.js` or `native-binary.backup`) so you can always revert if something breaks. Cross-platform support (Windows, macOS, Linux) means it works regardless of how you installed Claude Code.

## Getting Started

**Zero install**:
```bash
npx tweakcc
```

That's it. tweakcc launches an interactive TUI where you can configure everything: themes, prompts, toolsets, and more.

**Global install** (if you prefer):
```bash
npm install -g tweakcc
tweakcc
```

After Claude Code updates, reapply your customizations:
```bash
npx tweakcc --apply
```

Your configuration files live at `~/.tweakcc/system-prompts` (or `$XDG_CONFIG_HOME/tweakcc/system-prompts`). You can edit them directly or use the TUI.

For full documentation, check the [GitHub repository](https://github.com/Piebald-AI/tweakcc).

tweakcc is verified for **Claude Code 2.0.55** and works across all platforms and installation types (npm, Homebrew, native binaries).

## Community and Ecosystem

tweakcc has become the foundation for Claude Code customization. With **472 GitHub stars** and **30 forks**, it's actively maintained with **38 releases** to date. The latest version (**v3.1.4**, released November 29, 2025) added session naming features.

The project has spawned related tools:
- **ccstatusline**: Custom status line configurations
- **claude-powerline**: Powerline-style themes for Claude Code
- **CCometixLine**: Another theming extension

It's featured in [ClaudeLog](https://claudelog.com/claude-code-mcps/tweakcc/), [Claude Hub](https://www.claude-hub.com/resource/github-cli-Piebald-AI-tweakcc-tweakcc/), and the Awesome Claude Code list. The community treats it as essential infrastructure, not an experimental addon.

## Try It Yourself

tweakcc is now [listed on our tools page](/tools) alongside other Claude Code extensions. Whether you're a power user who wants granular control over system prompts or just someone who wants a prettier terminal, it's worth exploring.

Run `npx tweakcc`, pick a theme, maybe customize a thinking verb or two, and see if Claude Code feels more like *yours*. The community has built something genuinely useful here—and they're actively improving it.

---

**Resources**:
- [tweakcc GitHub Repository](https://github.com/Piebald-AI/tweakcc)
- [Introducing tweakcc (GitHub Issue)](https://github.com/anthropics/claude-code/issues/4429)
- [ClaudeLog Documentation](https://claudelog.com/claude-code-mcps/tweakcc/)
- [Claude Hub Resource Page](https://www.claude-hub.com/resource/github-cli-Piebald-AI-tweakcc-tweakcc/)
- [tweakcc on npm](https://libraries.io/npm/tweakcc)
