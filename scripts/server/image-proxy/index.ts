import type { AstroIntegration } from "astro";
import { defu } from "defu";
import type { SetupServerApi } from "msw/node";
import { createImageProxyServer } from "./server.js";
import { defaultOption, type ImageProxyOptions } from "./type.js";

/**
 * Astro Integration [Image Proxy]
 * 画像の取得先の API 側で, 本来キャッシュすべき画像であるにもかかわらず, Etag や Cache Control に関する Response Header が適切に付与されていないケースがある.
 * この Integration は, 画像の取得先の API 側の Response Header をパッチすることで, 画像のキャッシュを有効にするためのものである.
 */
export function imageProxy(option: ImageProxyOptions = {}): AstroIntegration {
  const fixedOption = defu(option, defaultOption);
  let server: SetupServerApi | null = null;
  return {
    name: "image-proxy",
    hooks: {
      "astro:config:setup"(context) {
        context.logger.info("Image Proxy integration loaded");
      },
      async "astro:server:setup"({ logger }) {
        logger.info("Image Proxy server setup");
        try {
          server =
            server ?? (await createImageProxyServer(fixedOption, logger));
        } catch (error) {
          logger.error(`Failed to create proxy server: ${error}`);
          throw error;
        }
      },
      async "astro:build:start"({ logger }) {
        logger.info("Image Proxy server setup");
        try {
          server =
            server ?? (await createImageProxyServer(fixedOption, logger));
        } catch (error) {
          logger.error(`Failed to create proxy server: ${error}`);
          throw error;
        }
      },
      async "astro:server:done"({ logger }) {
        logger.info("Image Proxy server done");
        if (!server) {
          return;
        }

        try {
          await server.close();
          server = null;
        } catch (error) {
          logger.error(`Failed to close proxy server: ${error}`);
          throw error;
        }
      },
      async "astro:build:done"({ logger }) {
        logger.info("Image Proxy server done");
        if (!server) {
          return;
        }

        try {
          await server.close();
          server = null;
        } catch (error) {
          logger.error(`Failed to close proxy server: ${error}`);
          throw error;
        }
      },
    },
  };
}
