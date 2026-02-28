---
trigger: always_on
description: Restrictions on importing files across specific directories.
globs: "**/*.{ts,tsx,astro,js,jsx}"
---

# Import Restrictions

- `src/*` and `scripts/*` MUST NOT reference each other.
