import { defineTokens } from "@pandacss/dev";
import defu from "defu";
import { toSizingToken } from "./lib/dimensions";

export const tokens = defineTokens({
	sizes: (() => {
		const sizeNames = [
			1.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36,
			39, 43, 48, 52, 56, 60, 64, 72, 80, 96, 102,
		];

		type SizesToken = NonNullable<Parameters<typeof defineTokens.sizes>[0]>;

		return defineTokens.sizes(
			defu<SizesToken, SizesToken[]>(
				{
					px: toSizingToken(0.25),
				},
				...sizeNames.map((name) => ({ [name]: toSizingToken(name) })),
			),
		);
	})(),
	spacing: (() => {
		const spacingNames = [0, 2, 4, 6, 10, 16, 26, 42];

		type SpacingToken = NonNullable<Parameters<typeof defineTokens.spacing>[0]>;
		return defineTokens.spacing(
			defu<SpacingToken, SpacingToken[]>(
				{},
				...spacingNames.map((name) => ({ [name]: toSizingToken(name) })),
			),
		);
	})(),
	radii: defineTokens.radii({
		none: toSizingToken(0),
		xs: toSizingToken(0.5),
		sm: toSizingToken(1),
		md: toSizingToken(1.5),
		lg: toSizingToken(2),
		xl: toSizingToken(3),
		"2xl": toSizingToken(4),
		"3xl": toSizingToken(6),
		full: { value: "9999px" },
	}),
	borderWidths: defineTokens.borderWidths({
		none: toSizingToken(0),
		md: toSizingToken(0.25),
		lg: toSizingToken(0.5),
		xl: toSizingToken(1),
		"2xl": toSizingToken(2),
		"3xl": toSizingToken(4),
	}),
});

export const semanticTokens = defineTokens({});
