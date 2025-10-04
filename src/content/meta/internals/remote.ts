import { toSocialLink } from "@content/commons";
import type { CMSGuideline } from "@content/guidelines/internals/remote";
import {
  fetchObject,
  type MicroCMSImage,
  type MicroCMSObjectContentBase,
} from "@lib/utils/microcms";
import { ensureNonNil } from "@lib/utils/type";
import type { Meta } from "../types";

/**
 *
 */
interface CMSPageMeta {
  /**
   *
   */
  title: string;

  /**
   *
   */
  backLinkLabel: string;

  /**
   *
   */
  description: string;

  /**
   * comma-separated string
   */
  keywords: string;

  /**
   *
   */
  "hero-image": MicroCMSImage;
}

/**
 *
 */
interface CMSContentPageMeta {
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
  keywords: string;
}

/**
 *
 */
interface CMSSocialLink {
  /**
   *
   */
  url: string;

  /**
   *
   */
  description: string;
}

/**
 *
 */
export interface CMSMeta extends MicroCMSObjectContentBase {
  /**
   *
   */
  "guidelines-shortcut": CMSGuideline[];

  /**
   * comma-separated string
   */
  "common-keywords": string;

  /**
   *
   */
  copyright: string;

  /**
   *
   */
  home: CMSPageMeta;

  /**
   * replace `{nickname}` to cast's nickname
   */
  cast: CMSContentPageMeta;

  /**
   *
   */
  casts: CMSPageMeta;

  /**
   *
   */
  article: CMSContentPageMeta;

  /**
   *
   */
  articles: CMSPageMeta;

  /**
   *
   */
  guideline: CMSContentPageMeta;

  /**
   *
   */
  guidelines: CMSPageMeta;

  /**
   *
   */
  "social-links": CMSSocialLink[];
}

async function convertCMSMetaToMeta(microCMSMeta: CMSMeta): Promise<Meta> {
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
    publishedAt,
    updatedAt,
  };
}

/**
 *
 * @param date
 * @returns
 */
export async function hasUpdatedSince(date?: Date): Promise<boolean> {
  if (!date) {
    return true;
  }

  const latestUpdatedAt = await fetchLatestUpdatedAt();
  return latestUpdatedAt > date;
}

/**
 *
 * @returns
 */
export async function fetchMeta(): Promise<Meta> {
  const result = await fetchObject<CMSMeta>("meta", {
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
  return convertCMSMetaToMeta(result);
}

/**
 *
 * @returns
 */
async function fetchLatestUpdatedAt(): Promise<Date> {
  const result = await fetchObject<CMSMeta>("meta", {
    query: {
      fields: ["updatedAt"],
    },
  });

  const date = result.updatedAt;

  if (!date) {
    throw new Error("Latest updated at not found");
  }

  return new Date(date);
}
