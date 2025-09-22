import { z } from "astro:schema";
import { type ColorThemeBase, colorBaseThemeSchema } from "@content/commons";
import { schemaForType } from "@lib/utils/type";

export interface Article {
  /**
   *
   */
  id: string;

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
  thumbnailAlt: string;

  /**
   *
   */
  thumbnailLabel?: string | null | undefined;

  /**
   * HTML
   */
  content: string;

  /**
   *
   */
  contentId: string;

  /**
   *
   */
  themeColor: ColorThemeBase;

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
export type ArticleMeta = Omit<Article, "content">;

export const articleSchema = schemaForType<Article>(
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    thumbnail: z.string(),
    thumbnailAlt: z.string(),
    thumbnailLabel: z.string().optional(),
    content: z.string(),
    contentId: z.string(),
    themeColor: colorBaseThemeSchema,
    publishedAt: z.string(),
    updatedAt: z.string(),
  }),
);
