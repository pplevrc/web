import isWsl from "is-wsl";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environmentOptions: {
			happyDOM: {
				width: 2880,
			},
		},
		open: false,
	},

	server: {
		watch: {
			usePolling: isWsl,
		},
	},
});
