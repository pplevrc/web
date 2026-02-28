---
description: Strict rules for TypeScript usage.
globs: "**/*.{ts,tsx,astro}"
---

# Avoid Any Types

## No Explicit or Implicit `any`
- **Strictly Forbidden**: usage of `any`.
- **Reason**: `any` defeats the purpose of TypeScript and leads to runtime errors.
- **Solution**: Use `unknown` with type narrowing if the type is truly uncertain, or define a proper interface/type.

## Explicit Props Interfaces
- **Requirement**: All components MUST have an explicitly defined `Props` interface.
- **Location**: Define the interface directly above the component function.
- **Bad**:
  ```tsx
  const MyComponent = ({ name }: { name: string }) => ...
  ```
- **Good**:
  ```tsx
  /**
   * MyComponent の Props
   */
  interface Props {
    /** 表示する名前 */
    name: string;
  }
  const MyComponent = ({ name }: Props) => ...
  ```
