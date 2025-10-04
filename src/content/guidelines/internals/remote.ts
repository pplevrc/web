import type { ColorThemeBase } from "@content/commons";
import {
  fetchContents,
  type MicroCMSFilters,
  type MicroCMSImage,
  type MicroCMSListContentBase,
} from "@lib/utils/microcms";
import { ensureNonNil } from "@lib/utils/type";

import type { BallonPosition, Guideline } from "../types";

export interface CMSGuideline extends MicroCMSListContentBase {
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
  "theme-color": [ColorThemeBase];

  /**
   *
   */
  "ballon-position": [BallonPosition];
}

/**
 *
 * @param cmsGuideline
 * @returns
 */
function convertCMSToGuideline(cmsData: CMSGuideline): Omit<Guideline, "id"> {
  const {
    title,
    description,
    publishedAt,
    updatedAt,
    contents,
    keywords,
    "hero-image": heroImage,
    "ballon-position": ballonPosition,
    "theme-color": themeColor,
  } = cmsData;

  return {
    title,
    description,
    publishedAt: publishedAt,
    updatedAt: updatedAt,
    content: contents || "",
    keywords: (keywords ?? "")
      .split(",")
      // "".split -> [""] となるため
      .filter((k) => k.length > 0)
      .map((keyword) => keyword.trim()),
    thumbnail: heroImage.url,
    ballonPosition: ensureNonNil(ballonPosition[0]),
    themeColor: ensureNonNil(themeColor[0]),
  };
}

/**
 * 指定した日付より後に update された Guideline があるかどうかを取得する
 * @param date
 * @returns
 */
export async function hasNewGuidelinesSince(date?: Date): Promise<boolean> {
  if (!date) {
    return true;
  }

  const latestUpdatedAt = await fetchLatestUpdatedAt();
  return latestUpdatedAt > date;
}

/**
 * CMS から Guideline を取得する
 * @returns
 */
export async function fetchGuidelinesSince(
  date?: Date,
): Promise<Omit<Guideline, "id">[]> {
  const filters: MicroCMSFilters<CMSGuideline>[] = [];

  if (date) {
    filters.push({
      target: "updatedAt",
      operator: "greaterThan",
      value: date.toISOString(),
    });
  }

  const result = await fetchContents<CMSGuideline>("guidelines", {
    filters,
  });

  return result.contents.map(convertCMSToGuideline);
}

/**
 * 最新の更新日時を取得する
 * @returns
 */
async function fetchLatestUpdatedAt(): Promise<Date> {
  const result = await fetchContents<CMSGuideline>("guidelines", {
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
