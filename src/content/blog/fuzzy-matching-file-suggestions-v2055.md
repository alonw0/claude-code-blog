---
title: "Faster @ File Suggestions: Claude Code v2.0.55's Fuzzy Matching Upgrade"
description: "Claude Code v2.0.55 improved fuzzy matching for @ file suggestions, making it faster and more forgiving when typing partial filenames with typos or missing characters."
publishDate: 2025-11-27
authors:
  - alon-wolenitz
tags:
  - features
  - news
  - productivity
  - updates
draft: false
youtubeUrl: "https://www.youtube.com/watch?v=MmDJ8xLQkD4"
---

Claude Code v2.0.55 dropped on November 27, 2025, and brought a quality-of-life improvement that might significantly change how you reference files: **improved fuzzy matching for @ file suggestions**.

If you've ever fumbled with typing exact file paths when using `@` to add context to your prompts, this update is for you. The new fuzzy matching is faster, more accurate, and forgiving enough to handle typos and missing letters.

It's the kind of polish that doesn't reinvent workflows but makes daily usage noticeably smoother.

## What Is Fuzzy Matching?

Fuzzy matching lets you type partial filenames with skipped characters, and Claude Code still finds the right file.

**Example**: Want to reference `plant_seeder.ts`? You could type:
- `@pln seeder`
- `@pln sedr`
- `@plan seder`

All of these partial patterns will match `plan_seeder.ts` and bring it to the top of the suggestion list. No need for perfect spelling. No need to remember exact filenames. Just type enough characters in roughly the right order, and the fuzzy finder does the rest.

Under the hood, this builds on the **Rust-based fuzzy finder** that Claude Code introduced back in v2.0.34. That foundation gave fast performance; v2.0.55 makes it smarter and more accurate.

## How It Works in Practice

The video below demonstrates the improvement perfectly. The creator shows how mentioning files for context becomes significantly easier with fuzzy matching.

**Key insight from the demo**: Adding context files to prompts improves result quality. The example shown is:


The `@` mentions pull in file context automatically, making the prompt more specific. And with fuzzy matching, typing those file paths is faster—even if you make typos or skip letters, the right files still appear in the top results.

**Benefits**:
- **Fewer keystrokes**: Type abbreviated versions of filenames instead of full paths
- **Handles typos**: Missed a letter? Fuzzy matching compensates
- **Faster workflow**: Spend less time hunting for exact file names, more time writing prompts
- **Reduced friction**: Context is crucial for prompt quality, and this removes a barrier to adding it


## Why This Matters

Context is everything when prompting Claude. The more specific your prompt, the better the results. Referencing relevant files with `@` mentions is one of the best ways to provide that context.

But if typing file paths is tedious or error-prone, you're less likely to do it. Fuzzy matching removes that friction. Now you can add context files as quickly as you think of them, without slowing down to verify exact spelling or paths.

It's part of a broader pattern in Claude Code's development: **iterative improvements to UX**. Not every update is a headline feature. Some, like this one, are polish—small changes that compound into a noticeably better experience over time.

## Other Features in v2.0.55

Beyond fuzzy matching, v2.0.55 included several other improvements:

**Proxy DNS Fix**: Proxy DNS resolution was previously forced on by default, which caused issues for some users. Now it requires the `CLAUDE_CODE_PROXY_RESOLVES_HOSTS=true` environment variable to enable. This gives users explicit control.

**Keyboard Navigation Improvement**: Fixed an issue where holding down arrow keys in the memory location selector didn't work as expected. Navigating through options is now smoother.

**AskUserQuestion Enhancement**: The `AskUserQuestion` tool now auto-submits single-select questions on the final question, eliminating an extra review screen. This streamlines workflows where Claude needs to ask clarifying questions.

For the full list of changes, check the [official changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md).

## Try It Yourself

To experience the improved fuzzy matching:

1. **Update Claude Code**:
   ```bash
   claude update
   ```

2. **Start a session** and try typing `@` followed by a partial filename with some letters skipped. Notice how it finds the right files faster.

3. **Check recent features** in your terminal:
   ```bash
   /release-notes
   ```

Fuzzy matching is one of those features you don't realize you needed until you have it. Once you start using it, exact filename typing feels slow.

---

**Resources**:
- [Claude Code Official Changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [ClaudeLog Changelog Tracker](https://claudelog.com/claude-code-changelog/)
- [Community Video Demo](https://www.youtube.com/watch?v=MmDJ8xLQkD4)
- [Daniel San's Tweet on v2.0.55](https://x.com/dani_avila7/status/1993839506940731663)
