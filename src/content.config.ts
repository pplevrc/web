import { defineCollection } from "astro:content";
import { castLoader, castSchema } from "@content/casts";

export const collections = {
  casts: defineCollection({
    schema: castSchema,
    loader: castLoader(),
  }),
};
