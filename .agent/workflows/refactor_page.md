---
description: Workflow for refactoring a page to the new architecture.
---

# Page Refactoring Workflow

This workflow guides you through refactoring a page entry point in `src/pages/` to adhere to the new architectural guidelines.

## Prerequisites
- Verify you have read the rules in `.agent/rules/`.

## Steps

1.  **Analyze Page Components**
    - Open the target page file in `src/pages/`.
    - identify all imported components.
    - Determine which components are **exclusive** to this page (or are variants used only here).

2.  **Create Page-Specific Directory**
    - Create a directory: `src/components/pages/<page-name>/`.
    - // turbo
    - Run: `mkdir -p src/components/pages/<page-name>/` (Replace `<page-name>` with the actual name).

3.  **Move Components**
    - Move identified exclusive components to `src/components/pages/<page-name>/`.
    - Update imports in the page file.
    - Update imports in the moved components if necessary.

4.  **Refactor Data Flow (Prop Drilling)**
    - Identify data fetching logic.
    - Move data fetching to the **highest level possible** (usually the page component or a container within it).
    - Pass data down to children via **Props**.
    - **Remove** any global state usage for page-local data.

5.  **Verify Changes**
    - Run: `yarn biome check` (Lint/Format).
    - Run: `yarn typecheck`.
    - Run: `yarn test` (if applicable).
    - Build locally to ensure no regressions: `yarn build`.
