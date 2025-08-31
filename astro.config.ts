// .env は astro 設定ファイルでは読まれないので, 手動で読み込ませる
// @see https://docs.astro.build/ja/guides/environment-variables/
import "dotenv/config";

import sitemap from "@astrojs/sitemap";
import type { AstroUserConfig } from "astro";
import { defineConfig } from "astro/config";
import { defu } from "defu";
import isWsl from "is-wsl";
import type { Plugin as RollupPlugin } from "rollup";
import { purgeInlineCss } from "./lib/cleanup/purge-inline-css.js";

const IS_PRODUCTION = process.env["NODE_ENV"] === "production";

const SITE_DOMAIN = ensureNonNil(
  process.env["SITE_DOMAIN"],
  "SITE_DOMAIN is required",
);

/**
 * 文字数分 * で埋める
 */
function mask(value: string): string {
  return "*".repeat(value.length);
}

console.log("Environments", {
  NODE_ENV: process.env["NODE_ENV"],
  SITE_DOMAIN: process.env["SITE_DOMAIN"],
  MOCK: process.env["MOCK"] !== "false",
  SITE_IS_PUBLIC: process.env["SITE_IS_PUBLIC"] === "true",
  CONTENTS_API_KEY: mask(process.env["CONTENTS_API_KEY"] ?? ""),
  CONTENTS_SERVICE_ID: mask(process.env["CONTENTS_SERVICE_ID"] ?? ""),
});

/**
 *
 * .dev. がファイル名に含まれるファイルが存在しなくてもエラーにせず、バンドルを回避する. 基本的には undefined を返す
 * e.g. `@assets/videos/top-pc.generated.dev.h264.mp4` → undefined を返す
 */
const virtualDevAssets = (): RollupPlugin => ({
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
    image: {
      service: {
        entrypoint: "./src/lib/services/custom-sharp.ts",
      },
    },

    vite: {
      css: {
        transformer: "lightningcss",
      },
    },
    cacheDir: "./.cache",

    /**
     * 本番モード専用オプション
     */
    $production: {
      integrations: [purgeInlineCss(), sitemap()],

      image: {
        remotePatterns: [
          {
            hostname: "images.microcms-assets.io",
          },
        ],
      },

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
            plugins: [virtualDevAssets()],
          },
        },
      },
    },

    /**
     * 開発モード専用オプション
     */
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
