import { defineKeyframes } from "@pandacss/dev";

export const keyframes = defineKeyframes({
	fadeIn: {
		"0%": { opacity: "0" },
		"100%": { opacity: "1" },
	},
	rotate: {
		"0%": {
			transform: "rotate(0)",
		},
		"100%": {
			transform: "rotate(360deg)",
		},
	},
});
