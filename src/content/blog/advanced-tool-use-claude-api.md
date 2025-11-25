---
title: "Advanced Tool Use in Claude API: Three New Features That Change A lot"
description: "Anthropic introduces Tool Search, Programmatic Tool Calling, and Tool Use Examples - achieving 85% context reduction and 37% token efficiency gains."
publishDate: 2025-11-25
authors: ["alon-wolenitz"]
tags: ["api", "features", "tools", "advanced"]
---

Anthropic has released three beta features that fundamentally transform how Claude handles extensive tool libraries. If you've ever hit context limits while building complex AI applications, or watched your token costs spiral as Claude makes sequential API calls, these features address exactly those pain points.

## The Problem: Tool Use at Scale

Building sophisticated AI applications with Claude typically requires providing dozens or hundreds of tool definitions upfront. Each tool consumes context, leaving less room for actual conversation and results. Multi-step workflows compound the problem, requiring sequential API calls where intermediate results bloat the context window. Complex parameter formats lead to selection errors, forcing additional round-trips to correct mistakes.

The new advanced tool use features tackle these challenges head-on with quantifiable improvements: 85% reduction in context consumption, 37% fewer tokens on complex tasks, and dramatic accuracy gains across the board.

## Feature 1: Tool Search Tool

**The Innovation**: On-demand tool discovery instead of upfront loading.

Traditional tool use requires passing all tool definitions with every API call. With 50 tools averaging 200 tokens each, you've consumed 10,000 tokens before any real work begins. The Tool Search Tool flips this model by letting you defer tool loading using a single parameter: `defer_loading: true`.

Claude can now discover tools dynamically when needed, preserving 95% of your context window for productive work. The accuracy improvements are striking:

- **Claude Opus 4**: 49% → 74% accuracy
- **Claude Opus 4.5**: 79.5% → 88.1% accuracy

**When to use it**: Any time your tool definitions exceed 10K tokens, or when building systems with federated tool sources like Anthropic's Model Context Protocol (MCP) where multiple tool servers each provide extensive libraries.

**Resources**: [Documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) | [Cookbook](https://github.com/anthropics/claude-cookbooks/blob/main/tool_use/tool_search_with_embeddings.ipynb)

## Feature 2: Programmatic Tool Calling

**The Innovation**: Claude orchestrates tools through code instead of sequential API calls.

This feature solves the intermediate results problem. In traditional workflows, Claude calls a tool, waits for results, processes them, then calls another tool. Each step requires a full inference pass, and intermediate data accumulates in the context window.

With programmatic tool calling, you add `allowed_callers` to your tool definitions. Claude then generates Python code to orchestrate multiple tools, process outputs, filter results, and aggregate data—all before final results reach the LLM context.

The performance gains are substantial in a budget compliance workflow example:
- **Token reduction**: 43,588 → 27,297 tokens (37% improvement)
- **Eliminated**: 19+ sequential inference passes
- **Result**: Only filtered, aggregated data reaches Claude's context

Real-world applications include:
- **Claude for Excel**: Manipulating spreadsheets with thousands of rows without context exhaustion
- **Multi-step workflows**: Retrieving team data, expenses, and budgets with filtering before LLM processing
- **Large dataset operations**: Parallel operations across many items with aggregation

**Resources**: [Documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling) | [Cookbook](https://github.com/anthropics/claude-cookbooks/blob/main/tool_use/ptc.ipynb)

## Feature 3: Tool Use Examples

**The Innovation**: Concrete usage patterns eliminate parameter ambiguity.

Even when Claude selects the right tool, unclear parameter formats cause errors. Should an ID be a string or integer? How do you structure nested parameters? What fields are required together?

The `input_examples` array (1-5 examples recommended) shows Claude exactly how to use your tools. Cover minimal parameters, partial usage, and full parameter patterns. The impact on complex parameter handling is dramatic: 72% → 90% accuracy.

This solves format ambiguity, ID conventions, nested structures, and parameter correlations—the common sources of tool invocation errors that require costly retry cycles.

**Resources**: [Documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples)

## How to Get Started

All three features are currently in beta. To access them, add the beta header to your API calls:

```
advanced-tool-use-2025-11-20
```

Then enhance your tool definitions with the new parameters:

```python
# Tool Search Tool
{
    "name": "search_database",
    "description": "Search customer database",
    "defer_loading": true,  # Enable on-demand discovery
    "input_schema": {...}
}

# Programmatic Tool Calling
{
    "name": "get_expenses",
    "allowed_callers": ["programmatic"],  # Enable code orchestration
    "input_schema": {...}
}

# Tool Use Examples
{
    "name": "update_record",
    "input_examples": [  # Show proper usage
        {"user_id": "12345", "field": "email", "value": "new@example.com"},
        {"user_id": "67890", "field": "status", "value": "active"}
    ],
    "input_schema": {...}
}
```

## Strategic Implementation

Layer features based on your specific bottlenecks:

- **Context bloat problem?** → Start with Tool Search Tool
- **Intermediate results overwhelming context?** → Add Programmatic Tool Calling
- **Parameter format errors?** → Implement Tool Use Examples

These features work complementarily. You don't need to adopt all three at once—identify your pain points and apply the relevant solution.

## The Impact

The numbers tell a compelling story:
- **85% context reduction** means building systems with thousands of tools
- **37% token efficiency** directly reduces API costs
- **Accuracy improvements up to 88%** minimize error-correction cycles

But the real impact is architectural. You can now build AI applications that were previously impractical due to context limits or cost constraints. Complex multi-step workflows, large-scale data processing, and extensive tool libraries become viable patterns rather than edge cases requiring workarounds.

For developers building with Claude Code who also leverage the API for custom integrations, these features open new possibilities for sophisticated tool-based workflows. The combination of Claude Code's built-in tools and your custom API-driven tools creates a powerful development environment unbounded by previous limitations.

## Learn More

Read Anthropic's full technical deep-dive: [Advanced Tool Use](https://www.anthropic.com/engineering/advanced-tool-use)

The beta features are available now in the Claude API. Start experimenting with your most context-intensive workflows and watch the efficiency gains compound.
