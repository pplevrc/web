---
description: Rules for control flow to improve readability.
globs: "**/*.{ts,tsx,astro}"
---

# Control Flow

## Early Returns (Guard Clauses)
- Prefer early returns over deep `else-if` nesting.
- **Good**:
  ```ts
  if (!user) return;
  if (!user.isActive) return;
  // ... 処理を続行
  ```
- **Bad**:
  ```ts
  if (user) {
    if (user.isActive) {
      // ... 処理
    }
  }
  ```

## Nesting Depth
- Avoid nesting deeper than 2 levels if possible.
- Extract logic into helper functions or components if nesting becomes too deep.
