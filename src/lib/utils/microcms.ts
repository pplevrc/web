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
 * MicroCMS が提供している Query Params の型
 */
export interface MicroCMSQueryParams<T extends MicroCMSContentBase> {
  fields?: (keyof T | Paths<FlattenArray<T>>)[];
  offset?: number;
  limit?: number;
  order?: keyof T;
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
  options: MicroCMSOptions<T> = {},
): Promise<T> {
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
 * @param options
 * @returns
 */
export async function fetchContents<T extends MicroCMSListContentBase>(
  endpoint: string,
  options: MicroCMSOptions<T> = {},
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
