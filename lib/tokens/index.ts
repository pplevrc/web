import { definePreset } from "@pandacss/dev";
import defu from "defu";
import * as colors from "./colors";
import * as dimensions from "./dimensions";

export default definePreset({
	name: "pple-themes",
	theme: {
		tokens: defu({}, colors.tokens, dimensions.tokens),
		semanticTokens: defu({}, colors.semanticTokens, dimensions.semanticTokens),
	},
});
