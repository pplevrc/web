import { z } from "astro:content";
import { cache } from "@lib/utils/cache";
import { schemaForType } from "@lib/utils/type";
import { type ColorTheme, colorThemeSchema } from "../commons/ColorToken";
import { type SocialLink, socialLinkSchema } from "../commons/SocialLink";
import { type AvatarImage, avatarImageSchema } from "./avatar";

import { createMockCasts } from "./__mock__";

/**
 *
 */
export interface Cast {
	/**
	 * 出席番号
	 * @example 48
	 */
	attendanceId: number;

	/**
	 * キャストのプロフィール
	 */
	profile: CastProfile;

	/**
	 * テーマカラー
	 * @example "honey.lite"
	 */
	themeColor: ColorTheme;

	/**
	 * VRChat のプロフィール
	 */
	vrchat: VRChatProfile;

	/**
	 * Avatar Studio で撮影した画像データの URL
	 */
	mainAvatar: AvatarImage;

	/**
	 * @example "https://www.youtube.com/@sotomiti_iroha"
	 */
	socialLinks: SocialLink[];
}

/**
 *
 */
interface VRChatProfile {
	/**
	 * @example "外道いろは"
	 */
	userId: string;

	/**
	 * @example "https://vrchat.com/home/user/usr_03ca05dc-4bb8-422e-a9dd-72880e6c59d3"
	 */
	userPageURL: URL;
}

/**
 *
 */
export interface CastProfile {
	/**
	 * ひらがな６文字以下で表示する名前
	 * @example "いろは"
	 */
	nickname: string;

	/**
	 * @example "やっほー！！いろはです！！\n 構ってくれるにぃにとねぇねがだいすきな子です！！\n はじめての店員さんだけどいっしょうけんめいがんばるよ！！"
	 */
	introduction: string;

	/**
	 * @example 12/31
	 */
	birthday?: Date;

	/**
	 * @example 12
	 */
	age?: number;
}

export const fetchCasts = cache(async (): Promise<Cast[]> => {
	// 本来は API からデータを取得する
	const result = await createMockCasts();

	return z.array(castSchema).parse(result);
});

const profileSchema = schemaForType<CastProfile>(
	z.object({
		nickname: z.string(),
		introduction: z.string(),
		birthday: z.date().optional(),
		age: z.number().optional(),
	}),
);

const vrchatSchema = schemaForType<VRChatProfile>(
	z.object({
		userId: z.string(),
		userPageURL: z.any() as z.ZodType<URL>,
	}),
);

const castSchema = schemaForType<Cast>(
	z.object({
		attendanceId: z.number(),
		profile: profileSchema,
		themeColor: colorThemeSchema,
		vrchat: vrchatSchema,
		mainAvatar: avatarImageSchema,
		socialLinks: z.array(socialLinkSchema),
	}),
);

export async function fetchCastByNickName(nickname: string): Promise<Cast> {
	const casts = await fetchCasts();
	const cast = casts.find((cast) => cast.profile.nickname === nickname);

	if (!cast) {
		throw new Error(`Cast "${nickname}" not found`);
	}

	return cast;
}
