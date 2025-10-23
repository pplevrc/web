/**
 * 絶対URLを生成する（JSON-LD のパンくずリストなどで使用）
 * @param path - パス（例: "/articles/"）
 * @param siteUrl - サイトのベースURL
 * @returns 絶対URL
 */
export function toAbsoluteUrl(path: string, siteUrl?: URL | string): string {
  if (!siteUrl) return path;
  return new URL(path, siteUrl).href;
}
