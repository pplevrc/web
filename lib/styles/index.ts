import { definePreset } from "@pandacss/dev";
import defu from "defu";
import * as animations from "./tokens/animations";
import * as colors from "./tokens/colors";
import * as dimensions from "./tokens/dimensions";
import * as transforms from "./tokens/transforms";
import * as transitions from "./tokens/transitions";
import * as typographies from "./tokens/typography";

export default definePreset({
	name: "pple-themes",
	theme: {
		tokens: defu(
			{},
			colors.tokens,
			dimensions.tokens,
			transitions.tokens,
			transforms.tokens,
		),
		semanticTokens: defu(
			{},
			colors.semanticTokens,
			dimensions.semanticTokens,
			transitions.semanticTokens,
		),
		breakpoints: dimensions.breakpoints,
		textStyles: typographies.textStyle,
		keyframes: animations.keyframes,
	},
	conditions: {
		extend: {
			hover: ["@media (any-hover: hover) and (any-pointer: fine)", "&:hover"],
		},
	},
	globalFontface: typographies.globalFontface,
	globalCss: {
		html: {
			"--global-font-body": typographies.globalFontFamily,
		},
	},
});
