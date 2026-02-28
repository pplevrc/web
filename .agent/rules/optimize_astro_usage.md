---
trigger: glob
description: Best practices for Astro usage.
globs: **/*.astro
---

# Astro Usage

## Client-Side JavaScript
- **Minimize usage.** Astro is Multi-Page App (MPA) first.
- Use `client:*` directives sparingly. Only for truly interactive islands.
- Prefer server-side rendering (SSR) or static generation (SSG) for content.

## Runtime JS
- If possible, implement logic in the "Frontmatter" script (server-side) rather than `<script>` tags (client-side).
- Reason: Performance and SEO.