import type { ColorThemeBase } from "@lib/contents/commons/ColorToken";
import { memoize } from "@lib/utils/cache";
import type { ImageMetadata } from "astro";
import { getMockGuidelines, getMockShortcutGuidelines } from "./__mock__";

export type BallonPosition =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

export interface Guideline {
  /**
   *
   */
  title: string;

  /**
   * 多分使わない値
   */
  id: string;

  /**
   *
   */
  description: string;

  /**
   *
   */
  publishedAt: Date;

  /**
   *
   */
  updatedAt: Date;

  /**
   * HTML
   */
  content: string;

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
  ballonPosition: BallonPosition;

  /**
   *
   */
  themeColor: ColorThemeBase;

  /**
   *
   */
  shortcut: boolean;
}

export const fetchGuidelines = memoize(async (): Promise<Guideline[]> => {
  return getMockGuidelines();
});

export const fetchGuidelineByTitle = memoize(
  async (title: string): Promise<Guideline> => {
    const guidelines = await fetchGuidelines();

    const guideline = guidelines.find((guideline) => guideline.title === title);

    if (!guideline) {
      throw new Error(`Guideline not found: ${title}`);
    }

    return guideline;
  },
);

export const fetchGuidelineTitles = memoize(async (): Promise<string[]> => {
  const guidelines = await fetchGuidelines();

  return guidelines.map((guideline) => guideline.title);
});

export const fetchShortcutGuidelines = memoize(
  async (): Promise<Guideline[]> => {
    return getMockShortcutGuidelines();
  },
);
