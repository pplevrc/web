import { defineCollection } from "astro:content";
import { articleLoader, articleSchema } from "@content/articles";
import { castLoader, castSchema } from "@content/casts";

export const collections = {
  casts: defineCollection({
    schema: castSchema,
    loader: castLoader(),
  }),

  articles: defineCollection({
    schema: articleSchema,
    loader: articleLoader(),
  }),
};
