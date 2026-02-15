---
trigger: glob
description: Rules for separating business logic from presentation.
globs: src/**/*.{ts,tsx,astro}
---

# Business Logic Separation

## Logic Extraction
- **Business logic MUST be extracted** from components (`.astro`, `.tsx`) into pure TypeScript (`.ts`) files/modules.
- Components should focus strictly on **presentation** (UI) and **wiring** (connecting data to UI).

## Implementation
- **Astro**: Do not write complex logic in the "Frontmatter" script. Import it from a helper or utility functions.
- **React**: Move complex `useEffect` logic or event handler logic to custom hooks or utility functions.
- **Testing**: This makes logic unit-testable without rendering components.

## Example
```ts
// 複雑な計算ロジックを別ファイルに抽出
export const calculateTotal = (items: Item[]) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};
```