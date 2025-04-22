import { z } from "astro:content";
import { schemaForType } from "@lib/utils/type";
import { type SocialLink, socialLinkSchema } from "../commons/SocialLink";

export interface Avatar {
  /**
   * アバターの身長
   */
  height: number;

  /**
   *
   */
  images: AvatarImages;

  /**
   * 使用されているアセット情報リスト
   */
  assets: SocialLink[];
}

/**
 * 店員さんの立ち絵
 */
export interface AvatarImages {
  /**
   * 表情・仕草のない姿の画像
   */
  neutral: string | ImageMetadata;

  /**
   * 何らかの表情・仕草のある画像
   */
  expression: string | ImageMetadata;

  /**
   * 三面図画像
   */
  // threeSided: string;
}

/**
 * 店員さんのアバターを参照するためのインデックス
 */
export interface AvatarIndex {
  /**
   * 店員さんのニックネーム
   */
  nickname: string;

  /**
   * アバターのインデックス
   * @default 0
   */
  index?: number;
}

/**
 * 店員さんのアバター画像を参照するためのインデックス
 */
export interface AvatarImageIndex extends AvatarIndex {
  /**
   * 画像の種類
   * @default "neutral"
   */
  type?: keyof AvatarImages;
}

export const avatarImageIndexDefault = Object.freeze({
  type: "neutral",
  index: 0,
} as const satisfies Required<Pick<AvatarImageIndex, "type" | "index">>);

const avatarImagesSchema = schemaForType<AvatarImages>(
  z.object({
    newtral: z.unknown(),
    expression: z.unknown(),
    // threeSided: z.string(),
    // biome-ignore lint/suspicious/noExplicitAny: 一時的に対応 (ちょっと面倒だったので)
  }) as any,
);

export const avatarSchema = schemaForType<Avatar>(
  z.object({
    height: z.number(),
    images: avatarImagesSchema,
    assets: z.array(socialLinkSchema),
  }),
);
