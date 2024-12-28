import { z } from "astro:content";
import { schemaForType } from "@/lib/utils/type";
import { type SocialLink, socialLinkSchema } from "../commons/SocialLink";

export interface AvatarImage {
	/**
	 * アバターの身長
	 */
	avatarHeight: number;

	/**
	 * サムネイル画像
	 */
	thumbnailImageSrc: string;

	/**
	 * 全身画像
	 */
	fullBodyImageSrc: string;

	/**
	 * 使用されているアセット情報リスト
	 */
	assets: AvatarAsset[];
}

export interface AvatarAsset {
	/**
	 * @example "『シフォン』-Chiffon-【オリジナル3Dモデル】"
	 */
	assetName: string;

	/**
	 * @example { desciption: "あまとうさぎ | こまど / komado (Booth Store)", url: "https://komado.booth.pm/", type: "pixiv-booth" }
	 */
	storeLink: SocialLink<"pixiv-booth">;
}

const avatarAssetSchema = schemaForType<AvatarAsset>(
	z.object({
		assetName: z.string(),
		storeLink: socialLinkSchema as z.ZodType<SocialLink<"pixiv-booth">>,
	}),
);

export const avatarImageSchema = schemaForType<AvatarImage>(
	z.object({
		avatarHeight: z.number(),
		thumbnailImageSrc: z.string(),
		fullBodyImageSrc: z.string(),
		assets: z.array(avatarAssetSchema),
	}),
);

export async function toAvatarImages(
	originImageURL: string,
	avatarHeight: number,
): Promise<AvatarImage> {
	return {
		thumbnailImageSrc: originImageURL,
		fullBodyImageSrc: originImageURL,
		avatarHeight,
		assets: [],
	};
}

interface TrimmingOption {
	top?: number;
	left?: number;
	right?: number;
	bottom?: number;
}

async function trimImage(
	image: Blob,
	{ top: t, left: l, right: r, bottom: b }: TrimmingOption,
): Promise<Blob> {}
