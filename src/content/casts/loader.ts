import { USE_MOCK } from "@lib/utils/env";
import type { Loader } from "astro/loaders";
import { fetchCastsFromApi } from "./internals/remote";

import { createMockCasts } from "./__mock__";
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
    name: "casts",
    schema: castSchema,
    load: async ({
      store,
      logger,
      parseData,
      generateDigest,
    }): Promise<void> => {
      // TODO: cast content api 側で, 最後に更新された日時だけを返す仕組みが必要
      store.clear();
      logger.info("Fetching cast datas");

      const casts = await fetchCastsFromApi();

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
