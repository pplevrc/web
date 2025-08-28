import type { Guideline } from "../guildelines";

export interface PageMeta {
  /**
   * ページのタイトル (<title> タグではない)
   */
  title: string;

  /**
   * ページの説明
   */
  description: string;

  /**
   *
   */
  keywords: string[];

  /**
   *
   */
  thumbnail: ImageMetadata | string;

  /**
   *
   */
  thumbnailAlt: string;

  /**
   *
   */
  publishedAt: Date;

  /**
   *
   */
  updatedAt: Date;
}

export interface TopPageMeta extends PageMeta {
  guidelineShortcuts: Omit<Guideline, "content">[];
}

export interface Meta {
  guidelinesPageMeta: PageMeta;

  articlesPageMeta: PageMeta;

  topPageMeta: TopPageMeta;

  commonKeywords: string[];
}
