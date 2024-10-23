import relativeLinks from "astro-relative-links";
import { defineConfig } from "astro/config";
import isWsl from "is-wsl";

export default defineConfig({
	server: {
		open: true,
	},
	integrations: [relativeLinks()],

	vite: {
		server: {
			watch: {
				usePolling: isWsl,
			},
		},
	},
});
