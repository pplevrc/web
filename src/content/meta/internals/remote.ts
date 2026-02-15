import { toSocialLink } from "@content/commons";
import { fetchObject } from "@lib/utils/microcms";
import { ensureNonNil } from "@lib/utils/type";
import type { AstroIntegrationLogger } from "astro";
import type { Meta } from "../types";
import type { CMSMeta } from "./cms-type";

/**
 *
 * @param microCMSMeta
 * @returns
 */
async function convertCMSMetaToMeta(microCMSMeta: CMSMeta): Promise<Meta> {
  const {
    "guidelines-shortcut": guidelinesShortcut,
    "privacy-policy": privacyPolicyShortcut,
    "privacy-notice": privacyNotice,
    "cookie-concent": cookieConcent,
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
      privacyPolicyShortcut: {
        title: privacyPolicyShortcut.title,
        themeColor: ensureNonNil(privacyPolicyShortcut["theme-color"][0]),
      },
      privacyNotice,
      cookieConcent,
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
 * @param logger
 * @returns
 */
export async function hasUpdatedSince(
  date: Date | undefined,
  logger: AstroIntegrationLogger,
): Promise<boolean> {
  if (!date) {
    return true;
  }

  const latestUpdatedAt = await fetchLatestUpdatedAt(logger);
  return latestUpdatedAt > date;
}

/**
 *
 * @param logger
 * @returns
 */
export async function fetchMeta(logger: AstroIntegrationLogger): Promise<Meta> {
  const result = await fetchObject<CMSMeta>("meta", {
    query: {
      fields: [
        "guidelines-shortcut.title",
        "guidelines-shortcut.theme-color",
        "privacy-policy.title",
        "privacy-policy.theme-color",
        "privacy-notice",
        "cookie-concent",
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
    logger,
  });
  return convertCMSMetaToMeta(result);
}

/**
 *
 * @param logger
 * @returns
 */
async function fetchLatestUpdatedAt(
  logger: AstroIntegrationLogger,
): Promise<Date> {
  const result = await fetchObject<CMSMeta>("meta", {
    query: {
      fields: ["updatedAt"],
    },
    logger,
  });

  const date = result.updatedAt;

  if (!date) {
    throw new Error("Latest updated at not found");
  }

  return new Date(date);
}
