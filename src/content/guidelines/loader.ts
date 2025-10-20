import { USE_CACHE, USE_MOCK } from "@lib/utils/env";
import type { Loader } from "astro/loaders";
import { getMockGuidelines } from "./__mock__";
import {
  fetchGuidelinesSince,
  hasNewGuidelinesSince,
} from "./internals/remote";
import { guidelineSchema } from "./types";

/**
 *
 */
export function guidelineLoader(): Loader {
  if (USE_MOCK) {
    return {
      name: "guidelines-mock",
      schema: guidelineSchema,
      load: async ({ store, parseData, generateDigest }) => {
        store.clear();

        const guidelines = await getMockGuidelines();
        for (const guideline of guidelines) {
          const id = guideline.title;
          const data = await parseData({
            id,
            data: {
              ...guideline,
              id,
            },
          });
          const digest = generateDigest({
            update: guideline.updatedAt,
            create: guideline.publishedAt,
          });
          store.set({ id, data, digest });
        }
      },
    };
  }

  return {
    name: "guidelines",
    schema: guidelineSchema,
    load: async ({ meta, parseData, store, generateDigest, logger }) => {
      if (!USE_CACHE) {
        logger.info("Clear guideline data store");
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

      if (!(await hasNewGuidelinesSince(currentUpdatedAt, logger))) {
        logger.info("No new guidelines found");
        return;
      }

      logger.info("Fetching new guidelines");
      const guidelines = await fetchGuidelinesSince(currentUpdatedAt, logger);

      // TODO: CMS側で削除されたガイドラインの検出と削除処理を実装する
      // CMSの削除API (beta) を使用して、削除されたコンテンツを取得し、
      // キャッシュから削除する処理を追加する必要がある
      // 現状は削除時に手動でキャッシュクリア (FETCH_CONTENT_FORCE=true) が必要

      for (const guideline of guidelines) {
        const id = guideline.title;
        const data = await parseData({
          id,
          data: {
            ...guideline,
            id,
          },
        });

        const digest = generateDigest({
          update: guideline.updatedAt,
          create: guideline.publishedAt,
        });

        if (!store.has(id)) {
          logger.info(`Set new guideline data: ${id}`);
        }

        if (store.get(id)?.digest !== digest) {
          logger.info(`Update guideline data: ${id}`);
        }

        store.set({ id, data, digest });
      }

      const newLastUpdatedAt = new Date().toISOString();
      logger.info(`Set Metadata [last-updated-at]: ${newLastUpdatedAt}`);
      meta.set("last-updated-at", newLastUpdatedAt);
    },
  };
}
