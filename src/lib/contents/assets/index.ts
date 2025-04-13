import { memoize } from "@/lib/utils/cache";
import type { ImageMetadata } from "astro";
import { getMockHeaderImage } from "./__mock__";

export type HeaderPageType = "casts";

export const fetchPageHeaderImage = memoize(
  (type: HeaderPageType): ImageMetadata => {
    return getMockHeaderImage(type);
  },
);
