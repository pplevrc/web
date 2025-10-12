import { USE_CACHE, USE_MOCK } from "@lib/utils/env";
import type { Loader } from "astro/loaders";
import { createMockCasts } from "./__mock__";
import { fetchCastsFromApi } from "./internals/remote";
import { type Cast, castSchema } from "./types";

/**
 * updatedAt のフォーマットは "2025-10-05 08:23:30 JST" のようになっている
 */
function formatToDate(date: string): Date {
  // "2025-10-05 08:23:30 JST" -> Date オブジェクトに変換
  // JST は UTC+9 なので、ISO 8601 形式に変換してパース
  const jstPattern =
    /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})\s+JST$/;
  const match = date.match(jstPattern);

  if (!match) {
    // フォーマットが異なる場合は従来通りのパース
    return new Date(date);
  }

  const [, year, month, day, hour, minute, second] = match;
  // ISO 8601 形式に変換 (JST = UTC+9)
  const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}+09:00`;
  return new Date(isoString);
}

/**
 *
 * @param casts
 * @returns
 */
function extractLastUpdatedDateByData(casts: Cast[]): Date {
  return casts.reduce((max, cast) => {
    const updatedAt = formatToDate(cast.updatedAt);
    return updatedAt > max ? updatedAt : max;
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
        meta.delete("last-updated-at");
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
        lastUpdatedAt.getTime() > (currentUpdatedAt?.getTime() ?? 0);

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
