import type { AstroIntegrationLogger } from "astro";
import { snakeCase } from "scule";
import type { Paths } from "type-fest";
import { CONTENTS_API_KEY, CONTENTS_SERVICE_ID } from "./env";

type Purify<T> = { [K in keyof T]: T[K] };

type FlattenArray<T> = Purify<{
  [K in keyof T]: T[K] extends Array<infer U> ? U : T[K];
}>;

/**
 *
 * @param endpoint
 * @returns
 */
function createURL(endpoint: string): URL {
  const baseUrl = `https://${CONTENTS_SERVICE_ID}.microcms.io`;
  const ep = `/api/v1/${endpoint}`;

  return new URL(ep, baseUrl);
}

/**
 *
 */
export interface MicroCMSListResponse<T extends MicroCMSListContentBase> {
  /**
   *
   */
  contents: T[];
  /**
   *
   */
  totalCount: number;
  /**
   *
   */
  offset: number;
  /**
   *
   */
  limit: number;
}

/**
 *
 */
interface MicroCMSContentBase {
  /**
   *
   */

  createdAt: string;

  /**
   *
   */
  updatedAt: string;

  /**
   *
   */
  publishedAt: string;

  /**
   *
   */
  revisedAt: string;
}

/**
 *
 */
export interface MicroCMSObjectContentBase extends MicroCMSContentBase {}

/**
 *
 */
export interface MicroCMSListContentBase extends MicroCMSContentBase {
  /**
   *
   */
  id: string;
}

export interface MicroCMSImage {
  /**
   *
   */
  url: string;

  /**
   *
   */
  height: number;

  /**
   *
   */
  width: number;
}

/**
 * 単一の値または配列を表す型
 */
type SingleOrArray<T> = T | T[];

/**
 * MicroCMS のフィールド名を表す型（トップレベルのキーまたはネストされたパス）
 */
type FieldPath<T extends MicroCMSContentBase> = (
  | keyof T
  | Paths<FlattenArray<T>>
) &
  string;

/**
 * MicroCMS の orders パラメータで使用する文字列型
 * 昇順の場合はそのまま、降順の場合は `-` プレフィックスをつける
 * @example "publishedAt" | "-publishedAt"
 */
type OrderStr<K extends string> = K | `-${K}`;

/**
 * MicroCMS が提供している Query Params の型
 */
export interface MicroCMSQueryParams<T extends MicroCMSContentBase> {
  /**
   * 取得するフィールドを指定
   */
  fields?: FieldPath<T>[];
  /**
   * 取得開始位置のオフセット
   */
  offset?: number;
  /**
   * 取得件数の上限
   */
  limit?: number;
  /**
   * ソート順を指定。昇順の場合はフィールド名、降順の場合は `-` プレフィックスをつける
   * 複数指定する場合は配列で渡す
   * @example "publishedAt" | "-publishedAt" | ["-publishedAt", "createdAt"]
   */
  orders?: SingleOrArray<OrderStr<FieldPath<T>>>;
}

/**
 * MicroCMS の QueryParams の filter を作るためのソース
 */
export interface MicroCMSFilters<T extends MicroCMSContentBase> {
  target: Paths<T>;
  operator:
    | "equals"
    | "notEquals"
    | "contains"
    | "notContains"
    | "greaterThan"
    | "lessThan"
    | "exists"
    | "notExists"
    | "beginsWith";
  value?: string;
}

/**
 * MicroCMS の get request 時に付与する Query Params を構築するソース
 */
export interface MicroCMSOptions<
  T extends MicroCMSContentBase = MicroCMSContentBase,
> {
  query?: MicroCMSQueryParams<T>;
  filters?: MicroCMSFilters<T>[];
  logger: AstroIntegrationLogger;
}

/**
 *
 * @param endpoint
 * @param param1
 * @returns
 */
function createMicroCMSUrl<T extends MicroCMSContentBase>(
  endpoint: string,
  { query, filters }: MicroCMSOptions<T>,
): URL {
  const url = createURL(endpoint);

  if (query) {
    if (query.fields) {
      url.searchParams.append("fields", query.fields.join(","));
    }
    if (query.limit) {
      url.searchParams.append("limit", query.limit.toString());
    }
    if (query.orders) {
      const ordersStr = Array.isArray(query.orders)
        ? query.orders.join(",")
        : query.orders;
      url.searchParams.append("orders", ordersStr);
    }
  }

  if (filters) {
    const filterStrings: string[] = [];
    for (const filter of filters) {
      filterStrings.push(
        `${String(filter.target)}[${snakeCase(filter.operator)}]${filter.value}`,
      );
    }
    url.searchParams.append("filters", filterStrings.join("[and]"));
  }

  return url;
}

/**
 *
 * @returns
 */
function createMicroCMSHeaders(): Record<string, string> {
  if (!CONTENTS_API_KEY) {
    throw new Error("CONTENTS_API_KEY not configured");
  }

  return {
    "X-MICROCMS-API-KEY": CONTENTS_API_KEY,
  };
}

/**
 *
 * @param endpoint
 * @param options
 * @returns
 */
export async function fetchObject<T extends MicroCMSObjectContentBase>(
  endpoint: string,
  options: MicroCMSOptions<T>,
): Promise<T> {
  const { logger } = options;
  const url = createMicroCMSUrl(endpoint, options);
  const headers = createMicroCMSHeaders();

  const maxRetries = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.info(
        `Fetching object from MicroCMS: ${endpoint} (attempt ${attempt}/${maxRetries})`,
      );
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(
          `MicroCMS API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      logger.info(`Successfully fetched object from MicroCMS: ${endpoint}`);
      return data;
    } catch (error) {
      lastError = error;
      const isZlibError =
        error instanceof Error &&
        (error.message.includes("incorrect header check") ||
          error.message.includes("Zlib"));

      if (isZlibError && attempt < maxRetries) {
        logger.warn(
          `Zlib error on attempt ${attempt}, retrying... (${endpoint})`,
        );
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        continue;
      }

      logger.error(
        `Error fetching object from MicroCMS (${endpoint}): ${error}`,
      );
      throw error;
    }
  }

  throw lastError;
}

/**
 *
 * @param endpoint
 * @param options
 * @returns
 */
export async function fetchContents<T extends MicroCMSListContentBase>(
  endpoint: string,
  options: MicroCMSOptions<T>,
): Promise<MicroCMSListResponse<T>> {
  const { logger } = options;
  const url = createMicroCMSUrl(endpoint, options);
  const headers = createMicroCMSHeaders();

  const maxRetries = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.info(
        `Fetching contents from MicroCMS: ${endpoint} (attempt ${attempt}/${maxRetries})`,
      );
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(
          `MicroCMS API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      logger.info(`Successfully fetched contents from MicroCMS: ${endpoint}`);
      return data;
    } catch (error) {
      lastError = error;
      const isZlibError =
        error instanceof Error &&
        (error.message.includes("incorrect header check") ||
          error.message.includes("Zlib"));

      if (isZlibError && attempt < maxRetries) {
        logger.warn(
          `Zlib error on attempt ${attempt}, retrying... (${endpoint})`,
        );
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        continue;
      }

      logger.error(
        `Error fetching contents from MicroCMS (${endpoint}): ${error}`,
      );
      throw error;
    }
  }

  throw lastError;
}
