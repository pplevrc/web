---
name: Refactoring Guide
description: Best practices and strategies for safe refactoring in this project.
---

# Refactoring Guide

## Mindset
- **Small Steps**: Make one change at a time.
- **Verify Often**: Run tests/build after each small change.
- **Don't Break Builds**: The app should be runnable at all times (except strictly during a file move/rename operation).

## Page Refactoring Strategy
1.  **Isolate**: Move the components first without changing logic.
2.  **Simplify**: Once moved, simplify the logic (e.g., flatten control flow).
3.  **Data Flow**: Finally, refactor the data flow to use props.

## Tools
- Use the `refactor_page` workflow for page-level refactors.
- Use `view_file` on `.agent/rules/*.md` to refresh on specific rules.
