import { definePreset } from "@pandacss/dev";
import defu from "defu";
import * as colors from "./tokens/colors";
import * as dimensions from "./tokens/dimensions";

export default definePreset({
	name: "pple-themes",
	theme: {
		tokens: defu({}, colors.tokens, dimensions.tokens),
		semanticTokens: defu({}, colors.semanticTokens, dimensions.semanticTokens),
		breakpoints: {
			pc: "1440px",
			sp: "320px",
		},
	},
});
