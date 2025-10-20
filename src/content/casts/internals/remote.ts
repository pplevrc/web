import type { Cast } from "@content/casts";
import {
  type ColorThemeBase,
  isColorThemeBase,
  toSocialLink,
} from "@content/commons";
import { CONTENTS_CASTS_URL } from "@lib/utils/env";
import { ensureNonNil } from "@lib/utils/type";
import type { AstroIntegrationLogger } from "astro";

/**
 * APIレスポンスデータの型（すべてnullable）
 */
interface CastApiResponse {
  id: string | null;
  nickname: string | null;
  published: boolean | null;
  vrchat_display_name: string | null;
  vrchat_userpage_url: string | null;
  personal_color: string | null;
  introduction: string | null;
  image_standing_neutral_url: string | null;
  image_bust_neutral_url: string | null;
  image_standing_emotional_url: string | null;
  image_bust_emotional_url: string | null;
  image_bestshot_url: string | null;
  social_url_1: string | null;
  social_desc_1: string | null;
  social_url_2: string | null;
  social_desc_2: string | null;
  social_url_3: string | null;
  social_desc_3: string | null;
  social_url_4: string | null;
  social_desc_4: string | null;
  social_url_5: string | null;
  social_desc_5: string | null;
  credit: string | null;
  created_at: string | null;
  updated_at: string | null;
}

type RequiredKeys = keyof CastApiResponse &
  (
    | "id"
    | "nickname"
    | "introduction"
    | "vrchat_display_name"
    | "vrchat_userpage_url"
    | "personal_color"
    | "image_standing_neutral_url"
    | "image_bust_neutral_url"
    | "image_standing_emotional_url"
    | "image_bust_emotional_url"
    | "image_bestshot_url"
  );

type Purify<T> = { [K in keyof T]: T[K] };

type ValidCastApiResponse = Purify<
  Omit<CastApiResponse, RequiredKeys> &
    Required<Pick<CastApiResponse, RequiredKeys>>
>;

type Required<T> = { [K in keyof T]-?: T[K] extends infer R | null ? R : T[K] };

/**
 * APIレスポンスを内部Cast型に変換
 */
async function convertApiResponseToCast(
  apiData: ValidCastApiResponse,
): Promise<Cast> {
  const socialLinks = [];

  // ソーシャルリンクを配列に変換
  for (let i = 1; i <= 5; i++) {
    const url = apiData[`social_url_${i}` as keyof CastApiResponse] as
      | string
      | null;
    const desc = apiData[`social_desc_${i}` as keyof CastApiResponse] as
      | string
      | null;

    if (url && desc) {
      const socialLink = await toSocialLink({ url, description: desc });
      socialLinks.push(socialLink);
    }
  }

  return {
    profile: {
      nickname: apiData.nickname,
      introduction: apiData.introduction,
    },
    themeColor: apiData.personal_color as ColorThemeBase,
    vrchat: {
      userId: apiData.vrchat_display_name,
      userPageURL: apiData.vrchat_userpage_url,
    },
    avatars: [
      {
        images: {
          neutral: apiData.image_standing_neutral_url,
          emotional: apiData.image_standing_emotional_url,
        },
        credit: apiData.credit ?? undefined,
      },
    ],
    portrait: {
      neutral: apiData.image_bust_neutral_url,
      emotional: apiData.image_bust_emotional_url,
    },
    socialLinks,
    thumbnail: apiData.image_bestshot_url,
    createdAt: ensureNonNil(
      apiData.created_at,
      `店員さんデータ [${apiData.nickname}] にて, created_at の情報が欠落しています`,
    ),
    updatedAt: ensureNonNil(
      apiData.updated_at,
      `店員さんデータ [${apiData.nickname}] にて, updated_at の情報が欠落しています`,
    ),
  };
}

/**
 * URLが有効かどうかをチェック
 */
function canParseURL(url: string | null): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * データが有効かどうかを検証
 */
function isValidCastData(
  apiData: CastApiResponse,
): apiData is ValidCastApiResponse {
  // 必須フィールドのnullチェック
  if (!apiData.id || !apiData.nickname || !apiData.introduction) {
    return false;
  }

  // VRChatデータの検証
  if (
    !apiData.vrchat_display_name ||
    !canParseURL(apiData.vrchat_userpage_url)
  ) {
    return false;
  }

  // ColorThemeBaseの検証
  if (apiData.personal_color && !isColorThemeBase(apiData.personal_color)) {
    return false;
  }

  // 画像URLの検証
  const requiredImages = [
    apiData.image_standing_neutral_url,
    apiData.image_bust_neutral_url,
    apiData.image_standing_emotional_url,
    apiData.image_bust_emotional_url,
    apiData.image_bestshot_url,
  ];

  if (!requiredImages.every(canParseURL)) {
    return false;
  }

  return true;
}

/**
 * 店員さんデータを外部APIから取得する
 */
export async function fetchCastsFromApi(
  logger: AstroIntegrationLogger,
): Promise<Cast[]> {
  if (!CONTENTS_CASTS_URL) {
    throw new Error("CONTENTS_CASTS_URL not configured");
  }

  try {
    logger.info("Fetching cast data from external API");
    const response = await fetch(CONTENTS_CASTS_URL);

    if (!response.ok) {
      throw new Error(
        `Casts API error: ${response.status} ${response.statusText}`,
      );
    }

    const apiData: CastApiResponse[] = await response.json();
    logger.info(`Received ${apiData.length} cast records from API`);
    const validCasts: Cast[] = [];

    for (const item of apiData) {
      // publishedでない場合はスキップ
      if (!item.published) continue;

      // データが無効な場合はスキップ
      if (!isValidCastData(item)) continue;

      try {
        const cast = await convertApiResponseToCast(item);
        validCasts.push(cast);
      } catch (error) {
        logger.warn(
          `Failed to convert cast data for ${item.nickname}: ${error}`,
        );
        // 変換エラーの場合もスキップ
      }
    }

    logger.info(
      `Successfully processed ${validCasts.length} valid cast records`,
    );
    return validCasts;
  } catch (error) {
    logger.error(`Error fetching cast data from API: ${error}`);
    throw error;
  }
}
