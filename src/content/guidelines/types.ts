import { z } from "astro:schema";
import { type ColorThemeBase, colorBaseThemeSchema } from "@content/commons";
import { schemaForType } from "@lib/utils/type";

/**
 *
 */
export type BallonPosition =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

/**
 *
 */
export interface Guideline {
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
  content: string;

  /**
   *
   */
  themeColor: ColorThemeBase;

  /**
   *
   */
  ballonPosition: BallonPosition;

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
export const guidelineSchema = schemaForType<Guideline>(
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    thumbnail: z.string(),
    content: z.string(),
    themeColor: colorBaseThemeSchema,
    ballonPosition: z.enum([
      "topLeft",
      "topRight",
      "bottomLeft",
      "bottomRight",
    ]),
    publishedAt: z.string(),
    updatedAt: z.string(),
  }),
);
