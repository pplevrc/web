import { fetchContents, type MicroCMSFilters } from "@lib/utils/microcms";
import { ensureNonNil } from "@lib/utils/type";
import type { AstroIntegrationLogger } from "astro";

import type { Guideline } from "../types";
import type { CMSGuideline } from "./cms-type";

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
 * @param logger
 * @returns
 */
export async function hasNewGuidelinesSince(
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
 * CMS から Guideline を取得する
 * @param date
 * @param logger
 * @returns
 */
export async function fetchGuidelinesSince(
  date: Date | undefined,
  logger: AstroIntegrationLogger,
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
    logger,
  });

  return result.contents.map(convertCMSToGuideline);
}

/**
 * 最新の更新日時を取得する
 * @param logger
 * @returns
 */
async function fetchLatestUpdatedAt(
  logger: AstroIntegrationLogger,
): Promise<Date> {
  const result = await fetchContents<CMSGuideline>("guidelines", {
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
