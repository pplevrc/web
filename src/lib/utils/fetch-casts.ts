import type { FetchedCast } from "@lib/contents/casts/types";
import {
  type ColorThemeBase,
  isColorThemeBase,
} from "@lib/contents/commons/ColorToken";
import { toSocialLink } from "@lib/contents/commons/SocialLink";
import { CONTENTS_CASTS_URL } from "./env";

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

type Required<T> = { [K in keyof T]-?: T[K] extends infer R | null ? R : T[K] };

/**
 * APIレスポンスを内部Cast型に変換
 */
async function convertApiResponseToCast(
  apiData: Required<CastApiResponse>,
): Promise<FetchedCast> {
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
      userPageURL: new URL(apiData.vrchat_userpage_url),
    },
    avatars: [
      {
        images: {
          neutral: apiData.image_standing_neutral_url,
          expression: apiData.image_standing_emotional_url,
        },
        credit: apiData.credit,
      },
    ],
    portrait: {
      neutral: apiData.image_bust_neutral_url,
      expression: apiData.image_bust_emotional_url,
    },
    socialLinks,
    thumbnail: apiData.image_bestshot_url,
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
): apiData is Required<CastApiResponse> {
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
export async function fetchCastsFromApi(): Promise<FetchedCast[]> {
  if (!CONTENTS_CASTS_URL) {
    throw new Error("CONTENTS_CASTS_URL not configured");
  }

  console.log("fetchCastsFromApi");

  const response = await fetch(CONTENTS_CASTS_URL);

  if (!response.ok) {
    throw new Error(
      `Casts API error: ${response.status} ${response.statusText}`,
    );
  }

  const apiData: CastApiResponse[] = await response.json();
  const validCasts: FetchedCast[] = [];

  for (const item of apiData) {
    // publishedでない場合はスキップ
    if (!item.published) continue;

    // データが無効な場合はスキップ
    if (!isValidCastData(item)) continue;

    try {
      const cast = await convertApiResponseToCast(item);
      validCasts.push(cast);
    } catch (error) {
      console.warn(`Failed to convert cast data for ${item.nickname}:`, error);
      // 変換エラーの場合もスキップ
    }
  }

  return validCasts;
}
