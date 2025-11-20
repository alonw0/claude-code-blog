---
title: "Prompt-Based Stop Hooks: LLM-Driven Control Flow in Claude Code 2.0.41"
description: "Claude Code 2.0.41 introduces prompt-based stop hooks - an intelligent alternative to bash scripts that uses Claude Haiku to make context-aware decisions about when to stop execution"
publishDate: 2025-11-16
authors:
  - alon-wolenitz
tags:
  - features
  - hooks
  - automation
  - advanced
featured: true
draft: false
---

If you've been using Claude Code's hooks system, you're probably familiar with bash-based hooks - shell commands that run at specific points in Claude's execution. They're powerful, but they have a fundamental limitation: they can't understand context.

With Claude Code 2.0.41, Anthropic introduced **prompt-based stop hooks** - a smarter alternative that uses Claude Haiku to make intelligent decisions about when Claude should stop working.

Let's dive into what this means and why it's a game-changer.

## The Problem with Bash-Based Hooks

Traditional bash hooks are great for deterministic rules:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "command": "echo 'User submitted a prompt'",
        "blocking": false
      }
    ]
  }
}
```

But what if you need to make a *judgment call*? For example:

- "Has Claude completed all the tasks I asked for?"
- "Should this subagent continue working or is it done?"
- "Is it safe to proceed with this operation?"

These questions require understanding context, not just running shell commands. That's where prompt-based hooks come in.

## How Prompt-Based Hooks Work

Instead of executing a bash command, prompt-based hooks:

1. Send the hook input and your custom prompt to **Claude Haiku** (a fast, lightweight model)
2. Let the LLM evaluate the situation based on natural language understanding
3. Receive a structured JSON response with the decision
4. Automatically apply that decision

It's like having a mini-Claude that can make intelligent decisions at critical points in your workflow.

## Setting Up Your First Prompt-Based Hook

Here's the basic structure:

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "prompt",
        "prompt": "Evaluate whether Claude has completed all tasks. Context: $ARGUMENTS",
        "timeout": 30000
      }
    ]
  }
}
```

**Key fields:**
- `type`: Must be `"prompt"` (not `"command"`)
- `prompt`: Your natural language instruction to Haiku
- `$ARGUMENTS`: Placeholder that gets replaced with hook input
- `timeout`: Optional, defaults to 30 seconds

## Real-World Example: Smart Task Completion

Let's say you're building a multi-step automation. You want Claude to stop only when *all* tasks are genuinely complete, not just when it thinks it's done.

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "prompt",
        "prompt": "Review the following context and determine if ALL tasks are complete. If there are any incomplete tasks, failed tests, or unresolved issues, Claude should continue. Context: $ARGUMENTS. Return {\"decision\": \"approve\" | \"block\", \"reason\": \"explanation\", \"continue\": true | false}"
      }
    ]
  }
}
```

When Claude attempts to stop, Haiku reviews the context and decides:
- **Approve**: Let Claude stop (tasks are done)
- **Block**: Force Claude to continue (tasks incomplete)

## The Response Schema

The LLM must return a JSON object with these fields:

```json
{
  "decision": "approve",           // or "block"
  "reason": "All tasks completed and tests passing",
  "continue": false,               // Should Claude continue?
  "stopReason": "Work is complete",
  "systemMessage": "✓ All 5 tasks verified complete"
}
```

**Field breakdown:**
- `decision`: "approve" (allow stop) or "block" (prevent stop)
- `reason`: Why this decision was made
- `continue`: Whether Claude should keep working
- `stopReason`: Message shown to user when stopping
- `systemMessage`: Optional warning or context

## Use Case: SubagentStop Hooks

Prompt-based hooks really shine with subagents. Instead of rigid rules, let Haiku decide if a subagent has finished its job:

```json
{
  "hooks": {
    "SubagentStop": [
      {
        "type": "prompt",
        "prompt": "This subagent was tasked with: $TASK_DESCRIPTION. Review the work completed: $ARGUMENTS. Has the subagent fully accomplished its assigned task? Consider: completeness, correctness, and any errors encountered."
      }
    ]
  }
}
```

The LLM can understand nuance:
- Did the subagent actually solve the problem?
- Are there edge cases that weren't handled?
- Did it encounter errors that need addressing?

## Prompt-Based vs Bash Hooks: When to Use Each

| Feature | Prompt-Based Hooks | Bash Hooks |
|---------|-------------------|------------|
| **Speed** | Slower (API call to Haiku) | Fast (local execution) |
| **Use Case** | Context-aware decisions | Deterministic rules |
| **Understanding** | Natural language context | Command output only |
| **Complexity** | Simple prompt engineering | Bash scripting required |
| **Cost** | Tiny API cost per invocation | Free (local) |
| **Best For** | "Should I continue?" decisions | Logging, notifications, validation |

**Rule of thumb:** Use prompt-based hooks when you need judgment. Use bash hooks when you need speed and determinism.

## Best Practices for Writing Prompts

### 1. Be Specific About Criteria

Bad:
```json
"prompt": "Should Claude stop? $ARGUMENTS"
```

Good:
```json
"prompt": "Evaluate if Claude should stop. ALL of these must be true: 1) All code builds without errors, 2) All tests pass, 3) All TODO items are resolved. Context: $ARGUMENTS"
```

### 2. Include Expected JSON Schema

Help the LLM by showing the exact structure you want:

```json
"prompt": "Determine if work is complete. Return JSON: {\"decision\": \"approve\"|\"block\", \"reason\": string, \"continue\": boolean}"
```

### 3. Use Concrete Examples

```json
"prompt": "If there are any failing tests, return {\"decision\": \"block\", \"continue\": true}. If all tests pass, return {\"decision\": \"approve\", \"continue\": false}. Context: $ARGUMENTS"
```

### 4. Handle Edge Cases

```json
"prompt": "Check completion status. If uncertain or if there are warnings, err on the side of continuing. Context: $ARGUMENTS"
```

## Advanced Pattern: Multi-Stage Validation

You can combine prompt-based and bash hooks for comprehensive checks:

```json
{
  "hooks": {
    "Stop": [
      {
        "command": "npm test",
        "blocking": true,
        "expectation": { "exitCode": 0 }
      },
      {
        "type": "prompt",
        "prompt": "Tests passed. Now verify: Are all requirements from the original task completed? Context: $ARGUMENTS"
      }
    ]
  }
}
```

First, the bash hook runs tests (fast, deterministic). Then the prompt hook checks if the *actual requirements* were met (context-aware).

## Current Limitations

As of 2.0.41, prompt-based hooks work with:
- ✅ `Stop` - When Claude attempts to finish
- ✅ `SubagentStop` - When subagents attempt to finish

They don't yet work with:
- ❌ `UserPromptSubmit` - When user sends a message
- ❌ `PreToolUse` - Before tool execution

The hooks team has hinted these may come in future releases, which would enable even more powerful workflows.

## Performance Considerations

Each prompt-based hook makes an API call to Haiku. Keep in mind:

- **Latency**: Adds ~1-3 seconds per invocation
- **Cost**: Minimal (Haiku is very cheap), but not zero
- **Timeout**: Default 30s, configurable

For frequently-triggered hooks, bash might be more appropriate. For critical decision points, the intelligence is worth the wait.

## Getting Started

To try prompt-based hooks:

1. **Update to 2.0.41+**
   ```bash
   npm install -g @anthropic-ai/claude-code@latest
   ```

2. **Add a simple hook to `~/.claude/settings.json`:**
   ```json
   {
     "hooks": {
       "Stop": [
         {
           "type": "prompt",
           "prompt": "Review the work context: $ARGUMENTS. Should Claude stop? Return {\"decision\": \"approve\", \"continue\": false}"
         }
       ]
     }
   }
   ```

3. **Test it out** with a multi-step task and see how Haiku evaluates completion

## What This Enables

Prompt-based hooks unlock new patterns:

- **Smart CI/CD**: "Don't stop until all checks pass AND the code quality is good"
- **Agentic workflows**: Let subagents self-evaluate their work
- **Safety guardrails**: "Block if this operation might break production"
- **Quality gates**: "Continue until the solution is production-ready, not just working"

It's the difference between "Did the command succeed?" and "Did we actually accomplish the goal?"

## The Future

This is just the beginning. As Anthropic adds prompt-based support to more hook types, we'll see:

- Pre-execution safety checks
- Dynamic workflow routing
- Self-improving agent behaviors
- Context-aware tooling decisions

The combination of hooks (when to intervene) and LLMs (how to decide) is powerful. It's automation that can actually think.

## Wrapping Up

Prompt-based stop hooks represent a shift from *scripted automation* to *intelligent automation*. Instead of rigid if-then rules, you get context-aware decisions made by an LLM that understands natural language.

They're not a replacement for bash hooks - they're a complement. Use bash for speed and determinism. Use prompts for judgment and context.

Try adding one to your workflow and see how it feels to have an AI making smart decisions about when to stop. It's pretty wild.

---

**Resources:**
- [Hooks Documentation](https://code.claude.com/docs/en/hooks)
- [Claude Code Changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Release Discussion](https://www.reddit.com/r/ClaudeAI/comments/1ozwnun/claude_code_2041/)

**Further Reading:**
- [Building CLI Tools with Claude Code](/blog/building-cli-tools-with-claude)
- [Claude Code Tips and Tricks](/blog/claude-code-tips-and-tricks)
