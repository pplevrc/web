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
    // only dev mode
    server: {
      watch: {
        usePolling: isWsl,
      },
      allowedHosts: [".ngrok-free.app"],
    },
  },

  cacheDir: "./.cache",
});
