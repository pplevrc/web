import { base, site } from "astro:config/client";

/**
 *
 */
export type Path =
  | "/"
  | "/articles/"
  | `/articles/${string}/`
  | "/casts/"
  | `/casts/${string}/`
  | "/guidelines/"
  | `/guidelines/${string}/`;

/**
 * ベースパスを考慮したURLを生成する
 * @param path - 相対パス（先頭の'/'は任意）
 * @returns ベースパスが考慮されたURL
 */
export function href(path: Path): string {
  if (!base || base === "/") {
    return path;
  }

  return `${base}${path}`;
}

/**
 * ホーム画面のパスなら true を返す
 * @param path
 * @returns
 */
export function isHome(path: string): boolean {
  const basePath = base ?? "/";

  return path === basePath;
}

/**
 * 絶対URLを生成する（JSON-LD のパンくずリストなどで使用）
 * @param path - パス（例: "/articles/"）
 * @param siteUrl - サイトのベースURL
 * @returns 絶対URL
 */
export function toAbsoluteUrl(path: string): string {
  if (!site) {
    throw new Error("サイトのベースURLが設定されていません");
  }

  return new URL(path, site).href;
}
