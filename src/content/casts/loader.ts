import { USE_CACHE, USE_MOCK } from "@lib/utils/env";
import type { Loader } from "astro/loaders";
import { createMockCasts } from "./__mock__";
import { fetchCastsFromApi } from "./internals/remote";
import { type Cast, castSchema } from "./types";

/**
 *
 * @param casts
 * @returns
 */
function extractLastUpdatedDateByData(casts: Cast[]): Date {
  return casts.reduce((max, cast) => {
    return new Date(cast.updatedAt) > max ? new Date(cast.updatedAt) : max;
  }, new Date(0));
}

/**
 *
 */
export function castLoader(): Loader {
  if (USE_MOCK) {
    return {
      name: "casts-mock",
      schema: castSchema,
      load: async ({ store, parseData, generateDigest }) => {
        const casts = createMockCasts();
        for (const cast of casts) {
          const id = cast.profile.nickname;
          const data = await parseData({ id, data: cast });
          const digest = generateDigest({
            update: cast.createdAt,
            create: cast.updatedAt,
          });
          store.set({ id, data, digest });
        }
      },
    };
  }

  return {
    name: "casts",
    schema: castSchema,
    load: async ({
      store,
      logger,
      parseData,
      generateDigest,
      meta,
    }): Promise<void> => {
      logger.info("Fetching cast datas");

      if (!USE_CACHE) {
        logger.info("Clear cast data store");
        store.clear();
      }

      const currentUpdatedAt = (() => {
        const lastUpdatedAt = meta.get("last-updated-at");
        if (!lastUpdatedAt) {
          return undefined;
        }
        return new Date(lastUpdatedAt);
      })();

      const casts = await fetchCastsFromApi();

      const lastUpdatedAt = extractLastUpdatedDateByData(casts);

      const hasUpdate =
        currentUpdatedAt?.getTime() ?? 0 > lastUpdatedAt.getTime();

      if (!hasUpdate) {
        logger.info("No new casts found");
        return;
      }

      const cachedIds = store.keys();

      for (const id of cachedIds) {
        if (!casts.some((cast) => cast.profile.nickname === id)) {
          store.delete(id);
        }
      }

      for (const cast of casts) {
        const id = cast.profile.nickname;

        const data = await parseData({
          id,
          data: cast as unknown as Record<string, unknown>,
        });

        const digest = generateDigest({
          update: cast.createdAt,
          create: cast.updatedAt,
        });

        if (!store.has(id)) {
          logger.info(`Set new cast data: ${id}`);
        }

        if (store.get(id)?.digest !== digest) {
          logger.info(`Update cast data: ${id}`);
        }

        store.set({
          id,
          data,
          digest,
        });
      }

      const newLastUpdatedAt = new Date().toISOString();
      logger.info(`Set Metadata [last-updated-at]: ${newLastUpdatedAt}`);
      meta.set("last-updated-at", newLastUpdatedAt);
    },
  };
}
