---
title: "PermissionRequest Hook: Automate Security Decisions in Claude Code 2.0.45"
description: "Learn how the new PermissionRequest hook in Claude Code 2.0.45 lets you programmatically approve or deny tool permissions with custom logic, reducing interruptions while maintaining security."
publishDate: 2025-11-20
authors: ["claude-code"]
tags: ["hooks", "security", "automation", "features"]
featured: true
---

Claude Code 2.0.45 introduced a powerful new feature that fundamentally changes how you can manage permissions: the **PermissionRequest hook**. This hook allows you to programmatically approve or deny tool permission requests using custom logic, dramatically reducing interruptions while maintaining security controls.

## What's New in 2.0.45

Along with Azure AI Foundry support and the ability to send background tasks with `&`, version 2.0.45 adds the **PermissionRequest hook** — a security automation feature that intercepts permission dialogs and lets you make automated decisions about whether to allow, deny, or ask for user confirmation.

## Understanding Permission Requests

Before diving into the hook, let's understand what permission requests are in Claude Code.

### What Are Permission Requests?

Permission requests are security checkpoints that appear when Claude Code wants to perform sensitive operations:

- **Execute shell commands** (Bash tool)
- **Edit or write files** (Edit, Write, MultiEdit tools)
- **Read files** (Read tool)
- **Fetch web content** (WebFetch tool)
- **Search the web** (WebSearch tool)

These dialogs protect you from unintended actions and give you control over what Claude can do in your environment.

### The Permission Evaluation Flow

When Claude attempts to use a tool, the permission system evaluates the request in this order:

1. **PreToolUse Hook** - Intercepts before tool execution
2. **Deny Rules** - Explicitly blocked patterns
3. **Allow Rules** - Explicitly approved patterns
4. **Ask Rules** - User confirmation required
5. **Permission Mode** - Global settings (default, acceptEdits, plan, bypassPermissions)
6. **PermissionRequest Hook** ← **This is where the new hook fits**
7. **User Prompt** - If no automatic decision was made
8. **PostToolUse Hook** - Runs after successful execution

The PermissionRequest hook sits right before the user prompt, giving you the last chance to make an automated decision.

### Permission Modes

Claude Code has several permission modes:

- **default**: Standard permission checks for all tool requests (safest)
- **acceptEdits**: File operations auto-approved for rapid development
- **plan**: Read-only planning mode without execution
- **bypassPermissions**: All tools execute without approval (dangerous!)

## The PermissionRequest Hook

### What Is It?

The PermissionRequest hook is a feature that **automatically approves or denies tool permission requests using custom logic**. Instead of always showing a permission dialog, the hook allows you to:

- **Auto-approve** safe operations (like reading documentation)
- **Auto-deny** dangerous commands (like `rm -rf`)
- **Modify tool inputs** before execution (add logging flags, sanitize paths)
- **Defer to the user** for ambiguous cases

### How It Works

The hook is triggered at the exact moment when a permission dialog would normally appear. Your hook script receives JSON input describing the permission request and must output a JSON decision.

#### Configuration Structure

Hooks are defined in your settings files:
- `~/.claude/settings.json` (user-level, all projects)
- `.claude/settings.json` (project-level)
- `.claude/settings.local.json` (local, machine-specific)

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.claude/hooks/bash-permission.py"
          }
        ]
      }
    ]
  }
}
```

#### Supported Matchers

You can match specific tools or use wildcards:

- **Tool names**: `Bash`, `Read`, `Edit`, `Write`, `WebFetch`, etc.
- **Wildcard**: `*` matches all permission requests
- **Pattern matching**: Use exact strings or regex patterns

#### Input Schema

Your hook receives this JSON via stdin:

```json
{
  "session_id": "abc123",
  "transcript_path": "/path/to/session",
  "cwd": "/current/working/directory",
  "permission_mode": "default",
  "hook_event_name": "PermissionRequest",
  "message": "Claude Code wants to execute: npm run test",
  "notification_type": "tool_permission",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm run test"
  }
}
```

#### Output Format

Your hook must output JSON with a decision:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "allow",
      "updatedInput": {},
      "message": "Optional message on deny",
      "interrupt": false
    }
  }
}
```

**Decision Behaviors:**
- **"allow"** - Approves execution (optionally modify inputs)
- **"deny"** - Rejects with optional message and interrupt flag
- **"ask"** - Defers to user confirmation in the UI

## Practical Examples

### Example 1: Auto-Approve Safe File Reads

Let's start with a simple use case: auto-approving reads of documentation files.

**`~/.claude/hooks/read-permission.py`**:

```python
#!/usr/bin/env python3
import json
import sys

try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError:
    sys.exit(1)

tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})

# Auto-approve reading documentation files
if tool_name == "Read":
    file_path = tool_input.get("file_path", "")
    safe_extensions = (".md", ".mdx", ".txt", ".json", ".yaml", ".yml")

    if file_path.endswith(safe_extensions):
        output = {
            "hookSpecificOutput": {
                "hookEventName": "PermissionRequest",
                "decision": {
                    "behavior": "allow"
                }
            }
        }
        print(json.dumps(output))
        sys.exit(0)

# For other cases, ask the user
output = {
    "hookSpecificOutput": {
        "hookEventName": "PermissionRequest",
        "decision": {
            "behavior": "ask"
        }
    }
}
print(json.dumps(output))
sys.exit(0)
```

**Configuration**:

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "Read",
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.claude/hooks/read-permission.py"
          }
        ]
      }
    ]
  }
}
```

### Example 2: Block Dangerous Commands

Security is paramount. Let's block destructive operations automatically.

**`~/.claude/hooks/bash-permission.py`**:

```python
#!/usr/bin/env python3
import json
import sys
import re

try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError:
    sys.exit(1)

tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})

# Block destructive Bash commands
if tool_name == "Bash":
    command = tool_input.get("command", "")

    dangerous_patterns = [
        r"rm\s+-rf",
        r"sudo\s+rm",
        r"mkfs",
        r"dd\s+if=/dev/zero",
        r":\(\)\{.*\}",  # Fork bomb
    ]

    for pattern in dangerous_patterns:
        if re.search(pattern, command):
            output = {
                "hookSpecificOutput": {
                    "hookEventName": "PermissionRequest",
                    "decision": {
                        "behavior": "deny",
                        "message": f"Dangerous command blocked: {command}",
                        "interrupt": True
                    }
                }
            }
            print(json.dumps(output))
            sys.exit(0)

# Safe commands: ask the user
output = {
    "hookSpecificOutput": {
        "hookEventName": "PermissionRequest",
        "decision": {
            "behavior": "ask"
        }
    }
}
print(json.dumps(output))
sys.exit(0)
```

### Example 3: Whitelist for CI/CD

For CI/CD pipelines, use a whitelist approach to auto-approve only known-safe commands.

```python
#!/usr/bin/env python3
import json
import sys
import re

try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError:
    sys.exit(1)

tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})

# Whitelist of safe CI commands
SAFE_COMMANDS = [
    r"^npm\s+run\s+lint$",
    r"^npm\s+run\s+test(:.*)?$",
    r"^npm\s+run\s+build$",
    r"^npm\s+install",
    r"^git\s+log",
    r"^git\s+diff",
    r"^git\s+status$",
]

if tool_name == "Bash":
    command = tool_input.get("command", "")

    for pattern in SAFE_COMMANDS:
        if re.match(pattern, command):
            output = {
                "hookSpecificOutput": {
                    "hookEventName": "PermissionRequest",
                    "decision": {
                        "behavior": "allow"
                    }
                }
            }
            print(json.dumps(output))
            sys.exit(0)

# Non-whitelisted commands are denied in CI
output = {
    "hookSpecificOutput": {
        "hookEventName": "PermissionRequest",
        "decision": {
            "behavior": "deny",
            "message": "Command not in CI whitelist"
        }
    }
}
print(json.dumps(output))
sys.exit(0)
```

### Example 4: Modify Tool Input Before Execution

You can also modify tool inputs on-the-fly using the `updatedInput` field.

```python
#!/usr/bin/env python3
import json
import sys

try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError:
    sys.exit(1)

tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})

# Add verbose logging to npm commands
if tool_name == "Bash":
    command = tool_input.get("command", "")

    if command.startswith("npm") and "--verbose" not in command:
        output = {
            "hookSpecificOutput": {
                "hookEventName": "PermissionRequest",
                "decision": {
                    "behavior": "allow",
                    "updatedInput": {
                        "command": f"{command} --verbose"
                    }
                }
            }
        }
        print(json.dumps(output))
        sys.exit(0)

# Default behavior
output = {
    "hookSpecificOutput": {
        "hookEventName": "PermissionRequest",
        "decision": {
            "behavior": "ask"
        }
    }
}
print(json.dumps(output))
sys.exit(0)
```

## PermissionRequest vs Other Hooks

Understanding how PermissionRequest differs from other hooks helps you choose the right tool.

### PermissionRequest vs PreToolUse

| Aspect | PreToolUse | PermissionRequest |
|--------|-----------|------------------|
| **Trigger Point** | Before tool execution (early) | When permission dialog appears (late) |
| **Purpose** | Intercept and modify tool calls | Control permission prompts |
| **Can Block** | Yes (deny decision) | Yes (deny decision) |
| **Can Modify Inputs** | Yes | Yes (via updatedInput) |
| **Use Case** | Security validation, input sanitization | Automation of user interactions |

**Use PreToolUse when**: You want early interception regardless of permission settings.

**Use PermissionRequest when**: You want to automate the permission decision itself.

### PermissionRequest vs Permission Rules

**Permission Rules** are declarative patterns in settings:

```json
{
  "permissions": {
    "allow": ["Read(./docs/**)", "Bash(npm run test)"],
    "deny": ["Bash(rm -rf *)", "Read(.env*)"]
  }
}
```

**PermissionRequest Hooks** are programmatic:

- More flexible (runtime logic, external data)
- Can modify tool inputs before execution
- Complex conditional decisions
- Dynamic policies and integrations

**Use Permission Rules when**: You have simple, static allow/deny patterns.

**Use PermissionRequest when**: You need dynamic logic or complex conditions.

## Real-World Use Cases

### Use Case 1: Documentation-First Development

Auto-approve documentation work while requiring review for code changes.

```python
#!/usr/bin/env python3
import json
import sys

input_data = json.load(sys.stdin)
tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})

DOC_EXTENSIONS = (".md", ".mdx", ".txt", ".rst", ".adoc")

# Auto-approve documentation reads and edits
if tool_name in ["Read", "Edit", "Write"]:
    file_path = tool_input.get("file_path", "")
    if file_path.endswith(DOC_EXTENSIONS):
        output = {
            "hookSpecificOutput": {
                "hookEventName": "PermissionRequest",
                "decision": {"behavior": "allow"}
            }
        }
        print(json.dumps(output))
        sys.exit(0)

# Code changes require user approval
output = {
    "hookSpecificOutput": {
        "hookEventName": "PermissionRequest",
        "decision": {"behavior": "ask"}
    }
}
print(json.dumps(output))
sys.exit(0)
```

### Use Case 2: Gradual Autonomy Levels

Implement different autonomy levels based on environment variables.

```python
#!/usr/bin/env python3
import json
import sys
import os
import re

input_data = json.load(sys.stdin)
tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})

# Autonomy levels: 1=low, 2=medium, 3=high
autonomy = os.environ.get("CLAUDE_AUTONOMY", "1")

# Level 1: Only reading allowed
if autonomy == "1":
    if tool_name in ["Read", "Glob", "Grep"]:
        output = {
            "hookSpecificOutput": {
                "hookEventName": "PermissionRequest",
                "decision": {"behavior": "allow"}
            }
        }
        print(json.dumps(output))
        sys.exit(0)

# Level 2: Reading + safe writing
elif autonomy == "2":
    if tool_name in ["Read", "Glob", "Grep", "Write", "Edit"]:
        output = {
            "hookSpecificOutput": {
                "hookEventName": "PermissionRequest",
                "decision": {"behavior": "allow"}
            }
        }
        print(json.dumps(output))
        sys.exit(0)

# Level 3: Full access with command restrictions
elif autonomy == "3":
    if tool_name == "Bash":
        command = tool_input.get("command", "")
        safe = [r"^npm\s+run", r"^git\s+(log|diff|status)"]
        for pattern in safe:
            if re.match(pattern, command):
                output = {
                    "hookSpecificOutput": {
                        "hookEventName": "PermissionRequest",
                        "decision": {"behavior": "allow"}
                    }
                }
                print(json.dumps(output))
                sys.exit(0)

# Default: ask user
output = {
    "hookSpecificOutput": {
        "hookEventName": "PermissionRequest",
        "decision": {"behavior": "ask"}
    }
}
print(json.dumps(output))
sys.exit(0)
```

**Usage**:

```bash
# Low autonomy - only reads
export CLAUDE_AUTONOMY=1
claude-code

# Medium autonomy - reads + writes
export CLAUDE_AUTONOMY=2
claude-code

# High autonomy - reads + writes + safe bash
export CLAUDE_AUTONOMY=3
claude-code
```

### Use Case 3: Environment-Specific Policies

Stricter policies in production, more permissive in development.

```python
#!/usr/bin/env python3
import json
import sys
import os

input_data = json.load(sys.stdin)
tool_name = input_data.get("tool_name", "")

env = os.environ.get("ENVIRONMENT", "development")

# Production: Always ask for Bash and WebFetch
if env == "production":
    if tool_name in ["Bash", "WebFetch", "WebSearch"]:
        output = {
            "hookSpecificOutput": {
                "hookEventName": "PermissionRequest",
                "decision": {"behavior": "ask"}
            }
        }
        print(json.dumps(output))
        sys.exit(0)

# Development: Auto-approve reads
if env == "development":
    if tool_name == "Read":
        output = {
            "hookSpecificOutput": {
                "hookEventName": "PermissionRequest",
                "decision": {"behavior": "allow"}
            }
        }
        print(json.dumps(output))
        sys.exit(0)

# Default fallback
output = {
    "hookSpecificOutput": {
        "hookEventName": "PermissionRequest",
        "decision": {"behavior": "ask"}
    }
}
print(json.dumps(output))
sys.exit(0)
```

## Security Best Practices

### Critical Warning

**Claude Code hooks execute arbitrary shell commands on your system automatically.** By using hooks, you are solely responsible for the commands you configure. Hooks run with your current environment's credentials, so malicious hook code could potentially exfiltrate data or damage your system.

### 1. Principle of Least Privilege

Only grant the minimum permissions necessary. Start restrictive and gradually relax as needed.

```json
{
  "permissions": {
    "allow": [
      "Read(./docs/**)",
      "Bash(npm run lint)",
      "Bash(npm run test)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Read(.env*)",
      "Read(./secrets/**)"
    ]
  }
}
```

### 2. Whitelist Over Deny

Instead of trying to block all dangerous commands, explicitly allow only safe operations:

```python
# GOOD: Explicit whitelist
SAFE_COMMANDS = [
    r"^npm\s+run\s+test$",
    r"^npm\s+run\s+lint$",
    r"^git\s+log",
]

# Check if command matches whitelist
for pattern in SAFE_COMMANDS:
    if re.match(pattern, command):
        # Allow
        pass

# Anything not on whitelist is denied
```

### 3. Code Review All Hooks

Before deploying a hook:

- **Review the code** - What commands does it execute?
- **Check data access** - What files/environment variables does it read?
- **Verify dependencies** - Are external libraries safe?
- **Test thoroughly** - Does it behave correctly in edge cases?

### 4. Audit and Log Decisions

Keep an audit trail of all permission decisions:

```python
#!/usr/bin/env python3
import json
import sys
import logging
from datetime import datetime

logging.basicConfig(
    filename='/var/log/claude-code-permissions.log',
    level=logging.INFO,
    format='%(asctime)s - %(message)s'
)

input_data = json.load(sys.stdin)
tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})

# Log every permission request
logging.info(f"Permission request: {tool_name} - {json.dumps(tool_input)}")

# Your decision logic here...
decision = "ask"
logging.info(f"Decision: {decision}")

output = {
    "hookSpecificOutput": {
        "hookEventName": "PermissionRequest",
        "decision": {"behavior": decision}
    }
}
print(json.dumps(output))
sys.exit(0)
```

### 5. Avoid Dangerous Permission Modes

```bash
# AVOID: Bypasses ALL safety checks
claude-code --dangerously-skip-permissions

# PREFER: Use permission modes strategically
# acceptEdits mode for rapid file editing
claude-code --accept-edits

# Then switch back to default for production work
```

### 6. Test Your Hooks

Create a test script to verify hook behavior:

```bash
#!/bin/bash
# test-hook.sh

echo "Testing PermissionRequest hook..."

# Test case 1: Safe read
echo '{"tool_name":"Read","tool_input":{"file_path":"README.md"},"hook_event_name":"PermissionRequest"}' | \
  python3 ~/.claude/hooks/permission-handler.py

# Test case 2: Dangerous command
echo '{"tool_name":"Bash","tool_input":{"command":"rm -rf /"},"hook_event_name":"PermissionRequest"}' | \
  python3 ~/.claude/hooks/permission-handler.py

# Verify outputs are correct
```

## Getting Started

### Quick Start Example

1. **Create a simple hook script**:

```bash
mkdir -p ~/.claude/hooks
cat > ~/.claude/hooks/permission-handler.py << 'EOF'
#!/usr/bin/env python3
import json
import sys

input_data = json.load(sys.stdin)
tool_name = input_data.get("tool_name", "")

# Auto-approve Read operations
if tool_name == "Read":
    output = {
        "hookSpecificOutput": {
            "hookEventName": "PermissionRequest",
            "decision": {"behavior": "allow"}
        }
    }
    print(json.dumps(output))
    sys.exit(0)

# Ask for everything else
output = {
    "hookSpecificOutput": {
        "hookEventName": "PermissionRequest",
        "decision": {"behavior": "ask"}
    }
}
print(json.dumps(output))
sys.exit(0)
EOF

chmod +x ~/.claude/hooks/permission-handler.py
```

2. **Configure the hook**:

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.claude/hooks/permission-handler.py"
          }
        ]
      }
    ]
  }
}
```

3. **Test it**:

```bash
claude-code
# Ask Claude to read a file - should auto-approve
# Ask Claude to execute a command - should prompt you
```

### Debugging Tips

**Enable verbose logging**:

```python
import logging
logging.basicConfig(
    filename='/tmp/claude-hook-debug.log',
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

logging.debug(f"Received input: {json.dumps(input_data)}")
logging.debug(f"Decision: {decision}")
```

**Check exit codes**:

- Exit code **0**: Success (decision processed)
- Exit code **2**: Blocking error (stderr fed to Claude)
- Other codes: Non-blocking warnings (logged but processing continues)

**Test without Claude Code**:

```bash
echo '{"tool_name":"Read","tool_input":{"file_path":"test.txt"},"hook_event_name":"PermissionRequest"}' | \
  python3 ~/.claude/hooks/permission-handler.py
```

## Conclusion

The PermissionRequest hook in Claude Code 2.0.45 is a powerful tool for automating security decisions. It enables you to:

✅ Reduce permission prompts for trusted operations
✅ Enforce security policies programmatically
✅ Customize behavior per environment or project
✅ Maintain audit trails and logging
✅ Balance automation with safety

**Key Takeaway**: Use PermissionRequest hooks to be more explicit about your security policies while maintaining flexibility for edge cases that static rules cannot express.

Start simple with auto-approving safe operations, then gradually expand your automation as you gain confidence. Always prioritize security and regularly review your hook configurations.

---

**Further Reading:**
- [Output Styles: Claude Code's Most Underrated Feature](/blog/output-styles-underrated-feature)
- [Prompt-Based Stop Hooks: LLM-Driven Control Flow](/blog/prompt-based-stop-hooks)
- [Claude Code is a Beast: Lessons from 300k LOC](/blog/claude-code-beast-hardcore-workflow)
