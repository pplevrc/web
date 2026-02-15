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