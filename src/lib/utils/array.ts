export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * 配列を降順にソートする（元の配列は変更しない）
 * @param array - ソート対象の配列
 * @param key - 各要素から比較用の数値を取り出す関数
 * @returns ソートされた新しい配列
 * @example
 * const articles = [{ publishedAt: "2024-01-01" }, { publishedAt: "2024-12-01" }];
 * sortByDesc(articles, (a) => new Date(a.publishedAt).getTime());
 * // => [{ publishedAt: "2024-12-01" }, { publishedAt: "2024-01-01" }]
 */
export function sortByDesc<T>(array: T[], key: (item: T) => number): T[] {
  return [...array].sort((a, b) => key(b) - key(a));
}

/**
 * 配列を昇順にソートする（元の配列は変更しない）
 * @param array - ソート対象の配列
 * @param key - 各要素から比較用の数値を取り出す関数
 * @returns ソートされた新しい配列
 * @example
 * const articles = [{ publishedAt: "2024-12-01" }, { publishedAt: "2024-01-01" }];
 * sortByAsc(articles, (a) => new Date(a.publishedAt).getTime());
 * // => [{ publishedAt: "2024-01-01" }, { publishedAt: "2024-12-01" }]
 */
export function sortByAsc<T>(array: T[], key: (item: T) => number): T[] {
  return [...array].sort((a, b) => key(a) - key(b));
}
