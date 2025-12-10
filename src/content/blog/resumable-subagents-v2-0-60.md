---
title: "Resumable Sub-Agents in Claude Code v2.0.60: A Community Discovery"
description: "The community discovered that Claude Code v2.0.60 quietly introduced resumable sub-agents—a feature that could enable agent round-table discussions once current bugs are fixed. Here's what we know."
publishDate: 2025-12-09
authors: ["claude-code"]
tags: ["features", "community", "agents", "advanced", "experimental"]
featured: false
draft: false
---

# Resumable Sub-Agents in Claude Code v2.0.60: A Community Discovery

Claude Code v2.0.60 introduced something Anthropic didn't advertise in the release notes: **resumable sub-agents**. While the official changelog highlighted background agents, the community discovered that agents can now be resumed and extended—potentially unlocking multi-agent collaboration workflows once the current bugs get fixed.

**Note:** This feature was discovered by the Reddit community and is not yet officially documented. The behavior described here is based on community testing and may change in future releases.

## What's New

**What it is:** Resumable sub-agents allow you to continue a previous agent's conversation. You can launch a background agent, let it complete its task, then resume that same agent with new questions or instructions—picking up where it left off.

**Why it matters:** This is the foundation for agent round-table workflows. Imagine multiple agents collaborating on complex tasks, building on each other's work, debating approaches, or dividing responsibilities. The community has been hacking together these patterns manually. Once Anthropic fixes the bugs, this becomes first-class functionality.

**How to try it:** A Reddit user shared this test prompt that demonstrates the capability:

> I'd like to learn more about subagents. Please could you help me experiment with them?
> (1) Use the Task tool to run a background subagent "Why is blood red?", then use AgentOutputTool to wait until it's done.
> (2) Use the Task tool to resume that agent and ask it "What other colors might it be?", and tell me its verbatim output. Thank you!

## How to Try It

The Reddit post suggests testing with this prompt:

```
I'd like to learn more about subagents. Please could you help me experiment with them?
(1) Use the Task tool to run a background subagent "Why is blood red?",
    then use AgentOutputTool to wait until it's done.
(2) Use the Task tool to resume that agent and ask it "What other colors might it be?",
    and tell me its verbatim output. Thank you!
```

The key is using:
- The **Task tool** to launch a background agent and get its agent ID
- The **AgentOutputTool** to wait for completion
- The **Task tool again** with the `resume` parameter to continue that agent's conversation

## Current Limitations

According to the Reddit post: **"These resumable agents aren't much use yet."** Here are the bugs identified:

### Bug 1: Transcripts Missing User Prompts

**From the Reddit post:**
> "Crucially, subagent transcripts only include assistant responses, not prompts. So when you resume a subagent it'll give odd output like 'Oh that's strange! I told you about why blood is red but it appears you didn't even ask me that!' I don't think the feature can be used well without this."

The resumed agent can see its own previous responses but not what prompted them, leading to confusion about the conversation context.

### Bug 2: AgentOutputTool Parameter Design

**From the Reddit post:**
> "The AgentOutputTool tool takes a single agentId as parameter, but its output can show the status of multiple subagents. That'll be useful for multi-agent round-tables. I hope they'll let it take a list or wildcard for all subagents."

### Bug 3: No System Reminders for Agent Completion

**From the Reddit post:**
> "There's not yet a <system-reminder/> for subagents being ready, like there is with BashOutputTool. I'm sure they'll add this"

### Bug 4: Can't Get Agent IDs Without Background Execution

**From the Reddit post:**
> "It's a bit irritating that you can't obtain an agentId without using run-in-background. But I guess we can live with that. I suspect the PostToolUseHook shows agentId though (since it appears in the transcript as part of the rich json-structured output of the Task tool)"

The post also mentions a workaround:
> "Well, there was, but you had to do it yourself by reading the ~/.claude/projects/DIR/agents-*.jsonl files"

## Why This Matters

**From the Reddit post:**
> "I think that once they fix bugs, then they'll become hugely important. We've already seen lots of people hack together 'agent round-table' solutions, where agents interact with each other on an ongoing basis. Once Anthropic fix the bugs, then these things will be supported first class within Claude Code."

The key insight: the community has been building multi-agent collaboration workflows through various hacks and workarounds. Resumable agents are the infrastructure to support these patterns natively in Claude Code.

Once the bugs are fixed (especially the transcript issue), this enables:
- **Agent round-tables** where multiple agents collaborate on complex tasks
- **Multi-agent workflows** where agents build on each other's work
- **First-class support** for patterns the community has been hacking together

## The Timeline

**From the Reddit post:**
> "The 'resumable' parameter was actually released in v2.0.28 on October 27th, but there was no way to provide it an agentId value until now by kicking off a background task. (Well, there was, but you had to do it yourself by reading the ~/.claude/projects/DIR/agents-*.jsonl files)"

So the infrastructure for resumable agents has existed since October 27th, but v2.0.60's background agents feature (released December 6th) made it practical by providing a clean way to get agent IDs.

## What to Watch For

Based on the bugs identified in the Reddit post, here are the likely fixes to expect:

**Bug fixes:**
- Full transcript preservation (including user prompts) - the critical bug blocking practical use
- System reminders when agents complete (like BashOutputTool has)
- AgentOutputTool accepting a list of agent IDs or wildcards for multi-agent monitoring
- Cleaner agent ID access without requiring background execution

The Reddit post suggests the feature isn't ready for serious use yet, but once the transcript bug is fixed, it could enable the agent round-table workflows the community has been building manually.

## Conclusion

Claude Code v2.0.60 quietly introduced the infrastructure for resumable sub-agents—a community discovery that points toward native support for multi-agent collaboration workflows.

As the Reddit post notes, the feature "isn't much use yet" due to critical bugs, especially the missing prompts in agent transcripts. But the infrastructure is in place, and once Anthropic fixes these issues, it will enable first-class support for the agent round-table patterns the community has been hacking together.

**If you're curious:** Try the experiment from the Reddit post to see how resumable agents work (and break).

**If you're building workflows:** This isn't production-ready yet. But keep an eye on the changelog—when the transcript bug gets fixed, this could fundamentally change how complex tasks are handled in Claude Code.

The community discovered this feature by digging into the tools and testing edge cases. If you find interesting behavior in Claude Code, share it in the [GitHub discussions](https://github.com/anthropics/claude-code/discussions)—that's how discoveries like this happen.

---

**Sources:**
- [Claude Code v2.0.60 Release Notes](/blog/claude-code-2-0-60-release)
- [Claude Code Official Changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Claude Code GitHub Repository](https://github.com/anthropics/claude-code)
- Community discovery via Reddit
