---
description: Rules for using semantic HTML.
globs: "**/*.{tsx,astro}"
---

# Use Semantic HTML

## Semantic Elements
- **Requirement**: Use semantic HTML elements whenever possible.
- **Avoid**: Excessive use of `div` and `span` when a more specific tag exists.

## Common Replacements
- **Clickable elements**: Use `<button>` or `<a>`, never `<div onClick={...}>`.
- **Lists**: Use `<ul>`/`ol` and `<li>`.
- **Headers**: Use `<header>`, `<nav>`, `<main>`, `<footer>` type regions.
- **Headings**: Ensure correct `h1` through `h6` hierarchy.

## Accessibility
- Semantic HTML provides native keyboard navigation and screen reader support.
- Semantic HTML provides native keyboard navigation and screen reader support.
- Ensure all interactive elements are focusable.

## Example
```astro
<!-- 悪い例: divをボタンとして使用 -->
<div onClick={handleClick}>ボタン</div>

<!-- 良い例: 正しいセマンティック要素を使用 -->
<button onClick={handleClick}>ボタン</button>
```
