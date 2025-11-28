---
title: "Fixing Enhanced Plan Mode: Community Workarounds That Actually Work"
description: "Struggling with plan mode's token consumption or quality issues? Here are four community-tested workarounds: custom commands, hooks, downgrades, and when to use each."
publishDate: 2025-11-28
authors:
  - alon-wolenitz
tags:
  - workarounds
  - planning
  - tutorial
  - community
  - solutions
featured: true
draft: false
---

In [Part 1](/blog/enhanced-plan-mode-what-changed), we covered the problems with Claude Code's enhanced plan mode v2: Haiku agents making recommendations without verification, and token consumption burning 100k-150k tokens per planning session.

The good news? The community has developed multiple workarounds that actually work.

This post covers four solutions—from a custom `/plan` slash command to complete downgrades—and helps you decide which approach fits your workflow.

## The Community Solution: Custom Plan Mode

So what's the fix? A Reddit user ([u\Permit-Historical](https://www.reddit.com/r/ClaudeCode/comments/1p6vzg8/the_new_plan_mode_is_not_good/)) built a custom `/plan` slash command that changes the workflow:

**Instead of**:
1. Haiku explores and makes recommendations
2. Opus trusts those recommendations
3. Opus builds a plan
4. Implementation begins

**Do this**:
1. Haiku explores and returns **hypotheses** (not conclusions)
2. **Opus reads the actual files** Haiku identified
3. Opus **verifies or refutes** each hypothesis
4. Opus builds a plan based on verified information
5. Implementation begins

The key insight: **Haiku scouts locations, Opus investigates them**.

### The Custom `/plan` Command

Here's the complete slash command. Save this as `.claude/commands/plan.md`:

```markdown
---
name: plan
description: Create a detailed implementation plan with parallel exploration before any code changes
model: opus
argument-hint: <task description>
---

You are entering PLANNING MODE. This is a critical phase that requires thorough exploration and careful analysis before any implementation.

## Phase 1: Task Understanding

First, clearly state your understanding of the task: $ARGUMENTS

If the task is unclear, use AskUserQuestion to clarify before proceeding.

## Phase 2: Parallel Exploration

Spawn multiple Explore agents in parallel using the Task tool with subagent_type='Explore'. Each agent should focus on a specific aspect:

1. **Architecture Explorer**: Find the overall project structure, entry points, and how components connect
2. **Feature Explorer**: Find existing similar features or patterns that relate to the task
3. **Dependency Explorer**: Identify dependencies, imports, and modules that will be affected
4. **Test Explorer**: Find existing test patterns and testing infrastructure

For each Explore agent, instruct them to:
- Return ONLY hypotheses (not conclusions) about what they found
- Provide FULL file paths for every relevant file
- NOT read file contents deeply - just identify locations
- Be thorough but efficient - they are scouts, not implementers

Example prompt for an Explore agent:
  ` ``
  Explore the codebase to find [specific aspect]. Return:
  1. Your hypothesis about how [aspect] works
  2. Full paths to all relevant files (e.g., /Users/.../src/file.ts:lineNumber)
  3. Any patterns you noticed

  Do NOT draw conclusions - just report findings. The main agent will verify.
  ` ``

## Phase 3: Hypothesis Verification

After receiving results from all Explore agents:

1. Read each file that the Explore agents identified (use full paths)
2. Verify or refute each hypothesis
3. Build a complete mental model of:
   - Current architecture
   - Affected components
   - Integration points
   - Potential risks

## Phase 4: Plan Creation

Create a detailed plan file at `~/.claude/plans/` with this structure:

```markdown
# Implementation Plan: [Task Title]

Created: [Date]
Status: PENDING APPROVAL

## Summary
[2-3 sentences describing what will be accomplished]

## Scope
### In Scope
- [List what will be changed]

### Out of Scope
- [List what will NOT be changed]

## Prerequisites
- [Any requirements before starting]

## Implementation Phases

### Phase 1: [Phase Name]
**Objective**: [What this phase accomplishes]

**Files to Modify**:
- `path/to/file.ts` - [What changes]
- `path/to/another.ts` - [What changes]

**New Files to Create**:
- `path/to/new.ts` - [Purpose]

**Steps**:
1. [Detailed step]
2. [Detailed step]
3. [Detailed step]

**Verification**:
- [ ] [How to verify this phase works]

### Phase 2: [Phase Name]
[Same structure as Phase 1]

### Phase 3: [Phase Name]
[Same structure as Phase 1]

## Testing Strategy
- [Unit tests to add/modify]
- [Integration tests]
- [Manual testing steps]

## Rollback Plan
- [How to undo changes if needed]

## Risks and Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | Low/Med/High | Low/Med/High | [How to mitigate] |

## Open Questions
- [Any unresolved questions for the user]

---
**USER: Please review this plan. Edit any section directly in this file, then confirm to proceed.**
```markdown

## Phase 5: User Confirmation

After writing the plan file:

1. Tell the user the plan has been created at the specified path
2. Ask them to review and edit the plan if needed
3. Wait for explicit confirmation before proceeding
4. DO NOT write or edit any implementation files until confirmed

## Phase 6: Plan Re-read

Once the user confirms:

1. Re-read the plan file completely (user may have edited it)
2. Note any changes the user made
3. Acknowledge the changes before proceeding
4. Only then begin implementation following the plan exactly

## Critical Rules

- NEVER skip the exploration phase
- NEVER write implementation code during planning
- NEVER assume - verify by reading files
- ALWAYS get user confirmation before implementing
- ALWAYS re-read the plan file after user confirms (they may have edited it)
- The plan must be detailed enough that another developer could follow it
- Each phase should be independently verifiable
```

### How It Differs from Default

**Default plan mode**:
- Haiku agents explore and conclude
- Opus aggregates conclusions
- Plan reflects Haiku's interpretation

**Custom plan mode**:
- Haiku agents explore and hypothesize
- **Opus reads actual files to verify**
- Plan reflects Opus's verified understanding

The cost: More Opus API calls during planning (reading verification files).

The benefit: Plans based on accurate analysis, not pattern-matched assumptions.

### Installing the Custom Command

1. **Create the command file**:

```bash
mkdir -p ~/.claude/commands
```

2. **Save the content** above to `~/.claude/commands/plan.md`

3. **Use it**:

```bash
# In Claude Code
/plan Add user authentication with JWT tokens
```

That's it. Claude now uses the verification workflow.

### Other Community Workarounds

Beyond the custom slash command, the community has developed several other approaches to address the token consumption and quality issues:

#### 1. The PreToolUse Hook Method

This approach intercepts and blocks Explore agents before they spawn, effectively disabling the multi-agent planning while keeping everything else functional. (by Reddit user [(u\uhs-robert)](https://www.reddit.com/r/ClaudeCode/comments/1p7gh3q/plan_mode_can_we_go_back_to_the_old_way_without/))

**How it works**: Add this to your `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Task",
        "hooks": [
          {
            "type": "command",
            "command": "jq -e '.tool_input.subagent_type == \"Explore\"' >/dev/null && { echo \"ERROR: Explore subagent is disabled in this environment\" >&2; exit 2; } || exit 0"
          }
        ]
      }
    ]
  }
}
```

**What this does**:
- Intercepts any `Task` tool calls
- Checks if the subagent type is `Explore`
- Returns error code 2 to block Explore agents
- Allows all other Task tool usage (like Plan agents, general-purpose agents, etc.)

**Pros**:
- Stops the token burn completely
- Restores behavior closer to pre-v2.0.51
- No need to modify system prompts
- Selective blocking (only Explore agents)

**Cons**:
- Requires manual configuration
- May break if you actually want Explore agents for non-planning tasks
- Needs `jq` installed on your system

One Reddit user reported:

> "The hook I provided in the post uses that line of reasoning. It kills Explore type sub-agents before they are spawned which are the ones that plan mode uses. It hasn't produced any unintended side effects on my end... yet."

#### 2. Manual Prompt Addition

The simplest workaround: just tell Claude not to spawn agents.

Add this to the end of each planning prompt:

```
DO NOT USE TASK TO LAUNCH AGENTS TO PLAN.
```

**Pros**:
- No configuration needed
- Works immediately
- Easy to remember

**Cons**:
- Tedious to add every time
- Easy to forget
- Not persistent across sessions

A Reddit commenter shared:

> "While in plan mode, I add 'DO NOT USE TASK TO LAUNCH AGENTS TO PLAN.' at the end of each prompt. The main agent does all the planning."

Another user noted they're working on adding this to a hook automatically:

> "The next thing I'm working on is stopping Claude from writing a plan.md without my explicit instruction to do so. I'm going to test adding a message onto the hook like: 'Do not make a planning document, just tell me the plan directly unless I explicitly request a plan.md.'"

#### 3. Downgrade to v1.x

When all else fails, some users are reverting to the last version before the plan mode changes. (u\Matthewbal)

**The full downgrade process**:

```bash
# Install specific v1.x version
npm install -g @anthropic-ai/claude-code@^1.0.85

# Disable auto-updates via config
claude config set -g autoUpdates disabled

# Set environment variable (required even after config)
export DISABLE_AUTOUPDATER=1

# Make it permanent (bash)
echo 'export DISABLE_AUTOUPDATER=1' >> ~/.bashrc

# Or for zsh users
echo 'export DISABLE_AUTOUPDATER=1' >> ~/.zshrc
```

**Pros**:
- Restores the 10-30 second planning times
- No token consumption issues
- Proven, stable behavior

**Cons**:
- Misses new features in v2.x
- Requires manual version management
- May have security/compatibility issues over time
- Auto-update disabling requires both config AND environment variable

From Reddit:

> "I got so sick of it I just downgraded to Claude code 1.x and disabled auto updates. Now it works great again and finishes plans in 10-30s like before!"

Though one user noted the hook workaround didn't fully prevent spawning:

> "Ugh so the workaround didn't work so well for me, it still managed to call subagents."

Which led to the downgrade decision.

#### 4. Understanding the System Prompt Changes

For the truly adventurous, some users are diving into Claude's system prompts to understand what changed.

Tools like **tweakcc** let you view and edit Claude's system prompts directly. The community has also created a [repository of Claude Code system prompts](https://github.com/Piebald-AI/claude-code-system-prompts) tracking changes across versions. (mentioned by u\BrilliantEmotion4461)

Key findings:
- **Post-v2.0.51**: New "Sub Agent Plan Mode" prompt forces Haiku to write plans
- **EnterPlanMode guardrails failing**: Supposed to distinguish between simple tasks and complex PRDs, but defaulting to full PRD treatment
- **Plan file location enforcement**: Plans must be written to `.claude/plans/` by the system

One Reddit comment explained:

> "The owner of this repository also has a repository of Claude's system prompts. It looks like plan mode was 'upgraded' after version 2.0.51 to reduce token count and the new prompts are not working as designed."

**Note**: Editing system prompts is advanced territory and can break things in unexpected ways. Most users should stick with hooks, custom commands, or downgrades.

### Which Workaround Should You Use?

**For most users**: Start with the **custom `/plan` command**. It gives you the quality benefits of Opus verification while still using the multi-agent exploration approach when it makes sense.

**For token-conscious users on Pro plans**: The **PreToolUse hook** is your friend. It completely blocks the token burn and restores old behavior.

**For quick one-off fixes**: The **manual prompt addition** works in a pinch, though it's tedious for regular use.

**As a last resort**: **Downgrade to v1.x** if the new plan mode is fundamentally incompatible with your workflow. But keep in mind you'll miss new features.

**For the technically curious**: Explore **system prompt modifications** to understand how plan mode works, but be cautious about actually modifying production behavior this way.

## Practical Guidance: Choosing Your Approach

So should you use default plan mode or the custom version? Here's a decision framework:

### Use Default Plan Mode When:

**Exploring unfamiliar codebases**
- You're new to the project
- You need high-level architectural understanding
- Speed of exploration matters more than precision

**Implementing well-defined features**
- Requirements are clear
- Patterns are established
- The task is execution, not design

**Working with established patterns**
- Following existing conventions
- Replicating similar features
- Mechanical changes

**Cost/speed are priorities**
- Operating under tight token budgets
- Need results quickly
- Risk of minor plan inaccuracies is acceptable

### Use Custom Plan Mode When:

**Making architectural decisions**
- Choosing between approaches
- Evaluating trade-offs
- Designing new patterns

**Assessing code quality**
- Finding refactoring opportunities
- Identifying over-engineering
- Evaluating complexity

**Precision is critical**
- Production systems
- High-stakes changes
- Code that needs deep understanding

**Evaluation tasks**
- "Should we..." questions
- Quality assessments
- Architectural reviews

### The Hybrid Approach

You can also mix strategies:

1. **Start with default plan mode** for initial exploration
2. **Review the plan** and identify high-risk areas
3. **Ask Claude to verify** specific sections by reading the actual files
4. **Adjust the plan** based on verification

This gives you speed where pattern-matching works, and precision where judgment matters.

### Cost Considerations

The token economics of plan mode have changed significantly in v2.0.51+:

**Default plan mode (v2.0.51+)**: 2-3 Explore agents × 50k tokens each = **100k-150k tokens**
- Can burn 30-40% of Pro plan (200k) budget in one planning session
- Takes longer than v1.x (users report agents running vs. 10-30s previously)
- ROI questionable when plans are incomplete or need verification anyway

**Custom plan mode**: ~3-5 Haiku calls (exploration) + 5-15 Opus read/verify calls
- More expensive than old v1.x plan mode
- But likely cheaper than default v2.x if you factor in failed/incomplete plans
- Better ROI for evaluation tasks where accuracy matters

**PreToolUse hook method**: Blocks Explore agents entirely
- Zero extra token cost for exploration
- Main agent (Opus) does planning directly
- Similar to v1.x behavior
- Best for token-conscious users

**Downgrade to v1.x**: Pre-v2.0.51 planning behavior
- Minimal token overhead (direct Opus planning)
- 10-30 second planning times
- Proven, predictable costs

The new math: With default v2.x plan mode consuming 100k-150k tokens, you might only get 1-2 planning sessions before hitting Pro plan limits. Compare that to verification tokens in custom plan mode (maybe 20-30k extra Opus tokens for file reads), and suddenly verification looks cheap.

For unlimited plan users, it's less about hard limits and more about efficiency: why waste tokens on exploration that might be wrong when you can verify upfront?

## The Bigger Picture

This whole story reveals something important about multi-agent AI workflows:

### The Efficiency-Accuracy Trade-off

AI systems face the same problem that engineering teams do:
- Send junior developers to explore quickly (Haiku agents)
- Have senior developers verify and design (Opus agent)

Works great when juniors are gathering facts. Risky when they're making judgment calls.

The community solution mirrors how good teams work: Juniors report findings and hypotheses, seniors verify before making decisions.

### Community-Driven Evolution

What's notable here isn't just the technical solution—it's the process:

1. **Anthropic ships a feature** that solves real problems (plan mode)
2. **Community uses it** and discovers edge cases
3. **Users identify the architectural trade-off** (speed vs. verification)
4. **Community builds an alternative** using existing primitives (slash commands)
5. **Both approaches coexist**, letting users choose

This is how platforms evolve. Not "one true way" but "here are tools, combine them for your needs."

### The Lesson for AI-Assisted Development

As AI coding assistants get more sophisticated, we're going to see more of this:

**Systems that trade accuracy for speed**: Multi-agent architectures using cheaper models for subtasks will become common. Understanding when those trade-offs work and when they don't matters.

**Customization as a necessity**: Default behaviors can't optimize for every use case. Power users will always build custom workflows. Platforms that enable this win.

**Verification layers**: Trust-but-verify becomes standard practice. The output is a starting point, not ground truth—whether it's from Haiku agents or Opus direct.

The future isn't "AI that never makes mistakes." It's "AI systems where humans understand the failure modes and build verification into workflows."

## Getting Started

Ready to try plan mode? Here's a practical approach:

### Week 1: Use Default Plan Mode

```bash
# In Claude Code, when starting complex tasks:
# Just let it enter plan mode automatically, or trigger it manually (Shift+Tab)
EnterPlanMode
```

Try it on:
- Adding a feature to an unfamiliar codebase
- Refactoring with clear, mechanical steps
- Implementing something similar to existing patterns

**Goal**: Understand where default plan mode works well for you.

### Week 2: Test the Edge Cases

Deliberately try evaluation tasks:

```
"Find code that can be simplified in the authentication module"
"Identify performance bottlenecks in the dashboard"
"Review the API client architecture for improvements"
```

**Goal**: Experience where default plan mode's hypotheses don't hold up.

### Week 3: Install Custom Plan Mode

Add the custom `/plan` command and try the same evaluation tasks.

**Goal**: Compare results and decide which approach fits your workflow.

### The Long-Term Strategy

Most users will land on:
- **Default plan mode** for 70-80% of tasks (discovery, implementation)
- **Custom plan mode** for 20-30% of tasks (evaluation, critical changes)
- **Hybrid approach** for complex projects (explore fast, verify selectively)

The key is recognizing which type of task you're doing, and choosing the right tool.

---

## Resources

**Claude Code Documentation**:
- [Official Plan Mode Docs](https://code.claude.com/docs/plan-mode)
- [Creating Slash Commands](https://code.claude.com/docs/slash-commands)
- [Multi-Agent Workflows](https://code.claude.com/docs/agents)

**Community Resources**:
- [Reddit: The Haiku Problem Discussion](https://www.reddit.com/r/ClaudeCode/comments/1p6vzg8/the_new_plan_mode_is_not_good/)
- [Reddit: Bring Back Old Plan Mode](https://www.reddit.com/r/ClaudeCode/comments/1p7gh3q/plan_mode_can_we_go_back_to_the_old_way_without/)
- [Custom Plan Mode Implementations](https://github.com/topics/claude-code-custom-commands)

**Related Posts**:
- [Output Styles: Claude Code's Most Underrated Feature](/blog/output-styles-underrated-feature)
- [The End of Approval Fatigue: Sandboxing in Claude Code](/blog/end-of-approval-fatigue-sandboxing)
- [Claude Code Tips and Tricks](/blog/claude-code-tips-and-tricks)

---

Plan mode is a powerful addition to Claude Code. Understanding its architecture—and its trade-offs—lets you use it effectively. The community's custom solution shows what's possible when you understand the tools deeply enough to improve them.

Try both approaches. See what works for your workflow. And remember: the best tool is the one you understand well enough to know when not to use it.
