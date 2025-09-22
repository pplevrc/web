import { site } from "astro:config/server";
import { z } from "astro:content";
import { type ColorThemeBase, colorBaseThemeSchema } from "@content/commons";
import { type SocialLink, socialLinkSchema } from "@content/commons";
import { schemaForType } from "@lib/utils/type";
import {
  type Avatar,
  type AvatarImages,
  avatarImagesSchema,
  avatarSchema,
} from "./avatar";

/**
 *
 */
export interface Cast {
  /**
   * 店員さんのプロフィール
   */
  profile: CastProfile;

  /**
   * テーマカラー
   * @example "honey.lite"
   */
  themeColor: ColorThemeBase;

  /**
   * VRChat のプロフィール
   */
  vrchat: VRChatProfile;

  /**
   * Avatar Studio で撮影した画像データの URL
   */
  avatars: Avatar[];

  /**
   * 立ち絵画像セット
   */
  portrait: AvatarImages;

  /**
   * @example "https://www.youtube.com/@sotomiti_iroha"
   */
  socialLinks: SocialLink[];

  /**
   * サムネイル画像
   */
  thumbnail: string | ImageMetadata;

  /**
   *
   */
  createdAt: string;

  /**
   *
   */
  updatedAt: string;
}

/**
 * 外部公開する json のデータ構造
 */
export interface CastMeta {
  /**
   *
   */
  nickname: string;

  /**
   *
   */
  vrchat: VRChatProfile;

  /**
   *
   */
  profilePage: URL;
}

/**
 * 店員さんの VRChat のプロフィール
 */
export interface VRChatProfile {
  /**
   * @example "外道いろは"
   */
  userId: string;

  /**
   * @example "https://vrchat.com/home/user/usr_03ca05dc-4bb8-422e-a9dd-72880e6c59d3"
   */
  userPageURL: string;
}

/**
 * 店員さんのプロフィール
 */
export interface CastProfile {
  /**
   * ひらがな６文字以下で表示する名前
   * @example "いろは"
   */
  nickname: string;

  /**
   * // (これは AI が生成したいろはです.)
   * @example "やっほー！！いろはです！！\n 構ってくれるにぃにとねぇねがだいすきな子です！！\n はじめての店員さんだけどいっしょうけんめいがんばるよ！！"
   */
  introduction: string;
}

const profileSchema = schemaForType<CastProfile>(
  z.object({
    nickname: z.string(),
    introduction: z.string(),
  }),
);

const vrchatSchema = schemaForType<VRChatProfile>(
  z.object({
    userId: z.string(),
    userPageURL: z.string(),
  }),
);

export const castSchema = schemaForType<Cast>(
  z.object({
    profile: profileSchema,
    themeColor: colorBaseThemeSchema,
    vrchat: vrchatSchema,
    avatars: z.array(avatarSchema),
    portrait: avatarImagesSchema,
    socialLinks: z.array(socialLinkSchema),
    thumbnail: z.unknown() as z.ZodType<ImageMetadata | string>,
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
);

/**
 *
 */
export function toCastMeta(cast: Cast): CastMeta {
  return {
    nickname: cast.profile.nickname,
    vrchat: cast.vrchat,
    profilePage: new URL(`/casts/${cast.profile.nickname}`, site),
  };
}
