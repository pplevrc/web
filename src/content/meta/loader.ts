import { USE_CACHE, USE_MOCK } from "@lib/utils/env";
import type { Loader } from "astro/loaders";
import { getMockMeta } from "./__mock__/meta";
import { fetchMeta, hasUpdatedSince } from "./internals/remote";
import { metaSchema } from "./types";

const COMMON_DATA_ID = "_";

/**
 *
 */
export function metaLoader(): Loader {
  if (USE_MOCK) {
    return {
      name: "meta-mock",
      schema: metaSchema,
      load: async ({ store, parseData, generateDigest }) => {
        store.clear();
        const meta = getMockMeta();

        const data = await parseData({
          id: COMMON_DATA_ID,
          data: meta as unknown as Record<string, unknown>,
        });
        const digest = generateDigest({
          update: meta.updatedAt,
          create: meta.publishedAt,
        });
        store.set({ id: COMMON_DATA_ID, data, digest });
      },
    };
  }

  return {
    name: "meta",
    schema: metaSchema,
    load: async ({ store, parseData, generateDigest, logger, meta }) => {
      if (!USE_CACHE) {
        logger.info("Clear meta data store");
        store.clear();
        meta.delete("last-updated-at");
      }

      const currentUpdatedAt = (() => {
        const lastUpdatedAt = meta.get("last-updated-at");
        if (!lastUpdatedAt) {
          return undefined;
        }
        return new Date(lastUpdatedAt);
      })();

      if (!(await hasUpdatedSince(currentUpdatedAt, logger))) {
        logger.info("No new meta found");
        return;
      }

      logger.info("Fetching meta data");
      const metadata = await fetchMeta(logger);

      const data = await parseData({
        id: COMMON_DATA_ID,
        data: metadata as unknown as Record<string, unknown>,
      });

      const digest = generateDigest({
        update: metadata.updatedAt,
        create: metadata.publishedAt,
      });

      if (
        !store.has(COMMON_DATA_ID) ||
        store.get(COMMON_DATA_ID)?.digest !== digest
      ) {
        logger.info(`Update meta data: ${COMMON_DATA_ID}`);
      }

      store.set({ id: COMMON_DATA_ID, data, digest });
    },
  };
}
