// .env は astro 設定ファイルでは読まれないので, 手動で読み込ませる
// @see https://docs.astro.build/ja/guides/environment-variables/
import "dotenv/config";

import sitemap from "@astrojs/sitemap";
import type { AstroUserConfig } from "astro";
import { defineConfig } from "astro/config";
import { defu } from "defu";
import isWsl from "is-wsl";
import { purgeInlineCss } from "./scripts/cleanup/purge-inline-css.js";
import { renameRemoteImages } from "./scripts/cleanup/rename-remote-images.js";
import { ghostFile, videoMediaInfoPlugin } from "./scripts/rollup/index.js";
import { imageProxy } from "./scripts/server/image-proxy/index.js";

const IS_PRODUCTION = process.env["NODE_ENV"] === "production";

const SITE_DOMAIN = ensureNonNil(
  process.env["SITE_DOMAIN"],
  "SITE_DOMAIN is required",
);

const SITE_BASE = process.env["SITE_BASE"] ?? "";

const USE_MOCK = process.env["MOCK"] === "true";

/**
 * 文字数分 * で埋める
 */
function mask(value: string): string {
  return "*".repeat(value.length);
}

console.log("Environments", {
  NODE_ENV: process.env["NODE_ENV"],
  SITE_DOMAIN: process.env["SITE_DOMAIN"],
  SITE_BASE: process.env["SITE_BASE"],
  GTM_ID: mask(process.env["GTM_ID"] ?? ""),
  MOCK: process.env["MOCK"] !== "false",
  FETCH_CONTENT_FORCE: process.env["FETCH_CONTENT_FORCE"] === "true",
  SITE_IS_PUBLIC: process.env["SITE_IS_PUBLIC"] === "true",
  CONTENTS_API_KEY: mask(process.env["CONTENTS_API_KEY"] ?? ""),
  CONTENTS_SERVICE_ID: mask(process.env["CONTENTS_SERVICE_ID"] ?? ""),
  CONTENTS_CASTS_URL: mask(process.env["CONTENTS_CASTS_URL"] ?? ""),
  CONTENTS_CASTS_API_KEY: mask(process.env["CONTENTS_CASTS_API_KEY"] ?? ""),
});

function ensureNonNil<T>(value: T | undefined | null, message: string): T {
  if (value === undefined || value === null) {
    throw new Error(message);
  }
  return value;
}

function byEnv<T>({
  $development,
  $production,
  ...rest
}: { $development?: T; $production?: T } & T): T {
  return defu(
    IS_PRODUCTION ? ($production ?? {}) : ($development ?? {}),
    rest,
  ) as T;
}

export default defineConfig(
  byEnv<AstroUserConfig>({
    output: "static",
    site: `https://${SITE_DOMAIN}`,
    base: SITE_BASE,
    publicDir: USE_MOCK ? "public-mock" : "public",
    integrations: [imageProxy()],
    image: {
      service: {
        entrypoint: "./src/lib/services/custom-sharp.ts",
      },
    },

    vite: {
      css: {
        transformer: "lightningcss",
      },
      build: {
        rollupOptions: {
          plugins: [videoMediaInfoPlugin()],
        },
      },
    },
    cacheDir: USE_MOCK ? "./.cache-mock" : "./.cache",

    /**
     * 本番モード専用オプション
     */
    $production: {
      integrations: [
        purgeInlineCss(),
        sitemap({
          filter: (page) => !page.includes("internals/"),
        }),
        renameRemoteImages(),
      ],

      image: {
        responsiveStyles: true,
        remotePatterns: [
          {
            hostname: "images.microcms-assets.io",
          },
          {
            hostname: "drive.google.com",
          },
        ],
      },

      build: {
        inlineStylesheets: "always",
        assets: "_assets",
      },

      vite: {
        build: {
          cssMinify: "lightningcss",
          rollupOptions: {
            output: {
              assetFileNames: "_assets/[hash].[ext]",
            },
            plugins: [
              ghostFile((id: string) => id.includes(".generated.dev.")),
            ],
          },
        },
      },
    } satisfies AstroUserConfig,

    /**
     * 開発モード専用オプション
     */
    $development: {
      vite: {
        build: {
          rollupOptions: {
            plugins: [
              ghostFile(
                (id: string) =>
                  id.includes(".generated") && !id.includes(".dev."),
              ),
            ],
          },
        },

        server: {
          watch: {
            usePolling: isWsl,
          },
          allowedHosts: [".ngrok-free.app"],
        },
      },
    } satisfies AstroUserConfig,
  }),
);
