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
            plugins: [
              // .dev. がファイル名に含まれるファイルが存在しなくてもエラーにせず、バンドルを回避する. 基本的には undefined を返す
              // e.g. `@assets/videos/top-pc.generated.dev.h264.mp4` → undefined を返す
              {
                name: "virtual-dev-assets",
                resolveId(source) {
                  if (source.includes(".dev.")) {
                    return `\0virtual:${source}`;
                  }
                  return null;
                },
                load(id) {
                  if (id.startsWith("\0virtual:")) {
                    return "export default undefined";
                  }
                  return null;
                },
              },
            ],
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
