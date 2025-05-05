import { memoize } from "@lib/utils/cache";
import type { ImageMetadata } from "astro";
import type { ColorThemeBase } from "../commons/ColorToken";
import { getMockArticles } from "./__mock__/";

export interface Article {
  /**
   * HTML
   */
  content: string;

  /**
   *
   */
  id: string;

  /**
   *
   */
  publishedAt: Date;

  /**
   *
   */
  updatedAt: Date;

  /**
   *
   */
  title: string;

  /**
   *
   */
  description: string;

  /**
   *
   */
  keywords: string[];

  /**
   *
   */
  thumbnail: ImageMetadata;

  /**
   *
   */
  thumbnailAlt: string;

  /**
   *
   */
  thumbnailDisplayAlt: string;

  /**
   *
   */
  themeColor: ColorThemeBase;
}

export const fetchArticles = memoize(async (): Promise<Article[]> => {
  return getMockArticles();
});

export const fetchArticle = memoize(async (id: string): Promise<Article> => {
  const articles = await fetchArticles();

  const article = articles.find((article) => article.id === id);

  if (!article) {
    throw new Error(`Article not found: ${id}`);
  }

  return article;
});

export const fetchArticleIds = memoize(async (): Promise<string[]> => {
  const articles = await fetchArticles();

  return articles.map((article) => article.id);
});

/**
 * 4 件のみ
 */
export const fetchNewArticles = memoize(async (): Promise<Article[]> => {
  const articles = await fetchArticles();

  return articles.slice(0, 4);
});
