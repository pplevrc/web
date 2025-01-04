import { defineConfig } from "astro/config";
import isWsl from "is-wsl";

export default defineConfig({
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
