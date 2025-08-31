/**
 * 文字列の表示幅をカウントする
 * 全角文字は2、半角文字は1としてカウント
 *
 * @param text カウント対象の文字列
 * @returns 文字列の表示幅
 */
export function countDisplayWidth(text: string): number {
  return Array.from(text).reduce((acc, char) => {
    return acc + (char.match(/[\u0020-\u007E\uFF61-\uFF9F]/) ? 1 : 2);
  }, 0);
}

// biome-ignore lint/suspicious/noExplicitAny: どのオブジェクトにも適合させる目的
type AnyObject = Record<string, any>;

/**
 *
 * @param text
 * @param map
 * @returns
 */
export function replaceByMap(text: string, map: AnyObject): string {
  return Object.entries(map)
    .filter(([_, value]) => typeof value === "string")
    .reduce((acc, [key, value]) => {
      return acc.replaceAll(`{${key}}`, value);
    }, text);
}
