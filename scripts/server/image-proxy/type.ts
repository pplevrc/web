/**
 * Astro Integration [Image Proxy] のオプション
 */
export interface ImageProxyOptions {
  /**
   * @default 3
   */
  retry?: number;

  /**
   * @default 30000
   */
  timeout?: number;
}

/**
 * Astro Integration [Image Proxy] のオプションを固定化したもの (内部利用用)
 */
export type FixedImageProxyOptions = Required<ImageProxyOptions>;

/**
 * デフォルトのリトライ回数
 */
const DEFAULT_RETRY = 3;

/**
 * デフォルトのタイムアウト時間
 */
const DEFAULT_TIMEOUT = 60000;

/**
 * デフォルトのオプション
 */
export const defaultOption = Object.freeze({
  retry: DEFAULT_RETRY,
  timeout: DEFAULT_TIMEOUT,
} satisfies Required<ImageProxyOptions>);

/**
 * 処理中に自明なエラーが発生している場合に投げるエラー.
 * レスポンスで 400 系のステータスを返すべきかどうかの判断として利用する.
 */
export class ClientError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ClientError";
  }
}
