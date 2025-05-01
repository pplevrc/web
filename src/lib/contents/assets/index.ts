import { memoize } from "@lib/utils/cache";
import type { ImageMetadata } from "astro";
import { getMockHeaderImage } from "./__mock__";

export type HeaderPageType = "casts" | "articles" | "guidelines" | "staffs";

export const fetchPageHeaderImage = memoize(
  async (type: HeaderPageType): Promise<ImageMetadata> => {
    return getMockHeaderImage(type);
  },
);
