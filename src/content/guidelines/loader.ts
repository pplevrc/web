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
      const currentUpdatedAt = (() => {
        const lastUpdatedAt = meta.get("last-updated-at");
        if (!lastUpdatedAt) {
          return undefined;
        }
        return new Date(lastUpdatedAt);
      })();

      if (USE_CACHE && !(await hasNewGuidelinesSince(currentUpdatedAt))) {
        logger.info("No new guidelines found");
        return;
      }

      logger.info("Fetching new guidelines");
      const guidelines = await fetchGuidelinesSince(currentUpdatedAt);

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

        logger.info(
          store.get(id)
            ? `Update guideline data: ${guideline.title}`
            : `Set new guideline data: ${guideline.title}`,
        );

        store.set({ id, data, digest });
      }

      const newLastUpdatedAt = new Date().toISOString();
      logger.info(`Set Metadata [last-updated-at]: ${newLastUpdatedAt}`);
      meta.set("last-updated-at", newLastUpdatedAt);
    },
  };
}
