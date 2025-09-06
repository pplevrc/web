import { z } from "astro:content";
import { schemaForType } from "@lib/utils/type";
import { socialLinkSchema } from "../commons/SocialLink";

export interface Avatar {
  /**
   *
   */
  images: AvatarImages;

  /**
   * 使用されているアセットに必要なクレジット表記
   */
  credit: string;
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

export const avatarImagesSchema = schemaForType<AvatarImages>(
  z.object({
    newtral: z.unknown(),
    expression: z.unknown(),
  }) as any,
);

export const avatarSchema = schemaForType<Avatar>(
  z.object({
    images: avatarImagesSchema,
    credit: z.string(),
  }),
);
