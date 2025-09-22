import { defineCollection } from "astro:content";
import { articleLoader, articleSchema } from "@content/articles";
import { castLoader, castSchema } from "@content/casts";
import { guidelineSchema } from "@content/guidelines";
import { guidelineLoader } from "@content/guidelines/loader";

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
};
