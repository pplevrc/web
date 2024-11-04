import { defineConfig } from "astro/config";
import isWsl from "is-wsl";

export default defineConfig({
	vite: {
		server: {
			watch: {
				usePolling: isWsl,
			},
		},
	},
});
