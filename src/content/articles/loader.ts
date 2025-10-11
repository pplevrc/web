import { createHash } from "node:crypto";
import { USE_CACHE, USE_MOCK } from "@lib/utils/env";
import type { Loader } from "astro/loaders";
import { getMockArticles } from "./__mock__";
import { fetchArticlesSince, hasNewArticlesSince } from "./internals/remote";
import { type Article, articleSchema } from "./types";

/**
 *
 * @returns
 */
export function articleLoader(): Loader {
  if (USE_MOCK) {
    return {
      name: "articles-mock",
      schema: articleSchema,
      load: async ({ store, parseData, generateDigest }) => {
        store.clear();
        const articles = await getMockArticles();

        for (const article of articles) {
          const id = toId(article);
          const data = await parseData({
            id,
            data: article as unknown as Record<string, unknown>,
          });
          const digest = generateDigest({
            update: article.updatedAt,
            create: article.publishedAt,
          });

          store.set({ id, data, digest });
        }
      },
    };
  }

  return {
    name: "articles",
    schema: articleSchema,
    load: async ({ meta, parseData, store, generateDigest, logger }) => {
      if (!USE_CACHE) {
        logger.info("Clear article data store");
        store.clear();
      }

      const currentUpdatedAt = (() => {
        const lastUpdatedAt = meta.get("last-updated-at");
        if (!lastUpdatedAt) {
          return undefined;
        }
        return new Date(lastUpdatedAt);
      })();

      if (!(await hasNewArticlesSince(currentUpdatedAt))) {
        logger.info("No new articles found");
        return;
      }

      logger.info("Fetching new articles");

      const articles = await fetchArticlesSince(currentUpdatedAt);

      const cachedIds = store.keys();

      for (const id of cachedIds) {
        if (!articles.some((article) => toId(article) === id)) {
          store.delete(id);
        }
      }

      for (const article of articles) {
        const id = toId(article);
        const data = await parseData({
          id,
          data: {
            id,
            ...(article as unknown as Record<string, unknown>),
          },
        });

        const digest = generateDigest({
          update: article.updatedAt,
          create: article.publishedAt,
        });

        if (!store.has(id)) {
          logger.info(`Set new article data: ${article.title}`);
        }

        if (store.get(id)?.digest !== digest) {
          logger.info(`Update article data: ${article.title}`);
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

/**
 *
 * @param article
 * @returns
 */
function toId(article: Omit<Article, "id">): string {
  const { publishedAt, title } = article;

  const publishedDate = new Date(publishedAt).toISOString().split("T")[0];

  const hash = createHash("sha256").update(title).digest("hex");

  return `${publishedDate}-${hash}`;
}
