---
trigger: always_on
description: Standard structure for Astro components.
globs: "**/*.astro"
---

# Component Structure

## Page-Specific Components
- Components used **only** by a single page (or its variants) MUST be located in `src/components/pages/<page-name>/`.
- Even if a component seems generic (e.g., `Button`), if it has a variant/style specific to one page, that variant or wrapper should live in the page-specific directory.
- **Reusable Domain Components**: If a reusable domain-specific component changes its appearance significantly based on a `type` prop (excluding minor changes like icons), and that specific appearance/type is used ONLY on a particular page, it MUST be separated into a page-specific component.

## Component Size
- Keep components small and focused.
- Break down large components into smaller sub-components, especially if they exceed ~300 lines.

## Generic Components
- Reusable or domain-specific components that are not tied to a single page MUST be located directly under `src/components/`, grouped by domain (e.g., `src/components/domain-name/`).

## Page Entry Point
- **Routing & Data (`src/pages/`)**:
    - Responsible for **Layout**, **Metadata**, **Data Fetching**, and **Routing**.
    - MUST invoke the UI Entry Point component and pass necessary data as props.
- **UI Entry Point (`src/components/pages/<page-name>/index.astro`)**:
    - Responsible for the visual structure of the page.
    - MUST be a pure component that receives data via Props.
    - SHOULD NOT contain `Layout` or global metadata logic.