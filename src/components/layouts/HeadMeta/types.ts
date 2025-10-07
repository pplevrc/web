import type { ImageMetadata } from "astro";
import type { Props as PolyfillProps } from "./internals/Polyfill.astro";

export interface DescriptionMetaProps {
  title: string;
  description: string;
  keywords: string[];

  ogp?: ImageMetadata | string;

  polyfill?: PolyfillProps;
}
