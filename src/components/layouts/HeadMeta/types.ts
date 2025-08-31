import type { ImageMetadata } from "astro";

export interface DescriptionMetaProps {
  title: string;
  description: string;
  keywords: string[];

  ogp?: ImageMetadata | string;
}
