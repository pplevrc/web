---
description: Rules for data flow and state management.
globs: "**/*.{tsx,astro}"
---

# Data Flow

## Strict Parent-to-Child (Prop Drilling)
- Data MUST flow from parent components to child components via Props.
- **Prop Drilling** is explicitly **allowed and preferred** over global state/context for explicit data dependencies.
- This creates clear data lineage and improves testability (easier to mock props than context/globals).

## Global State
- **Minimize usage.**
- Do NOT use global state (stores, context, cache) for page-local or component-local data.
- Global state is reserved for truly application-wide data, such as:
  - User Session / Authentication
  - Theme / UI Preferences
  - Shared Toast/Notification systems

## Example
```tsx
// 親から子へProps経由でデータを渡す
interface Props {
  user: User;
}
const UserProfile = ({ user }: Props) => {
  return <div>{user.name}</div>;
};
```