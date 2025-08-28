import type { ColorThemeBase } from "@lib/contents/commons/ColorToken";
import type { BallonPosition } from "@lib/contents/guildelines";
import { snakeCase } from "scule";
import type { Paths, PickDeep } from "type-fest";
import { CONTENTS_API_KEY, CONTENTS_SERVICE_ID } from "./env";

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
  contents: T[];
  totalCount: number;
  offset: number;
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
  "theme-color": ColorThemeBase;

  /**
   *
   */
  "ballon-position": BallonPosition;
}

/**
 *
 */
export interface MicroCMSArticle extends MicroCMSListContent {
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
  "hero-image-alt": string;

  /**
   *
   */
  "hero-iamge-label": string;

  /**
   *
   */
  "theme-color": ColorThemeBase;

  /**
   *
   */
  content: string;
}

/**
 *
 */
export interface MicroCMSGlobalMeta extends MicroCMSObjectContent {
  /**
   *
   */
  "guidelines-shortcut": MicroCMSGuideline;

  /**
   * comma-separated string
   */
  "common-keywords": string;

  /**
   *
   */
  "home-description": string;

  /**
   *
   */
  "guidelines-desc": string;

  /**
   *
   */
  "guidelines-heroimage": MicroCMSImage;

  /**
   * comma-separated string
   */
  "casts-keywords": string;

  /**
   *
   */
  "casts-heroimage": MicroCMSImage;

  /**
   *
   */
  "casts-description": string;

  /**
   *
   */
  "news-desc": string;

  /**
   * comma-separated string
   */
  "news-keywords": string;

  /**
   *
   */
  "news-heroimage": MicroCMSImage;
}

export type MicroCMSApis = {
  guidelines: {
    key: "guidelines";
    value: MicroCMSGuideline;
  };
  articles: {
    key: "articles";
    value: MicroCMSArticle;
  };
  meta: {
    key: "globalMeta";
    value: MicroCMSGlobalMeta;
  };
};

export type MicroCMSApiEndpoint = MicroCMSApis[keyof MicroCMSApis]["key"];

export type MicroCMSApiResponse<
  T extends MicroCMSApiEndpoint,
  Q extends MicroCMSQueryParams<MicroCMSApiResponseType<T>>,
  R extends MicroCMSApiResponseType<T> = MicroCMSApiResponseType<T>,
> = Q["fields"] extends undefined ? R : PickDeep<R, Q["fields"] & Paths<R>>;

type MicroCMSApiResponseType<T extends MicroCMSApiEndpoint> = {
  [K in keyof MicroCMSApis]: T extends MicroCMSApis[K]["key"]
    ? MicroCMSApis[K]["value"]
    : never;
}[keyof MicroCMSApis];

export interface MicroCMSQueryParams<T extends MicroCMSContentCommon> {
  fields?: (keyof T | Paths<T>)[];
  offset?: number;
  limit?: number;
  order?: keyof T;
}

export interface MicroCMSFilters<T extends MicroCMSListContent> {
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

export interface MicroCMSOptions<
  T extends MicroCMSListContent,
  Q extends MicroCMSQueryParams<T> = MicroCMSQueryParams<T>,
> {
  query?: Q;
  filters?: MicroCMSFilters<T>[];
}

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

function createMicroCMSHeaders(): Record<string, string> {
  if (!CONTENTS_API_KEY) {
    throw new Error("CONTENTS_API_KEY not configured");
  }

  return {
    "X-MICROCMS-API-KEY": CONTENTS_API_KEY,
    // "Content-Type": "application/json",
  };
}

export async function fetchContents<
  E extends MicroCMSApiEndpoint,
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

export async function fetchContent<
  E extends MicroCMSApiEndpoint,
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
