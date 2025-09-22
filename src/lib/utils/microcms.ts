import type { ColorThemeBase } from "@lib/contents/commons/ColorToken";
import type { BallonPosition } from "@lib/contents/guildelines";
import { snakeCase } from "scule";
import type { Paths, PickDeep, UnionToIntersection } from "type-fest";
import { CONTENTS_API_KEY, CONTENTS_SERVICE_ID } from "./env";

type Purify<T> = { [K in keyof T]: T[K] };

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
export interface MicroCMSListResponse<T extends MicroCMSListContent> {
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
interface MicroCMSContentCommon {
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
export interface MicroCMSObjectContent extends MicroCMSContentCommon {}

/**
 *
 */
export interface MicroCMSListContent extends MicroCMSContentCommon {
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
 *
 */
export interface MicroCMSGuideline extends MicroCMSListContent {
  /**
   *
   */
  title: string;

  /**
   * comma-separated string
   */
  keywords?: string;

  /**
   *
   */
  description: string;

  /**
   *
   */
  "hero-image": MicroCMSImage;

  /**
   *
   */
  contents: string;

  /**
   *
   */
  "theme-color": ColorThemeBase[];

  /**
   *
   */
  "ballon-position": BallonPosition;
}

interface MicroCMSPageMeta {
  /**
   *
   */
  title: string;

  /**
   *
   */
  backLinkLabel: string;

  /**
   *
   */
  description: string;

  /**
   * comma-separated string
   */
  keywords: string;

  /**
   *
   */
  "hero-image": MicroCMSImage;
}

interface MicroCMSContentPageMeta {
  /**
   *
   */
  title: string;

  /**
   *
   */
  description: string;

  /**
   *
   */
  keywords: string;
}

/**
 *
 */
interface MicroCMSSocialLink {
  /**
   *
   */
  url: string;

  /**
   *
   */
  description: string;
}

/**
 *
 */
export interface MicroCMSMeta extends MicroCMSObjectContent {
  /**
   *
   */
  "guidelines-shortcut": MicroCMSGuideline[];

  /**
   * comma-separated string
   */
  "common-keywords": string;

  /**
   *
   */
  copyright: string;

  /**
   *
   */
  home: MicroCMSPageMeta;

  /**
   * replace `{nickname}` to cast's nickname
   */
  cast: MicroCMSContentPageMeta;

  /**
   *
   */
  casts: MicroCMSPageMeta;

  /**
   *
   */
  article: MicroCMSContentPageMeta;

  /**
   *
   */
  articles: MicroCMSPageMeta;

  /**
   *
   */
  guideline: MicroCMSContentPageMeta;

  /**
   *
   */
  guidelines: MicroCMSPageMeta;

  /**
   *
   */
  "social-links": MicroCMSSocialLink[];
}

/**
 * MicroCMS のエンドポイントの定義
 */
export type MicroCMSApis = {
  guidelines: {
    key: "guidelines";
    contents: MicroCMSGuideline;
  };
  meta: {
    key: "meta";
    value: MicroCMSMeta;
  };
};

/**
 * contents があるやつだけピックアップ
 * MicroCMS で List API として定義されているエンドポイント
 */
type MicroCMSContentsApis = Purify<
  UnionToIntersection<
    {
      [K in keyof MicroCMSApis]: MicroCMSApis[K] extends { contents: infer T }
        ? { [_ in K]: T }
        : never;
    }[keyof MicroCMSApis]
  >
>;

/**
 * value があるやつだけピックアップ
 * MicroCMS で JSON Object API として定義されているエンドポイント
 */
type MicroCMSObjectApis = Purify<
  UnionToIntersection<
    {
      [K in keyof MicroCMSApis]: MicroCMSApis[K] extends { value: infer T }
        ? { [_ in K]: T }
        : never;
    }[keyof MicroCMSApis]
  >
>;

/**
 * エンドポイント名
 */
export type MicroCMSApiEndpoint = MicroCMSApis[keyof MicroCMSApis]["key"];

/**
 * List API のエンドポイント名
 */
export type MicroCMSContentsEndpoint = keyof MicroCMSContentsApis;

/**
 * JSON Object API のエンドポイント名
 */
export type MicroCMSObjectEndpoint = keyof MicroCMSObjectApis;

/**
 * 実際のレスポンスの型
 */
export type MicroCMSApiResponse<
  T extends MicroCMSApiEndpoint,
  Q extends MicroCMSQueryParams<MicroCMSApiResponseType<T>>,
  R extends MicroCMSApiResponseType<T> = MicroCMSApiResponseType<T>,
> = Q["fields"] extends undefined ? R : PickDeep<R, Q["fields"] & Paths<R>>;

/**
 * エンドポイントに対応するレスポンスの型
 */
type MicroCMSApiResponseType<T extends MicroCMSApiEndpoint> = {
  [K in keyof MicroCMSApis]: T extends MicroCMSApis[K]["key"]
    ? MicroCMSApis[K] extends { contents: infer T }
      ? T
      : MicroCMSApis[K] extends { value: infer T }
        ? T
        : never
    : never;
}[keyof MicroCMSApis];

type FlattenArray<T> = Purify<{
  [K in keyof T]: T[K] extends Array<infer U> ? U : T[K];
}>;

/**
 * MicroCMS が提供している Query Params の型
 */
export interface MicroCMSQueryParams<T extends MicroCMSContentCommon> {
  fields?: (keyof T | Paths<FlattenArray<T>>)[];
  offset?: number;
  limit?: number;
  order?: keyof T;
}

/**
 * MicroCMS の QueryParams の filter を作るためのソース
 */
export interface MicroCMSFilters<T extends MicroCMSContentCommon> {
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
  T extends MicroCMSContentCommon,
  Q extends MicroCMSQueryParams<T> = MicroCMSQueryParams<T>,
> {
  query?: Q;
  filters?: MicroCMSFilters<T>[];
}

/**
 *
 * @param endpoint
 * @param param1
 * @returns
 */
function createMicroCMSUrl<T extends MicroCMSListContent>(
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
    // "Content-Type": "application/json",
  };
}

/**
 *
 * @param endpoint
 * @param options
 * @returns
 */
export async function fetchObject<
  E extends MicroCMSObjectEndpoint,
  Q extends MicroCMSQueryParams<T>,
  T extends MicroCMSApiResponseType<E> & MicroCMSObjectContent,
>(endpoint: E, options: MicroCMSOptions<T, Q> = {}): Promise<T> {
  // biome-ignore lint/suspicious/noExplicitAny: しんどいので回避
  const url = createMicroCMSUrl(endpoint, options as any);
  const headers = createMicroCMSHeaders();

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(
      `MicroCMS API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export async function fetchContents<
  E extends MicroCMSContentsEndpoint,
  Q extends MicroCMSQueryParams<T>,
  T extends MicroCMSApiResponseType<E> & MicroCMSListContent,
>(
  endpoint: E,
  options?: MicroCMSOptions<T, Q>,
): Promise<MicroCMSListResponse<T>>;

export async function fetchContents<T extends MicroCMSListContent>(
  endpoint: string,
  options?: MicroCMSOptions<T>,
): Promise<MicroCMSListResponse<T>>;

/**
 *
 * @param endpoint
 * @param options
 * @returns
 */
export async function fetchContents<
  E extends MicroCMSContentsEndpoint,
  Q extends MicroCMSQueryParams<T>,
  T extends MicroCMSApiResponseType<E> & MicroCMSListContent,
>(
  endpoint: E,
  options: MicroCMSOptions<T, Q> = {},
): Promise<MicroCMSListResponse<T>> {
  const url = createMicroCMSUrl(endpoint, options);
  const headers = createMicroCMSHeaders();

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(
      `MicroCMS API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

/**
 *
 * @param endpoint
 * @param id
 * @param options
 * @returns
 */
export async function fetchContent<
  E extends MicroCMSContentsEndpoint,
  Q extends MicroCMSQueryParams<T>,
  T extends MicroCMSApiResponseType<E> & MicroCMSListContent,
>(endpoint: E, id: string, options: MicroCMSOptions<T, Q> = {}): Promise<T> {
  const url = createMicroCMSUrl(`${endpoint}/${id}`, options);
  const headers = createMicroCMSHeaders();

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(
      `MicroCMS API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}
