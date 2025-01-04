import { z } from "astro:content";
import { schemaForType } from "@/lib/utils/type";
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
 * キャストさんの立ち絵
 */
export interface AvatarImages {
	/**
	 * 表情・仕草のない姿の画像
	 */
	neutral: ImageMetadata;

	/**
	 * 何らかの表情・仕草のある画像
	 */
	expression: ImageMetadata;

	/**
	 * 三面図画像
	 */
	// threeSided: string;
}

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
