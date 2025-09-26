import { base } from "astro:config/client";

/**
 * ベースパスを考慮したURLを生成する
 * @param path - 相対パス（先頭の'/'は任意）
 * @returns ベースパスが考慮されたURL
 */
export function href(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // baseが未定義、空文字、または"/"の場合はそのまま返す
  if (!base || base === "/") {
    return normalizedPath;
  }

  return `${base}${normalizedPath}`;
}
