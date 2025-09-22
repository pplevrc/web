import { defineCollection } from "astro:content";
import { articleLoader, articleSchema } from "@content/articles";
import { castLoader, castSchema } from "@content/casts";
import { guidelineLoader, guidelineSchema } from "@content/guidelines";
import { metaLoader, metaSchema } from "@content/meta";

export const collections = {
  casts: defineCollection({
    schema: castSchema,
    loader: castLoader(),
  }),

  articles: defineCollection({
    schema: articleSchema,
    loader: articleLoader(),
  }),

  guidelines: defineCollection({
    schema: guidelineSchema,
    loader: guidelineLoader(),
  }),

  meta: defineCollection({
    schema: metaSchema,
    loader: metaLoader(),
  }),
};
