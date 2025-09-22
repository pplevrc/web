import type { ColorThemeBase } from "@content/commons";
import {
  type MicroCMSFilters,
  type MicroCMSImage,
  type MicroCMSListContentBase,
  fetchContents,
} from "@lib/utils/microcms";
import { ensureNonNil } from "@lib/utils/type";
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
 * @returns
 */
export async function hasNewArticlesSince(date?: Date): Promise<boolean> {
  if (!date) {
    return true;
  }

  const latestUpdatedAt = await fetchLatestUpdatedAt();

  return latestUpdatedAt > date;
}

/**
 * 指定した日付より後に update された記事を取得する
 */
export async function fetchArticlesSince(
  date?: Date,
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
  });

  return result.contents.map(convertCMSDataToArticle);
}

/**
 * 最新の更新日時を取得する
 * @returns
 */
async function fetchLatestUpdatedAt(): Promise<Date> {
  const result = await fetchContents<CMSArticle>("articles", {
    query: {
      fields: ["updatedAt"],
      order: "updatedAt",
      limit: 1,
    },
  });

  const date = result.contents[0]?.updatedAt;

  if (!date) {
    throw new Error("Latest updated at not found");
  }

  return new Date(date);
}
