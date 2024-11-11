import { defineTokens } from "@pandacss/dev";
import type { Gradient } from "@pandacss/types";
import defu from "defu";
import { toRem } from "./commons/dimensions";

type Token = NonNullable<Parameters<typeof defineTokens.colors>[0]>;

interface TokenFragment {
	tokens: Token;
	semanticTokens: Token;
}

const smoke = {
	tokens: {
		50: {
			value: "#F6F8FA",
		},
		100: {
			value: "#EAEEF2",
		},
		200: {
			value: "#D0D7DE",
		},
		300: {
			value: "#AFB8C1",
		},
		400: {
			value: "#8C959F",
		},
		500: {
			value: "#6E7781",
		},
		600: {
			value: "#57606A",
		},
		700: {
			value: "#424A53",
		},
		800: {
			value: "#32383F",
		},
		900: {
			value: "#24292F",
		},
	},
	semanticTokens: {
		bg: {
			value: "{colors.smoke.100}",
		},
		lite: {
			value: "{colors.smoke.200}",
		},
		regular: {
			value: "{colors.smoke.400}",
		},
		deep: {
			value: "{colors.smoke.700}",
		},
	},
} as const satisfies TokenFragment;

const olive = {
	tokens: {
		50: {
			value: "#ECF3D6",
		},
		100: {
			value: "#D5DBAF",
		},
		200: {
			value: "#BCC190",
		},
		300: {
			value: "#A5A979",
		},
		400: {
			value: "#8A8D62",
		},
		500: {
			value: "#71754F",
		},
		600: {
			value: "#5E5F3E",
		},
		700: {
			value: "#4B4A2E",
		},
		800: {
			value: "#3D3C24",
		},
		900: {
			value: "#34321C",
		},
	},
	semanticTokens: {
		bg: {
			value: "{colors.olive.100}",
		},
		lite: {
			value: "{colors.olive.200}",
		},
		regular: {
			value: "{colors.olive.400}",
		},
		deep: {
			value: "{colors.olive.700}",
		},
	},
} as const satisfies TokenFragment;

const berry = {
	tokens: {
		50: {
			value: "#F0DADF",
		},
		100: {
			value: "#D9B0BB",
		},
		200: {
			value: "#C894A2",
		},
		300: {
			value: "#B57C8C",
		},
		400: {
			value: "#A36477",
		},
		500: {
			value: "#955569",
		},
		600: {
			value: "#844A5C",
		},
		700: {
			value: "#764151",
		},
		800: {
			value: "#603241",
		},
		900: {
			value: "#502633",
		},
	},
	semanticTokens: {
		bg: {
			value: "{colors.berry.50}",
		},
		lite: {
			value: "{colors.berry.100}",
		},
		regular: {
			value: "{colors.berry.300}",
		},
		deep: {
			value: "{colors.berry.700}",
		},
	},
} as const satisfies TokenFragment;

const honey = {
	tokens: {
		50: {
			value: "#FFF9D9",
		},
		100: {
			value: "#FFEB9F",
		},
		200: {
			value: "#FFE56D",
		},
		300: {
			value: "#EFCE40",
		},
		400: {
			value: "#D5B22E",
		},
		500: {
			value: "#AE8200",
		},
		600: {
			value: "#906900",
		},
		700: {
			value: "#715100",
		},
		800: {
			value: "#563B00",
		},
		900: {
			value: "#402700",
		},
	},
	semanticTokens: {
		bg: {
			value: "{colors.honey.100}",
		},
		lite: {
			value: "{colors.honey.200}",
		},
		regular: {
			value: "{colors.honey.300}",
		},
		deep: {
			value: "{colors.honey.600}",
		},
	},
} as const satisfies TokenFragment;

const soda = {
	tokens: {
		50: {
			value: "#E3FAFD",
		},
		100: {
			value: "#B3E9FA",
		},
		200: {
			value: "#95D5F5",
		},
		300: {
			value: "#75C1EE",
		},
		400: {
			value: "#4B9BD1",
		},
		500: {
			value: "#377AAD",
		},
		600: {
			value: "#2B5F8F",
		},
		700: {
			value: "#214A76",
		},
		800: {
			value: "#163B5C",
		},
		900: {
			value: "#0B2D47",
		},
	},
	semanticTokens: {
		bg: {
			value: "{colors.soda.50}",
		},
		lite: {
			value: "{colors.soda.100}",
		},
		regular: {
			value: "{colors.soda.400}",
		},
		deep: {
			value: "{colors.soda.700}",
		},
	},
} as const satisfies TokenFragment;

const rose = {
	tokens: {
		50: {
			value: "#FCE8EA",
		},
		100: {
			value: "#F8CACF",
		},
		200: {
			value: "#F3ABB3",
		},
		300: {
			value: "#ED8D9A",
		},
		400: {
			value: "#E16F80",
		},
		500: {
			value: "#C96473",
		},
		600: {
			value: "#A75464",
		},
		700: {
			value: "#97495B",
		},
		800: {
			value: "#733442",
		},
		900: {
			value: "#561F26",
		},
	},
	semanticTokens: {
		bg: {
			value: "{colors.rose.50}",
		},
		lite: {
			value: "{colors.rose.100}",
		},
		regular: {
			value: "{colors.rose.400}",
		},
		deep: {
			value: "{colors.rose.700}",
		},
	},
} as const satisfies TokenFragment;

const matcha = {
	tokens: {
		50: {
			value: "#F1FCE0",
		},
		100: {
			value: "#D7F3A8",
		},
		200: {
			value: "#B5D78D",
		},
		300: {
			value: "#A6C17F",
		},
		400: {
			value: "#91AF6C",
		},
		500: {
			value: "#769957",
		},
		600: {
			value: "#5F8747",
		},
		700: {
			value: "#4A6E36",
		},
		800: {
			value: "#344C23",
		},
		900: {
			value: "#183109",
		},
	},
	semanticTokens: {
		bg: {
			value: "{colors.matcha.100}",
		},
		lite: {
			value: "{colors.matcha.200}",
		},
		regular: {
			value: "{colors.matcha.300}",
		},
		deep: {
			value: "{colors.matcha.700}",
		},
	},
} as const satisfies TokenFragment;

const latte = {
	tokens: {
		50: {
			value: "#EFDDD0",
		},
		100: {
			value: "#E1C2AE",
		},
		200: {
			value: "#D7AC90",
		},
		300: {
			value: "#A6866A",
		},
		400: {
			value: "#9B7F69",
		},
		500: {
			value: "#8B725D",
		},
		600: {
			value: "#79614C",
		},
		700: {
			value: "#69513B",
		},
		800: {
			value: "#5C4029",
		},
		900: {
			value: "#54321C",
		},
	},
	semanticTokens: {
		bg: {
			value: "{colors.latte.50}",
		},
		lite: {
			value: "{colors.latte.100}",
		},
		regular: {
			value: "{colors.latte.300}",
		},
		deep: {
			value: "{colors.latte.700}",
		},
	},
} as const satisfies TokenFragment;

const lavendar = {
	tokens: {
		50: {
			value: "#D8D4E9",
		},
		100: {
			value: "#B7B2D9",
		},
		200: {
			value: "#9F9ACE",
		},
		300: {
			value: "#8A88C5",
		},
		400: {
			value: "#7972B4",
		},
		500: {
			value: "#6A61A3",
		},
		600: {
			value: "#5C5091",
		},
		700: {
			value: "#4A4273",
		},
		800: {
			value: "#352F4F",
		},
		900: {
			value: "#221D31",
		},
	},
	semanticTokens: {
		bg: {
			value: "{colors.lavendar.50}",
		},
		lite: {
			value: "{colors.lavendar.100}",
		},
		regular: {
			value: "{colors.lavendar.400}",
		},
		deep: {
			value: "{colors.lavendar.700}",
		},
	},
} as const satisfies TokenFragment;

const carrot = {
	tokens: {
		50: {
			value: "#EBC8BC",
		},
		100: {
			value: "#E6AD96",
		},
		200: {
			value: "#E49670",
		},
		300: {
			value: "#CD7F59",
		},
		400: {
			value: "#B76E4A",
		},
		500: {
			value: "#9E5F3D",
		},
		600: {
			value: "#844F32",
		},
		700: {
			value: "#73402C",
		},
		800: {
			value: "#603125",
		},
		900: {
			value: "#49241D",
		},
	},
	semanticTokens: {
		bg: {
			value: "{colors.carrot.50}",
		},
		lite: {
			value: "{colors.carrot.100}",
		},
		regular: {
			value: "{colors.carrot.300}",
		},
		deep: {
			value: "{colors.carrot.600}",
		},
	},
} as const satisfies TokenFragment;

const ice = {
	tokens: {
		50: {
			value: "#DAE5E8",
		},
		100: {
			value: "#C6DCE0",
		},
		200: {
			value: "#B4CACC",
		},
		300: {
			value: "#99AEAE",
		},
		400: {
			value: "#859696",
		},
		500: {
			value: "#71807E",
		},
		600: {
			value: "#5F6B67",
		},
		700: {
			value: "#535D57",
		},
		800: {
			value: "#434B45",
		},
		900: {
			value: "#313732",
		},
	},
	semanticTokens: {
		bg: {
			value: "{colors.ice.50}",
		},
		lite: {
			value: "{colors.ice.200}",
		},
		regular: {
			value: "{colors.ice.400}",
		},
		deep: {
			value: "{colors.ice.600}",
		},
	},
} as const satisfies TokenFragment;

const mint = {
	tokens: {
		50: {
			value: "#D8F5EA",
		},
		100: {
			value: "#B8F0DE",
		},
		200: {
			value: "#9ADDC9",
		},
		300: {
			value: "#82C7B7",
		},
		400: {
			value: "#67AFA2",
		},
		500: {
			value: "#4F9289",
		},
		600: {
			value: "#3F7B77",
		},
		700: {
			value: "#2F6161",
		},
		800: {
			value: "#224A4C",
		},
		900: {
			value: "#17353A",
		},
	},
	semanticTokens: {
		bg: {
			value: "{colors.mint.50}",
		},
		lite: {
			value: "{colors.mint.100}",
		},
		regular: {
			value: "{colors.mint.400}",
		},
		deep: {
			value: "{colors.mint.600}",
		},
	},
} as const satisfies TokenFragment;

const white = {
	tokens: {
		DEFAULT: {
			value: "#FFFFFF",
		},
	},
	semanticTokens: {},
} as const satisfies TokenFragment;

const black = {
	tokens: {
		DEFAULT: {
			value: "#000000",
		},
	},
	semanticTokens: {},
} as const satisfies TokenFragment;

const colorPalettes = {
	smoke,
	olive,
	berry,
	honey,
	soda,
	rose,
	matcha,
	latte,
	lavendar,
	carrot,
	ice,
	mint,
} as const;

export const colorNames = Object.keys(colorPalettes);

const colorPaletteEntries = Object.entries(colorPalettes) as [
	string,
	(typeof colorPalettes)[keyof typeof colorPalettes],
][];

export const tokens = defineTokens({
	colors: defineTokens.colors(
		(
			[...colorPaletteEntries, ["white", white], ["black", black]] as const
		).reduce<Token>(
			(acc, [name, color]) => defu(acc, { [name]: color.tokens }),
			{},
		),
	),
});
export const semanticTokens = defineTokens({
	colors: defineTokens.colors(
		(
			[...colorPaletteEntries, ["white", white], ["black", black]] as const
		).reduce<Token>(
			(acc, [name, color]) => defu(acc, { [name]: color.semanticTokens }),
			{},
		),
	),
	gradients: defineTokens.gradients(
		colorPaletteEntries.reduce<Token>(
			(acc, [name, color]) =>
				defu(acc, {
					[name]: {
						DEFAULT: {
							value: {
								type: "linear",
								placement: "to bottom",
								stops: (() => {
									const { bg, lite } = color.semanticTokens;

									return [bg.value, lite.value];
								})(),
							} satisfies Gradient,
						},
						dashed: {
							value: (() => {
								const { lite } = color.semanticTokens;

								return `linear-gradient(to right, ${lite.value} 1rem, transparent 1rem)`;
							})(),
						},
					},
				}),
			{},
		),
	),
	shadows: {
		none: {
			value: "0 0 0 0 {colors.black}",
		},
		xs: {
			value: `0 ${toRem(0.25)} ${toRem(0.25)} 0 {colors.black/15}`,
		},
		sm: {
			value: `0, ${toRem(0.25)} ${toRem(0.5)} 0 {colors.black}`,
		},
	},
});
