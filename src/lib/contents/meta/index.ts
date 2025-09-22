import type { Guideline } from "@content/guidelines";
import { memoize } from "@lib/utils/cache";
import { USE_MOCK } from "@lib/utils/env";
import { type MicroCMSMeta, fetchObject } from "@lib/utils/microcms";
import { ensureNonNil } from "@lib/utils/type";
import { type SocialLink, toSocialLink } from "../commons/SocialLink";
import { getMockMeta } from "./__mock__/meta";

/**
 * 共通のページメタ情報
 */
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
}

/**
 * 一覧ページのメタ情報
 */
export interface IndexedPageMeta extends PageMeta {
  /**
   * そのページに戻るラベルのテキスト
   */
  backLinkLabel: string;
}

/**
 * コンテンツページ (一覧の先) のメタ情報
 */
export interface ContentPageMeta {
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
}

/**
 *
 */
export interface ContentMeta {
  /**
   *
   */
  publishedAt: Date;

  /**
   *
   */
  updatedAt: Date;
}

/**
 *
 */
export interface Meta extends ContentMeta {
  /**
   *
   */
  guidelinesShortcut: Pick<Guideline, "title" | "themeColor">[];

  /**
   *
   */
  commonKeywords: string[];

  /**
   *
   */
  official: {
    /**
     * ソーシャルリンク集
     */
    socialLinks: SocialLink[];

    /**
     * コピーライト
     */
    copyright: string;
  };

  /**
   *
   */
  guideline: ContentPageMeta;

  /**
   *
   */
  guidelines: IndexedPageMeta;

  /**
   *
   */
  article: ContentPageMeta;

  /**
   *
   */
  articles: IndexedPageMeta;

  /**
   *
   */
  cast: ContentPageMeta;

  /**
   *
   */
  casts: IndexedPageMeta;

  /**
   *
   */
  home: IndexedPageMeta;
}

async function convertMicroCMSMetaToMeta(
  microCMSMeta: MicroCMSMeta,
): Promise<Meta> {
  const {
    "guidelines-shortcut": guidelinesShortcut,
    "common-keywords": commonKeywords,
    "social-links": socialLinks,
    home,
    article,
    articles,
    guideline,
    guidelines,
    cast,
    casts,
    publishedAt,
    updatedAt,
    copyright,
  } = microCMSMeta;

  const splitKeywords = (keywords = "") =>
    keywords.split(",").filter((k) => k.length > 0);

  return {
    guidelinesShortcut: guidelinesShortcut.map(
      ({ title, "theme-color": themeColor }) => ({
        title,
        themeColor: ensureNonNil(themeColor[0]),
      }),
    ),
    commonKeywords: splitKeywords(commonKeywords),
    official: {
      socialLinks: await Promise.all(
        socialLinks.map(({ url, description }) =>
          toSocialLink({ url, description }),
        ),
      ),

      copyright,
    },
    home: {
      title: home.title,
      description: home.description,
      backLinkLabel: home.backLinkLabel,
      keywords: splitKeywords(home.keywords),
      thumbnail: home["hero-image"].url,
    },
    cast: {
      title: cast.title,
      keywords: splitKeywords(cast.keywords),
      description: cast.description,
    },
    casts: {
      title: casts.title,
      description: casts.description,
      backLinkLabel: casts.backLinkLabel,
      keywords: splitKeywords(casts.keywords),
      thumbnail: casts["hero-image"].url,
    },
    guideline: {
      title: guideline.title,
      description: guideline.description,
      keywords: splitKeywords(guideline.keywords),
    },
    guidelines: {
      title: guidelines.title,
      description: guidelines.description,
      backLinkLabel: guidelines.backLinkLabel,
      keywords: splitKeywords(guidelines.keywords),
      thumbnail: guidelines["hero-image"].url,
    },
    article: {
      title: article.title,
      description: article.description,
      keywords: splitKeywords(article.keywords),
    },
    articles: {
      title: articles.title,
      description: articles.description,
      backLinkLabel: articles.backLinkLabel,
      keywords: splitKeywords(articles.keywords),
      thumbnail: articles["hero-image"].url,
    },
    publishedAt: new Date(publishedAt),
    updatedAt: new Date(updatedAt),
  };
}

async function fetchMetaFromMicroCMS(): Promise<Meta> {
  const meta = await fetchObject("meta", {
    query: {
      fields: [
        "guidelines-shortcut.title",
        "guidelines-shortcut.theme-color",
        "common-keywords",
        "home",
        "article",
        "articles",
        "guideline",
        "guidelines",
        "cast",
        "casts",
        "copyright",
        "updatedAt",
        "publishedAt",
        "social-links",
      ],
    },
  });
  return convertMicroCMSMetaToMeta(meta);
}

export const fetchMeta = memoize(async (): Promise<Meta> => {
  return USE_MOCK ? getMockMeta() : fetchMetaFromMicroCMS();
});
