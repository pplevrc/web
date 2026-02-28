---
trigger: always_on
description: Guidelines for comments and documentation.
globs: "**/*.{ts,tsx,astro}"
---

# Comments & Documentation

## "Why" over "What"
- Comments should explain *why* something is done, not *what* the code is doing (unless it's complex/obscure).
- **Good**: `// アンマウント前にアニメーションを完了させるために遅延を追加`
- **Bad**: `// 300msのタイムアウトを設定`

## Language
- **Requirement**: All comments and documentation (including JSDoc) MUST be written in **Japanese**.
- **Reason**: The maintainers are Japanese.

## TSDoc & JSDoc
- **Requirement**: Public interfaces (especially Props) MUST have JSDoc comments.
- **Content**: Include a description and an `@example` where helpful.
- **Example**:
  ```ts
  /**
   * APIクライアントの設定オプション
   */
  interface ApiConfig {
    /**
     * API エンドポイント
     * @example 'https://example.com'
     */
    endpoint: string
  }
  ```