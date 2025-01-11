import { z } from "astro:content";
import { schemaForType } from "@lib/utils/type";
import { type ColorTheme, colorThemeSchema } from "../commons/ColorToken";
import { type SocialLink, socialLinkSchema } from "../commons/SocialLink";
import { type Avatar, avatarSchema } from "./avatar";

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
  avatars: Avatar[];

  /**
   * @example "https://www.youtube.com/@sotomiti_iroha"
   */
  socialLinks: SocialLink[];
}

/**
 * キャストさんの VRChat のプロフィール
 */
export interface VRChatProfile {
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
 * キャストさんのプロフィール
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
export type FetchedCast = Omit<Cast, "images">;

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

const fetchedCastSchema = schemaForType<FetchedCast>(
  z.object({
    attendanceId: z.number(),
    profile: profileSchema,
    themeColor: colorThemeSchema,
    vrchat: vrchatSchema,
    avatars: z.array(avatarSchema),
    socialLinks: z.array(socialLinkSchema),
  }),
);

export function assertCast(value: unknown): asserts value is FetchedCast {
  fetchedCastSchema.parse(value);
}

export function assertCasts(value: unknown[]): asserts value is FetchedCast[] {
  z.array(fetchedCastSchema).parse(value);
}
