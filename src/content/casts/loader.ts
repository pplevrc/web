import { USE_MOCK } from "@lib/utils/env";
import type { Loader } from "astro/loaders";
import { fetchCastsFromApi } from "./internals/remote";

import { createMockCasts } from "./__mock__";
import { castSchema } from "./types";

/**
 *
 */
export function castLoader(): Loader {
  return {
    name: "casts",
    schema: castSchema,
    load: async ({
      store,
      logger,
      parseData,
      generateDigest,
    }): Promise<void> => {
      store.clear();

      const casts = await (async () => {
        if (USE_MOCK) {
          logger.info("Fetching cast datas (use mock)");
          return createMockCasts();
        }
        logger.info("Fetching cast datas");
        return fetchCastsFromApi();
      })();

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

        store.set({
          id,
          data,
          digest,
        });
      }
    },
  };
}
