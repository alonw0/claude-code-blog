---
title: "Modular Rules in Claude Code: Organizing Project Instructions with .claude/rules/"
description: "Claude Code v2.0.64 adds .claude/rules/ for modular, path-specific project instructions. Break down your CLAUDE.md into focused files, apply rules conditionally with glob patterns, and organize better."
publishDate: 2025-12-10
authors: ["claude-code"]
tags: ["features", "configuration", "workflow", "best-practices"]
featured: false
draft: false
---

# Modular Rules in Claude Code: Organizing Project Instructions with .claude/rules/

Your project's CLAUDE.md started simple: a few coding conventions, maybe some architecture notes. Three months later, it's 500 lines covering API design, testing patterns, security requirements, database conventions, frontend guidelines, and deployment procedures.

Finding the relevant section when you need it? Good luck scrolling.

**Claude Code v2.0.64 introduces `.claude/rules/`** - a modular system for organizing project instructions into focused, maintainable files.

## What's New

**What it is:** `.claude/rules/` is a directory for organizing project-specific instructions as separate markdown files. Instead of one monolithic CLAUDE.md, you can break instructions into focused files like `code-style.md`, `testing.md`, and `security.md`.

**How it works:** Claude Code automatically discovers and loads all `.md` files in `.claude/rules/` (including subdirectories). These files work alongside your main CLAUDE.md, with the same priority level. No configuration required - just create the directory and add markdown files.

**Why it matters:**
- **Organization**: Topic-based files are easier to navigate and maintain
- **Conditional rules**: Apply instructions only to specific file types using glob patterns
- **Team collaboration**: Smaller files reduce merge conflicts and make it easier for team members to contribute
- **Modularity**: Share common rules across projects via symlinks
- **Scalability**: Add new rule files as your project grows without cluttering a single file

## Basic File Structure

Here's what a modular rules setup looks like:

```
your-project/
├── .claude/
│   ├── CLAUDE.md           # Main project overview and architecture
│   └── rules/
│       ├── code-style.md   # Formatting, naming conventions
│       ├── testing.md      # Testing requirements and patterns
│       ├── security.md     # Security guidelines
│       └── api-design.md   # API conventions
```

**How Claude Code loads these files:**
1. Reads `.claude/CLAUDE.md` (if it exists)
2. Recursively discovers all `.md` files in `.claude/rules/`
3. Loads them with the same priority as CLAUDE.md
4. Applies them to your sessions automatically

**Key points:**
- All `.md` files are loaded automatically - no manifest or index required
- Subdirectories are fully supported
- Symlinks work and are resolved normally
- Circular symlinks are detected and handled gracefully

## Path-Specific Rules: The Key Feature

The most powerful aspect of `.claude/rules/` is conditional application. You can scope rules to specific files using YAML frontmatter with a `paths` field.

### Basic Example

**File: `.claude/rules/api-validation.md`**

```markdown
---
paths: src/api/**/*.ts
---

# API Endpoint Rules

When working with API endpoints:

- All endpoints must validate input using Zod schemas
- Use the standard error response format from `src/api/errors.ts`
- Include OpenAPI documentation comments above each route handler
- Return proper HTTP status codes (200, 201, 400, 404, 500)
```

**What happens:** These rules only apply when Claude is working with TypeScript files under `src/api/`. When editing frontend code or tests, these rules aren't loaded - reducing noise and keeping context focused.

### Without Path Restrictions

Rules without a `paths` field are loaded unconditionally and apply to all files:

**File: `.claude/rules/code-style.md`**

```markdown
# Code Style Guidelines

Apply these conventions across the entire codebase:

- Use 2-space indentation
- Prefer const over let
- Use descriptive variable names (no single letters except loop counters)
- Max line length: 100 characters
```

No frontmatter needed - this applies everywhere.

### Glob Pattern Support

The `paths` field supports standard glob patterns:

| Pattern | Matches | Use Case |
|---------|---------|----------|
| `**/*.ts` | All TypeScript files | Language-specific rules |
| `src/components/**/*.tsx` | React components in specific directory | Component guidelines |
| `tests/**/*.test.ts` | Test files | Testing conventions |
| `src/{api,lib}/**/*` | Files under multiple directories | Rules for related modules |
| `*.md` | Markdown files in project root | Documentation standards |

**Multiple patterns:**

```markdown
---
paths: src/**/*.{ts,tsx}, lib/**/*.ts
---
```

Or with commas:

```markdown
---
paths: src/**/*.ts, tests/**/*.test.ts
---
```

## Organization Patterns

### Pattern 1: By Topic

The most straightforward approach - one file per topic:

```
.claude/rules/
├── code-style.md      # Formatting and naming
├── testing.md         # Test requirements
├── security.md        # Security best practices
├── api-design.md      # API conventions
├── database.md        # Database patterns
└── deployment.md      # Deployment procedures
```

**Best for:** Small to medium projects where topics don't need further subdivision.

### Pattern 2: By Technology Layer

Organize rules by which part of the stack they apply to:

```
.claude/rules/
├── frontend/
│   ├── react-patterns.md
│   ├── state-management.md
│   └── styling.md
├── backend/
│   ├── api-design.md
│   ├── database.md
│   └── authentication.md
└── shared/
    ├── typescript.md
    └── testing.md
```

**Best for:** Full-stack projects with distinct frontend and backend concerns.

### Pattern 3: By Feature Domain

Organize around business domains or feature areas:

```
.claude/rules/
├── user-management/
│   ├── authentication.md
│   └── permissions.md
├── payments/
│   ├── stripe-integration.md
│   └── refunds.md
└── analytics/
    └── event-tracking.md
```

**Best for:** Large applications with well-defined business domains.

### Pattern 4: User-Level Rules

Create personal rules that apply to all your projects by placing them in `~/.claude/rules/`:

```
~/.claude/rules/
├── preferences.md    # Your personal coding style
├── workflows.md      # Your preferred git workflows
└── shortcuts.md      # Custom commands you like
```

**Priority:** User-level rules load first, then project rules. This means project rules can override your personal preferences when team standards differ.

**Use case:** You prefer 4-space indentation, but this specific project uses 2 spaces. Your user-level rule sets your default, but the project's rule overrides it for team consistency.

## Practical Examples

### Example 1: API Validation Rules

**File: `.claude/rules/api-validation.md`**

```markdown
---
paths: src/api/**/*.ts
---

# API Endpoint Requirements

Every API endpoint must:

1. **Input Validation**
   ```typescript
   import { z } from 'zod';

   const CreateUserSchema = z.object({
     email: z.string().email(),
     name: z.string().min(2),
   });
   ```

2. **Error Handling**
   - Use `ApiError` from `src/api/errors.ts`
   - Return proper HTTP status codes
   - Include error codes for client-side handling

3. **Documentation**
   ```typescript
   /**
    * @route POST /api/users
    * @description Create a new user
    * @body CreateUserSchema
    * @returns User
    */
   ```
```

### Example 2: React Component Standards

**File: `.claude/rules/frontend/react-components.md`**

```markdown
---
paths: src/components/**/*.tsx
---

# React Component Guidelines

## Structure

```typescript
// 1. Imports (external, then internal)
import { useState } from 'react';
import { Button } from '@/components/ui';

// 2. Types/interfaces
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

// 3. Component
export function UserCard({ user, onEdit }: UserCardProps) {
  // hooks first
  const [isEditing, setIsEditing] = useState(false);

  // event handlers
  const handleEdit = () => onEdit(user.id);

  // render
  return (/* JSX */);
}
```

## Rules

- Use named exports (not default)
- Props interfaces must end with "Props"
- Extract complex logic to custom hooks
- Use Tailwind CSS (no inline styles)
```

### Example 3: Test Conventions

**File: `.claude/rules/testing.md`**

```markdown
---
paths: **/*.test.ts, **/*.test.tsx
---

# Testing Requirements

## Structure

```typescript
describe('ComponentName or functionName', () => {
  describe('scenario or method', () => {
    it('should behave in expected way', () => {
      // Arrange: Set up test data
      const input = { /* ... */ };

      // Act: Execute the code under test
      const result = functionUnderTest(input);

      // Assert: Verify the outcome
      expect(result).toBe(expected);
    });
  });
});
```

## Coverage Requirements

- All API endpoints: 100% coverage
- Business logic functions: 90% coverage
- UI components: Focus on behavior, not implementation

## What to Test

- **Do test**: Public APIs, edge cases, error paths
- **Don't test**: Implementation details, third-party libraries
```

### Example 4: Security Guidelines

**File: `.claude/rules/security.md`**

```markdown
# Security Requirements

Apply these rules across the entire codebase:

## Input Validation

- Validate all user input server-side (never trust client-side validation alone)
- Use type-safe validation libraries (Zod, Yup)
- Sanitize data before database queries

## Authentication

- Never store passwords in plain text (use bcrypt)
- Implement rate limiting on auth endpoints
- Use HTTP-only cookies for session tokens

## Secrets Management

- Never commit secrets to version control
- Use environment variables for API keys
- Rotate secrets regularly

## Database

- Use parameterized queries (never string concatenation)
- Implement row-level security where possible
- Encrypt sensitive data at rest
```

## Memory System Comparison

Claude Code has multiple memory systems with different scopes and priorities:

| Feature | Location | Scope | Priority | Version Control | Use Case |
|---------|----------|-------|----------|-----------------|----------|
| **Enterprise Policy** | System-level | All users in organization | Highest | Managed by IT | Company-wide security policies, compliance requirements |
| **Project Memory** | `.claude/CLAUDE.md` | All team members | High | Yes (via git) | Project architecture, high-level standards |
| **Project Rules** | `.claude/rules/*.md` | All team members | High (same as CLAUDE.md) | Yes (via git) | Modular, topic-specific team guidelines |
| **User Memory** | `~/.claude/CLAUDE.md` | Single user (all projects) | Medium | No (local only) | Personal coding preferences |
| **User Rules** | `~/.claude/rules/*.md` | Single user (all projects) | Medium | No (local only) | Personal workflow preferences |
| **Local Memory** | `.claude/CLAUDE.local.md` | Single user (current project) | Low | No (typically .gitignored) | Private notes, local overrides |

**Key takeaway:** `.claude/rules/` has the same priority as `.claude/CLAUDE.md` - they're both team-level project memory, just organized differently.

## Best Practices

### 1. Keep Rules Focused

**Good:** `testing.md` covers test structure, coverage requirements, and what to test.

**Bad:** `testing.md` also includes deployment procedures, database migrations, and API design principles.

**Why:** Focused files are easier to navigate, maintain, and reason about. If you're updating testing guidelines, you shouldn't have to scroll past unrelated content.

### 2. Use Descriptive Filenames

**Good:**
- `react-component-patterns.md`
- `api-error-handling.md`
- `database-migrations.md`

**Bad:**
- `rules1.md`
- `stuff.md`
- `frontend.md` (too vague)

**Why:** Filenames should tell you exactly what's inside without opening the file.

### 3. Use Conditional Rules Sparingly

**Good:** Use `paths` for rules that truly only apply to specific file types (API validation for API files, React patterns for components).

**Bad:** Create path-specific rules for every possible file type, even when the rules apply broadly.

**Why:** Unconditional rules are simpler and reduce mental overhead. Only add path restrictions when rules genuinely don't apply elsewhere.

### 4. Organize with Subdirectories

For large projects, group related rules:

```
.claude/rules/
├── frontend/         # All frontend-related rules
│   ├── react.md
│   ├── styling.md
│   └── state.md
├── backend/          # All backend-related rules
│   ├── api.md
│   └── database.md
└── shared/           # Rules that apply to both
    ├── typescript.md
    └── testing.md
```

**Why:** Subdirectories prevent the rules directory from becoming its own monolithic mess.

### 5. Share Common Rules with Symlinks

If you have standards that apply across multiple projects, maintain them in one place and symlink:

```bash
# Create shared rules repository
mkdir ~/shared-claude-rules
echo "# TypeScript Standards" > ~/shared-claude-rules/typescript.md

# Link from projects
cd ~/project-a/.claude/rules
ln -s ~/shared-claude-rules/typescript.md typescript.md

cd ~/project-b/.claude/rules
ln -s ~/shared-claude-rules/typescript.md typescript.md
```

**Why:** One source of truth for common standards. Update once, applies everywhere.

### 6. Version Control Your Rules

Commit `.claude/rules/` to git alongside your code:

```bash
git add .claude/rules/
git commit -m "Add API validation rules"
```

**Why:** Team members get the same instructions. Rules evolve with the codebase. New contributors see current standards.

## Getting Started: Migrating from CLAUDE.md

If you already have a CLAUDE.md file, here's how to migrate:

### Step 1: Create the Directory

```bash
mkdir -p .claude/rules
```

### Step 2: Identify Topics

Read through your CLAUDE.md and identify distinct topics. Common ones:
- Code style and formatting
- Testing conventions
- API design
- Security guidelines
- Database patterns
- Deployment procedures

### Step 3: Extract to Files

For each topic, create a new file in `.claude/rules/`:

```bash
# Extract testing section
# Copy relevant content from CLAUDE.md
echo "# Testing Conventions" > .claude/rules/testing.md
# Add the testing-related content

# Extract API guidelines
echo "# API Design Standards" > .claude/rules/api-design.md
# Add the API-related content
```

### Step 4: Add Path Restrictions (Optional)

For rules that only apply to specific files, add YAML frontmatter:

```markdown
---
paths: src/api/**/*.ts
---

# API Design Standards
(your content here)
```

### Step 5: Simplify CLAUDE.md

Remove the extracted content from CLAUDE.md, leaving only:
- High-level project overview
- Architecture decisions
- Links to external docs
- Anything that doesn't fit neatly into a topic

### Step 6: Test

Start a Claude Code session and verify that rules are being applied:

```bash
claude
```

Check that Claude follows guidelines from your rule files.

### Step 7: Commit

```bash
git add .claude/
git commit -m "Refactor CLAUDE.md into modular rules"
```

**Pro tip:** Don't feel pressure to migrate everything at once. You can keep CLAUDE.md for general content and gradually move specific topics to `.claude/rules/` as you refactor.

## When to Use This

**Use `.claude/rules/` when:**
- Your CLAUDE.md is over 200 lines
- You have distinct topics that could be separate files
- You want different rules for different file types
- Multiple team members maintain project instructions
- You need to share common rules across projects

**Stick with CLAUDE.md when:**
- Your project is small and simple
- All instructions fit comfortably in one file
- You don't need path-specific rules
- You're working solo and don't need modularity

There's no requirement to use `.claude/rules/` - it's an option for better organization when your project's instructions grow beyond what a single file can comfortably handle.

## What This Enables

`.claude/rules/` isn't just about splitting one file into many. It's about matching your project's instruction structure to how your team thinks about the codebase.

**Before:** "Where in this 500-line CLAUDE.md did we document the API validation rules?"

**After:** "Check `.claude/rules/api-validation.md`"

**Before:** Three people trying to update CLAUDE.md simultaneously → merge conflicts.

**After:** Three people updating three different rule files → no conflicts.

**Before:** "These rules are too specific to frontend, but backend engineers see them too."

**After:** Rules with `paths: src/frontend/**/*` only apply when working on frontend code.

The feature is simple - markdown files in a directory. But the impact is organizational: instructions that scale with your project, stay maintainable as your team grows, and apply intelligently based on what code you're actually working on.

---

**Resources:**
- [Official .claude/rules/ Documentation](https://code.claude.com/docs/en/memory)
- [Claude Code Memory System Overview](https://code.claude.com/docs/en/memory)
- [Claude Code v2.0.64 Changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
