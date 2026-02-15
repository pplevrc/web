import type { Cast } from "@content/casts";
import { toSocialLink } from "@content/commons";
import { fetchContents, type MicroCMSFilters } from "@lib/utils/microcms";
import { ensureNonNil } from "@lib/utils/type";
import type { AstroIntegrationLogger } from "astro";
import type { CMSCast } from "./cms-type";

/**
 * CMSデータを内部用Cast型に変換する
 * @param cmsData
 */
async function convertCMSToCast(cmsData: CMSCast): Promise<Cast> {
  console.dir(cmsData, { depth: 0 });
  const socialLinks = await Promise.all(
    (cmsData.social_links ?? []).map((link) =>
      toSocialLink({ url: link.url, description: link.description }),
    ),
  );

  const avatars = cmsData.avatars__old.map((avatar) => ({
    images: {
      neutral: avatar.standing_neutral.url,
      emotional: avatar.standing_emotional.url,
    },
    credit: avatar.credit,
  }));

  // 0 番目のデータをプライマリーデータとし, 一覧や OGP などの表示対象とする. (常に存在する前提)
  const primaryAvatar = ensureNonNil(
    cmsData.avatars__old[0],
    `Cast ${cmsData.nickname} has no avatars_old data.`,
  );

  return {
    profile: {
      nickname: cmsData.nickname,
      introduction: cmsData.introduction,
    },
    themeColor: ensureNonNil(cmsData.personal_color[0]),
    vrchat: {
      userId: cmsData.vrchat.display_name,
      userPageURL: cmsData.vrchat.userpage_url,
    },
    avatars,
    portrait: {
      neutral: primaryAvatar.bustup_neutral.url,
      emotional: primaryAvatar.bustup_emotional.url,
    },
    socialLinks,
    thumbnail: primaryAvatar.bestshot.url,
    createdAt: cmsData.publishedAt,
    updatedAt: cmsData.updatedAt,
  };
}

/**
 * 指定した日付より後に update された Cast があるかどうかを取得する
 * @param date
 * @param logger
 */
export async function hasNewCastsSince(
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
 * CMS から Cast を取得する
 * @param date
 * @param logger
 */
export async function fetchCastsSince(
  date: Date | undefined,
  logger: AstroIntegrationLogger,
): Promise<Cast[]> {
  const filters: MicroCMSFilters<CMSCast>[] = [];

  if (date) {
    filters.push({
      target: "updatedAt",
      operator: "greaterThan",
      value: date.toISOString(),
    });
  }

  const result = await fetchContents<CMSCast>("casts", {
    filters,
    logger,
    // FIXME: 全権取得が必要な場合に, limit が邪魔する.
    query: {
      limit: 100,
    },
  });

  return Promise.all(result.contents.map(convertCMSToCast));
}

/**
 * 最新の更新日時を取得する
 * @param logger
 */
async function fetchLatestUpdatedAt(
  logger: AstroIntegrationLogger,
): Promise<Date> {
  const result = await fetchContents<CMSCast>("casts", {
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
