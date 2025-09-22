import { z } from "astro:schema";
import {
  type SocialLink,
  colorBaseThemeSchema,
  socialLinkSchema,
} from "@content/commons";
import type { Guideline } from "@content/guidelines";
import { schemaForType } from "@lib/utils/type";

/**
 * コンテンツ一覧ページのメタ情報
 */
export interface ListPageMeta {
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
  thumbnail: string;

  /**
   *
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
  publishedAt: string;

  /**
   *
   */
  updatedAt: string;
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
  guidelines: ListPageMeta;

  /**
   *
   */
  article: ContentPageMeta;

  /**
   *
   */
  articles: ListPageMeta;

  /**
   *
   */
  cast: ContentPageMeta;

  /**
   *
   */
  casts: ListPageMeta;

  /**
   *
   */
  home: ListPageMeta;
}

const contentPageMetaSchema = schemaForType<ContentPageMeta>(
  z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
  }),
);

const listPageMetaSchema = schemaForType<ListPageMeta>(
  z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    thumbnail: z.string(),
    backLinkLabel: z.string(),
  }),
);

export const metaSchema = z.object({
  guidelinesShortcut: z.array(
    z.object({
      title: z.string(),
      themeColor: colorBaseThemeSchema,
    }),
  ),
  commonKeywords: z.array(z.string()),
  official: z.object({
    socialLinks: z.array(socialLinkSchema),
    copyright: z.string(),
  }),
  guideline: contentPageMetaSchema,
  guidelines: listPageMetaSchema,
  article: contentPageMetaSchema,
  articles: listPageMetaSchema,
  cast: contentPageMetaSchema,
  casts: listPageMetaSchema,
  home: listPageMetaSchema,
  publishedAt: z.string(),
  updatedAt: z.string(),
});
