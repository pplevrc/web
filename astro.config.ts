import { defineConfig } from "astro/config";
import isWsl from "is-wsl";

export default defineConfig({
	output: "static",
	image: {
		service: {
			entrypoint: "./src/lib/services/custom-sharp.ts",
		},
	},
	experimental: {
		responsiveImages: true,
	},

	vite: {
		server: {
			watch: {
				usePolling: isWsl,
			},
		},
	},

	cacheDir: "./.cache",
});
