import { USE_CACHE, USE_MOCK } from "@lib/utils/env";
import type { Loader } from "astro/loaders";
import { createMockCasts } from "./__mock__";
import { fetchCastsSince, hasNewCastsSince } from "./internals/remote";
import { castSchema } from "./types";

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
    // データ保存先を更新するたびに末尾の番号を更新し、キャッシュの再利用性を回避する
    name: "casts-2",
    schema: castSchema,
    load: async ({
      store,
      logger,
      parseData,
      generateDigest,
      meta,
    }): Promise<void> => {
      if (!USE_CACHE) {
        logger.info("Clear cast data store");
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

      if (!(await hasNewCastsSince(currentUpdatedAt, logger))) {
        logger.info("No new casts found");
        return;
      }

      logger.info("Fetching new casts");
      const casts = await fetchCastsSince(currentUpdatedAt, logger);

      // CMS側で削除されたキャストの検出と削除処理 (Guideline同様、現状は手動キャッシュクリアが必要)

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
