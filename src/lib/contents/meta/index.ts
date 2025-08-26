import type { Guideline } from "../guildelines";

export interface PageMeta {
  title: string;

  description: string;

  keywords: string[];

  thumbnail: ImageMetadata | string;

  thumbnailAlt: string;
}

export interface TopPageMeta extends PageMeta {
  guidelineShortcuts: Pick<Guideline, "title" | "themeColor" | "contnetId">;
}

export interface Meta {
  guidelinesPageMeta: PageMeta;

  articlesPageMeta: PageMeta;

  topPageMeta: TopPageMeta;

  commonKeywords: string[];
}
