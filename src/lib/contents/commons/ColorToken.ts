import { z } from "astro:content";
import { schemaForType } from "@lib/utils/type";
import type { ColorToken } from "@styles/tokens";

type PickToken<T extends string> = T extends `${infer _}.${infer Type}`
	? Type extends `${number}`
		? never
		: T
	: never;

export type ColorTheme = PickToken<ColorToken>;

export const colorThemeSchema = schemaForType<ColorTheme>(
	z.union([
		z.literal("smoke.lite"),
		z.literal("smoke.regular"),
		z.literal("smoke.deep"),
		z.literal("olive.lite"),
		z.literal("olive.regular"),
		z.literal("olive.deep"),
		z.literal("berry.lite"),
		z.literal("berry.regular"),
		z.literal("berry.deep"),
		z.literal("honey.lite"),
		z.literal("honey.regular"),
		z.literal("honey.deep"),
		z.literal("soda.lite"),
		z.literal("soda.regular"),
		z.literal("soda.deep"),
		z.literal("rose.lite"),
		z.literal("rose.regular"),
		z.literal("rose.deep"),
		z.literal("matcha.lite"),
		z.literal("matcha.regular"),
		z.literal("matcha.deep"),
		z.literal("latte.lite"),
		z.literal("latte.regular"),
		z.literal("latte.deep"),
		z.literal("lavendar.lite"),
		z.literal("lavendar.regular"),
		z.literal("lavendar.deep"),
		z.literal("carrot.lite"),
		z.literal("carrot.regular"),
		z.literal("carrot.deep"),
		z.literal("ice.lite"),
		z.literal("ice.regular"),
		z.literal("ice.deep"),
		z.literal("mint.lite"),
		z.literal("mint.regular"),
		z.literal("mint.deep"),
	]),
);
