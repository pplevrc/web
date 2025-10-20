import type { ColorThemeBase } from "@content/commons";
import {
  fetchContents,
  type MicroCMSFilters,
  type MicroCMSImage,
  type MicroCMSListContentBase,
} from "@lib/utils/microcms";
import { ensureNonNil } from "@lib/utils/type";
import type { AstroIntegrationLogger } from "astro";
import type { Article } from "../types";

/**
 *
 */
interface CMSArticle extends MicroCMSListContentBase {
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
  "hero-iamge-label"?: string | null;

  /**
   *
   */
  "theme-color": [ColorThemeBase];

  /**
   *
   */
  content: string;
}

/**
 *
 * @param cmsData
 * @returns
 */
function convertCMSDataToArticle(cmsData: CMSArticle): Omit<Article, "id"> {
  const {
    id,
    title,
    description,
    keywords,
    publishedAt,
    updatedAt,
    content,
    "hero-image": heroImage,
    "hero-image-alt": heroImageAlt,
    "hero-iamge-label": heroImageLabel,
    "theme-color": themeColor,
  } = cmsData;

  return {
    contentId: id,
    title,
    description,
    keywords: (keywords ?? "").split(",").filter((k) => k.length > 0),
    themeColor: ensureNonNil(themeColor[0]),
    publishedAt: publishedAt,
    updatedAt: updatedAt,
    content,
    thumbnail: heroImage.url,
    thumbnailAlt: heroImageAlt,
    thumbnailLabel: heroImageLabel,
  };
}

/**
 * 指定した日付より後に update された記事があるかどうかを取得する
 * @param date
 * @param logger
 * @returns
 */
export async function hasNewArticlesSince(
  date: Date | undefined,
  logger: AstroIntegrationLogger,
): Promise<boolean> {
  if (!date) {
    return true;
  }

  const latestUpdatedAt = await fetchLatestUpdatedAt(logger);

  return latestUpdatedAt > date;
}

/**
 * 指定した日付より後に update された記事を取得する
 * @param date - この日付より後に更新された記事を取得する。未指定の場合は全ての記事を取得
 * @param logger
 * @returns 取得した記事の配列（ソートなし。表示時にソートが必要）
 */
export async function fetchArticlesSince(
  date: Date | undefined,
  logger: AstroIntegrationLogger,
): Promise<Omit<Article, "id">[]> {
  const filters: MicroCMSFilters<CMSArticle>[] = [];

  if (date) {
    filters.push({
      target: "updatedAt",
      operator: "greaterThan",
      value: date.toISOString(),
    });
  }

  const result = await fetchContents<CMSArticle>("articles", {
    filters,
    logger,
  });

  return result.contents.map(convertCMSDataToArticle);
}

/**
 * 最新の更新日時を取得する
 * @param logger
 * @returns 全記事の中で最も新しい更新日時
 * @throws 記事が1件も存在しない場合にエラーをスロー
 */
async function fetchLatestUpdatedAt(
  logger: AstroIntegrationLogger,
): Promise<Date> {
  const result = await fetchContents<CMSArticle>("articles", {
    query: {
      fields: ["updatedAt"],
      orders: "-updatedAt",
      limit: 1,
    },
    logger,
  });

  const date = result.contents[0]?.updatedAt;

  if (!date) {
    throw new Error("Latest updated at not found");
  }

  return new Date(date);
}
