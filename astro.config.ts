import { defineConfig } from "astro/config";
import isWsl from "is-wsl";
import { purgeInlineCss } from "./lib/cleanup/purge-inline-css";

export default defineConfig({
  output: "static",
  image: {
    service: {
      entrypoint: "./src/lib/services/custom-sharp.ts",
    },
  },
  integrations: [purgeInlineCss()],

  build: {
    inlineStylesheets: "always",
  },

  experimental: {
    responsiveImages: true,
  },

  vite: {
    // only build mode
    css: {
      transformer: "lightningcss",
    },
    build: {
      cssMinify: "lightningcss",
      rollupOptions: {
        output: {
          assetFileNames: "_assets/[hash].[ext]",
        },
      },
    },

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
