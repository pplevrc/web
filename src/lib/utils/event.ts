/**
 * Date オブジェクトを "YYYY/MM/DD" 形式の文字列に変換する
 */
function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd}`;
}

/**
 * イベントリダイレクトの設定
 * 今後、別の期間限定イベントページへリダイレクトさせたい場合は
 * ここに設定を追加することで対応できる
 */
export const EVENT_REDIRECTS = [
  {
    path: "/events/202604-april-fool/",
    storageKey: "aprilFool2026Redirected",
    targetDates: ["2026/04/01"],
    linkText: "ぷぷリィホームズ",
  },
] as const satisfies readonly EventRedirect[];

/**
 * イベント用特集ページへのリダイレクト設定
 */
export interface EventRedirect {
  /**
   * リダイレクト先のパス
   */
  path: string;

  /**
   * リダイレクト済みかどうかを判定するための localStorage のキー
   */
  storageKey: string;

  /**
   * リダイレクト対象となる日時
   */
  targetDates: readonly string[];

  /**
   * トップページに記載するリンクテキスト
   */
  linkText: string;
}

type StorageKey = (typeof EVENT_REDIRECTS)[number]["storageKey"];

/**
 * 指定された日時がリダイレクト対象かどうかを判定する
 * @param data
 * @returns
 */
export function findEvent(
  data: Date,
): (typeof EVENT_REDIRECTS)[number] | undefined {
  const formattedDate = formatDate(data);
  return EVENT_REDIRECTS.find((redirect) =>
    redirect.targetDates.some((date) => date === formattedDate),
  );
}

/**
 * リダイレクト済みかどうかを判定する
 * @param storageKey 保存する localStorage のキー
 * @returns リダイレクト済みかどうか
 */
function hasRedirected(storageKey: StorageKey): boolean {
  try {
    return localStorage.getItem(storageKey) === "true";
  } catch (_e) {
    return false;
  }
}

/**
 * リダイレクト済みフラグを立てる
 * @param storageKey 保存する localStorage のキー
 */
export function markRedirected(storageKey: StorageKey): void {
  try {
    localStorage.setItem(storageKey, "true");
  } catch (_e) {
    // localStorageが無効な環境などの場合は無視する
  }
}

/**
 * 現在の日時と設定に基づいて、該当するイベントページへ単発リダイレクトを行う
 * 一度でもリダイレクトした形跡が localStorage にある場合は何もしない
 */
export function executeEventRedirects() {
  const d = new Date();

  const event = findEvent(d);
  if (!event) {
    return;
  }

  const { path, storageKey } = event;
  if (hasRedirected(storageKey)) {
    return;
  }

  window.location.replace(path);
}
