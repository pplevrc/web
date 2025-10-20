import { createHash } from "node:crypto";
import type { AstroIntegrationLogger } from "astro";
import { bypass, HttpResponse, type HttpResponseResolver, http } from "msw";
import { type SetupServerApi, setupServer } from "msw/node";
import { ClientError, type FixedImageProxyOptions } from "./type.js";

/**
 * ETag を生成する
 * @param url
 * @param buffer
 * @returns
 */
function generateETag(url: string): string {
  return createHash("md5").update(url).digest("hex");
}

/**
 * リトライ対象のエラー
 */
const RETRY_ERRORS = Object.freeze([
  "fetch failed",
  "The operation was aborted due to timeout",
]);

/**
 * オブジェクトから nullish なキーを削除する
 * @param record
 * @returns
 */
function removeNullishKey<T>(
  record: Record<string, T | undefined>,
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(record).filter(([_, value]) => value !== undefined),
  ) as Record<string, T>;
}

/**
 * 1年後の日時を UTC 文字列で取得する
 * @returns
 */
function getOneYearLater(): string {
  return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
}

/**
 * Cache-Control がキャッシュを無効化しているかどうかを判定する
 * @param cacheControl
 * @returns
 */
function isCacheDisabled(cacheControl: string | undefined): boolean {
  if (!cacheControl) return true;

  // max-age=0, no-cache, no-store などキャッシュ無効化を検出
  return (
    cacheControl.includes("max-age=0") ||
    cacheControl.includes("no-cache") ||
    cacheControl.includes("no-store")
  );
}

/**
 * レスポンスヘッダーにパッチを適用する
 * @param headers 元のヘッダー
 * @param url リクエストURL
 * @returns パッチ適用後のヘッダー
 */
function patchHeaders(
  headers: Record<string, string>,
  url: string,
): Record<string, string> {
  return removeNullishKey({
    ...headers,

    // PATCH: fix disabled Cache-Control
    // NOTE: Cache-Control がない、またはキャッシュが無効化されている場合にキャッシュを有効化する
    "cache-control": isCacheDisabled(headers["cache-control"])
      ? "public, max-age=31536000, immutable"
      : headers["cache-control"],

    // PATCH: add ETag if not exists
    // NOTE: astro では ETag が存在しない場合にキャッシュを利用しない. Contents 側の API では ResponseHeader に ETag が存在しない場合がある.
    etag: headers["etag"] ?? generateETag(url),

    // PATCH: set expires to 1 year later
    // NOTE: astro では expires が Date.now よりも大きい場合にキャッシュを利用する. Contents 側の API ではリクエストした時点の日時が expires にセットされる場合がある.
    expires: getOneYearLater(),
  });
}

/**
 * レスポンスが画像かどうかを判定する
 * @param response
 * @returns
 */
function isImageResponse(response: Response): boolean {
  const contentType = response.headers.get("content-type") ?? "";
  return contentType.startsWith("image/");
}

/**
 * fetch で自動展開されたレスポンスを返す
 * Content-Encoding ヘッダーを削除して二重展開を防ぐ
 * @param response
 * @param raw
 * @returns
 */
function asPassthroughResponse(response: Response, raw: Buffer): HttpResponse {
  const headers = Object.fromEntries(response.headers.entries());

  // PATCH: Content-Encoding ヘッダーを削除して二重展開を防ぐ
  // 理由:
  // 1. fetch() は gzip/deflate されたレスポンスを自動的に展開する
  // 2. response.arrayBuffer() で取得した時点でデータは既に展開済み
  // 3. Content-Encoding: gzip ヘッダーがそのまま残っていると、
  //    クライアント側の fetch が「圧縮されている」と判断してしまう
  // 4. 既に展開済みのデータを gzip として展開しようとして Zlib エラーが発生する
  //    (エラー: "incorrect header check")
  //
  // Content-Encoding ヘッダーを削除することで、レスポンスボディが
  // 圧縮されていないことをクライアントに伝え、不要な展開処理を防ぐ。
  delete headers["content-encoding"];

  return new HttpResponse(raw, {
    status: response.status,
    headers: headers,
  });
}

/**
 * 画像レスポンスとして返す（キャッシュヘッダーをパッチ）
 * @param response
 * @param raw
 * @param url
 * @returns
 */
function asImageResponse(
  response: Response,
  raw: Buffer,
  url: string,
): HttpResponse {
  const headers = Object.fromEntries(response.headers.entries());
  const fixedHeaders = patchHeaders(headers, url);

  // PATCH: Content-Encoding ヘッダーを削除して二重展開を防ぐ（画像の場合も同様）
  delete fixedHeaders["content-encoding"];

  return new HttpResponse(raw, {
    status: 200,
    headers: fixedHeaders,
  });
}

/**
 * リクエストを処理する
 * @param option
 * @param logger
 * @returns
 */
async function createHandleRequest(
  { timeout, retry }: FixedImageProxyOptions,
  logger: AstroIntegrationLogger,
): Promise<HttpResponseResolver> {
  return async ({ request }) => {
    try {
      const { url } = request;
      if (!url) {
        // Bypass
        return;
      }

      const response = await (async () => {
        const errors: unknown[] = [];
        for (let i = 0; i < retry; i++) {
          try {
            // NOTE: MSW の bypass 関数は, この関数の外で呼び出すとなぜか bypass されない問題あり.
            return await fetch(bypass(request), {
              signal: AbortSignal.timeout(timeout),
            });
          } catch (error) {
            if (
              error instanceof Error &&
              RETRY_ERRORS.includes(error.message)
            ) {
              errors.push(error);
              continue;
            }
            throw error;
          }
        }

        throw new AggregateError(errors, `Fetch failed after ${retry} retries`);
      })();

      const raw = Buffer.from(await response.arrayBuffer());

      // Content-Type が画像の場合のみキャッシュヘッダーをパッチ
      // それ以外（JSON, HTML等）はそのまま返す
      if (isImageResponse(response)) {
        return asImageResponse(response, raw, url);
      }

      return asPassthroughResponse(response, raw);
    } catch (error) {
      if (error instanceof ClientError) {
        logger.error(`Client error: ${error.message}`);
        return new HttpResponse(error.message, {
          status: error.statusCode,
          headers: { "Content-Type": "text/plain" },
        });
      }

      logger.error(
        `Unknown error: ${error instanceof Error ? error.message : error}`,
      );
      if (error instanceof Error && "cause" in error) {
        logger.error(`Cause: ${error.cause}`);
      }
      return new HttpResponse(
        error instanceof Error ? error.message : "Unknown error",
        {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        },
      );
    }
  };
}

/**
 * 画像レスポンスにパッチするために MSW のサーバーを作成し, Astro のビルド中のリクエストをインターセプトする
 * @param option
 * @param loggerr
 * @returns
 */
export async function createImageProxyServer(
  option: FixedImageProxyOptions,
  logger: AstroIntegrationLogger,
): Promise<SetupServerApi> {
  const server = setupServer(
    http.get("https://*", await createHandleRequest(option, logger)),
  );

  server.events.on("unhandledException", (error) => {
    logger.error(`Unhandled exception: ${error}`);
  });

  server.listen({ onUnhandledRequest: "bypass" });

  return server;
}
