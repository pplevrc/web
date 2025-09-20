import { createHash } from "node:crypto";
import type { ColorThemeBase } from "@lib/contents/commons/ColorToken";
import { memoize } from "@lib/utils/cache";
import { USE_MOCK } from "@lib/utils/env";
import {
  type MicroCMSArticle,
  fetchContent,
  fetchContents,
} from "@lib/utils/microcms";
import { ensureNonNil } from "@lib/utils/type";
import type { ContentMeta, PageMeta } from "../meta";
import { getMockArticles } from "./__mock__/";

const LIST_LIMIT = 50;

export interface Article extends PageMeta, ContentMeta {
  /**
   * HTML
   */
  content: string;

  /**
   * MicroCMS に依存しない独自の ID
   * 規則: `${published date (YYYY-MM-DD)}-${hash string from title}`
   */
  id: string;

  /**
   *
   */
  contentId: string;

  /**
   *
   */
  thumbnailDisplayAlt: string;

  /**
   *
   */
  themeColor: ColorThemeBase;
}

/**
 *
 */
export type ArticleMeta = Omit<Article, "content">;

/**
 *
 * @param microCMSArticle
 * @returns
 */
function toId(microCMSArticle: MicroCMSArticle): string {
  const { publishedAt, title } = microCMSArticle;

  const publishedDate = new Date(publishedAt).toISOString().split("T")[0];

  const hash = createHash("sha256").update(title).digest("hex");

  return `${publishedDate}-${hash}`;
}

/**
 *
 * @param microCMSArticle
 * @returns
 */
function convertMicroCMSArticleToArticle(
  microCMSArticle: MicroCMSArticle,
): Article {
  const {
    id,
    title,
    description,
    keywords,
    publishedAt,
    updatedAt,
    content,
    "hero-image": heroImage,
    "hero-iamge-label": heroImageLabel,
    "theme-color": themeColor,
  } = microCMSArticle;

  return {
    contentId: id,
    id: toId(microCMSArticle),
    title,
    description,
    keywords: (keywords ?? "").split(",").filter((k) => k.length > 0),
    themeColor,
    publishedAt: new Date(publishedAt),
    updatedAt: new Date(updatedAt),
    content,
    thumbnail: heroImage.url,
    thumbnailDisplayAlt: heroImageLabel,
  };
}

/**
 *
 * @returns
 */
async function fetchArticlesMeta(): Promise<ArticleMeta[]> {
  let results: ArticleMeta[] = [];
  let offset = 0;

  while (true) {
    const response = await fetchContents("articles", {
      query: {
        fields: [
          "id",
          "title",
          "description",
          "keywords",
          "hero-image",
          "theme-color",
          "publishedAt",
          "updatedAt",
          "hero-image",
          "hero-image-alt",
          "hero-iamge-label",
        ],
      },
    });

    results = [
      ...results,
      ...response.contents.map(
        (c) => convertMicroCMSArticleToArticle(c) as ArticleMeta,
      ),
    ];

    if (response.totalCount <= offset + LIST_LIMIT) {
      break;
    }

    offset += LIST_LIMIT;
  }

  return results;
}

/**
 *
 */
export const fetchArticles = memoize(async (): Promise<ArticleMeta[]> => {
  if (USE_MOCK) {
    return getMockArticles();
  }
  return fetchArticlesMeta();
});

/**
 *
 * @param id
 * @returns
 */
async function fetchArticleByContentId(id: string): Promise<Article> {
  if (USE_MOCK) {
    const articles = await getMockArticles();
    return ensureNonNil(articles.find((article) => article.contentId === id));
  }

  const article = await fetchContent("articles", id);
  return convertMicroCMSArticleToArticle(article);
}

/**
 *
 */
export const fetchArticleById = memoize(
  async (id: string): Promise<Article> => {
    const articleMetas = await fetchArticles();

    const articleMeta = articleMetas.find((article) => article.id === id);

    if (!articleMeta) {
      throw new Error(`Article not found: ${id}`);
    }

    return fetchArticleByContentId(articleMeta.contentId);
  },
);

/**
 *
 */
export const fetchArticleIds = memoize(async (): Promise<string[]> => {
  const articles = await fetchArticles();

  return articles.map((article) => article.id);
});

/**
 * 4 件のみ
 */
export const fetchNewArticles = memoize(async (): Promise<ArticleMeta[]> => {
  const articles = await fetchArticles();

  return articles.slice(0, 4);
});
