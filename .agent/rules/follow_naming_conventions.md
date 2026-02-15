---
description: Naming conventions for consistency.
globs: "**/*.{ts,tsx,astro}"
---

# Naming Conventions

## Boolean Variables
- Use `is`, `has`, `should`, or `can` prefixes.
- **Good**: `isVisible`, `hasError`, `shouldRender`, `canSubmit`
- **Bad**: `visible`, `error`, `render`, `submit`

## Event Handlers
- **Props**: Use `on` prefix (e.g., `onClick`, `onSubmit`).
- **Handler Functions**: Use `handle` prefix (e.g., `handleClick`, `handleSubmit`).
- **Good**:
  ```tsx
  interface Props {
    // クリック時のハンドラ
    onClick: () => void;
  }
  const handleClick = () => { ... };
  return <button onClick={handleClick} />;
  ```

## Constants
- Use `UPPER_CASE` for global constants or configuration values.
- **Good**: `MAX_RETRY_COUNT`, `API_ENDPOINT`
- **Bad**: `maxRetryCount`, `apiEndpoint`

## Components
- Use PascalCase for component filenames and function names.
- **Good**: `UserProfile.tsx`, `const UserProfile = ...`
