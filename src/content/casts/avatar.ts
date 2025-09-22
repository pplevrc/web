import { z } from "astro:content";
import { schemaForType } from "@lib/utils/type";

export interface Avatar {
  /**
   *
   */
  images: AvatarImages;

  /**
   * 使用されているアセットに必要なクレジット表記
   */
  credit?: string | undefined;
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
  emotional: string | ImageMetadata;
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
  expression?: keyof AvatarImages;
}

export const avatarImageIndexDefault = Object.freeze({
  expression: "neutral",
  index: 0,
} as const satisfies Required<Pick<AvatarImageIndex, "expression" | "index">>);

export const avatarImagesSchema = schemaForType<AvatarImages>(
  z.object({
    neutral: z.unknown() as z.ZodType<ImageMetadata | string>,
    emotional: z.unknown() as z.ZodType<ImageMetadata | string>,
  }),
);

export const avatarSchema = schemaForType<Avatar>(
  z.object({
    images: avatarImagesSchema,
    credit: z.union([z.string(), z.undefined()]),
  }),
);
