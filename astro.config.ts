import type { AstroUserConfig } from "astro";
import { defineConfig } from "astro/config";
import { defu } from "defu";
import isWsl from "is-wsl";
import { purgeInlineCss } from "./lib/cleanup/purge-inline-css.js";

const isDev = process.env["NODE_ENV"] === "development";

function byEnv<T>({
  $development,
  $production,
  ...rest
}: { $development?: T; $production?: T } & T): T {
  return defu(isDev ? ($development ?? {}) : ($production ?? {}), rest) as T;
}

export default defineConfig(
  byEnv<AstroUserConfig>({
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
      css: {
        transformer: "lightningcss",
      },
    },
    cacheDir: "./.cache",

    $production: {
      integrations: [purgeInlineCss()],

      build: {
        inlineStylesheets: "always",
      },

      vite: {
        build: {
          cssMinify: "lightningcss",
          rollupOptions: {
            output: {
              assetFileNames: "_assets/[hash].[ext]",
            },
          },
        },
      },
    },

    $development: {
      vite: {
        server: {
          watch: {
            usePolling: isWsl,
          },
          allowedHosts: [".ngrok-free.app"],
        },
      },
    },
  }),
);
