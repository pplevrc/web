import { memoize } from "@lib/utils/cache";
import type { ImageMetadata } from "astro";
import { getMockThumbnailImage } from "./__mock__";

export type PageThumbnailType =
  | "home"
  | "casts"
  | "articles"
  | "guidelines"
  | "staffs"
  | "article";

export const fetchPageThumbnailImage = memoize(
  async (type: PageThumbnailType): Promise<ImageMetadata> => {
    return getMockThumbnailImage(type);
  },
);
