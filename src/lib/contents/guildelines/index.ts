import type { ColorThemeBase } from "@lib/contents/commons/ColorToken";
import type { PageMeta } from "@lib/contents/meta";
import { memoize } from "@lib/utils/cache";
import { USE_MOCK } from "@lib/utils/env";
import {
  type MicroCMSGuideline,
  fetchContent,
  fetchContents,
} from "@lib/utils/microcms";
import { ensureNonNil } from "@lib/utils/type";
import { getMockGuidelines, getMockShortcutGuidelines } from "./__mock__";

export type BallonPosition =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

const LIST_LIMIT = 50;

export interface Guideline extends PageMeta {
  /**
   * 多分使わない値
   */
  contentId: string;

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
  ballonPosition: BallonPosition;

  /**
   *
   */
  themeColor: ColorThemeBase;
}

function convertMicroCMSToGuideline(
  microCMSGuideline: MicroCMSGuideline,
): Guideline {
  const {
    id,
    title,
    description,
    publishedAt,
    updatedAt,
    contents,
    keywords,
    "hero-image": heroImage,
    "ballon-position": ballonPosition,
    "theme-color": themeColor,
  } = microCMSGuideline;

  return {
    contentId: id,
    title,
    description,
    publishedAt: new Date(publishedAt),
    updatedAt: new Date(updatedAt),
    content: contents || "",
    keywords: (keywords ?? "")
      .split(",")
      // "".split -> [""] となるため
      .filter((k) => k.length > 0)
      .map((keyword) => keyword.trim()),
    thumbnail: heroImage.url,
    thumbnailAlt: microCMSGuideline.title,
    ballonPosition,
    themeColor,
  };
}

async function fetchGuidelinesMeta(): Promise<Omit<Guideline, "content">[]> {
  let results: Omit<Guideline, "content">[] = [];
  let offset = 0;

  while (true) {
    const response = await fetchContents("guidelines", {
      query: {
        fields: [
          "id",
          "title",
          "description",
          "hero-image",
          "theme-color",
          "ballon-position",
          "publishedAt",
          "updatedAt",
          "createdAt",
          "revisedAt",
        ],
        limit: LIST_LIMIT,
        offset,
      },
    });

    results = [
      ...results,
      ...response.contents.map(
        (c) => convertMicroCMSToGuideline(c) as Omit<Guideline, "content">,
      ),
    ];

    if (response.totalCount <= offset + LIST_LIMIT) {
      break;
    }

    offset += LIST_LIMIT;
  }

  return results;
}

async function fetchGuidelineById(id: string): Promise<Guideline> {
  const guideline = await fetchContent("guidelines", id);

  return convertMicroCMSToGuideline(guideline);
}

export const fetchGuidelines = memoize(
  async (): Promise<Omit<Guideline, "content">[]> => {
    return USE_MOCK ? getMockGuidelines() : fetchGuidelinesMeta();
  },
);

export const fetchGuidelineByTitle = memoize(
  async (title: string): Promise<Guideline> => {
    if (USE_MOCK) {
      const result = (await getMockGuidelines()).find(
        (guideline) => guideline.title === title,
      );
      return ensureNonNil(result);
    }

    const guidelines = await fetchGuidelines();

    const guidelineMeta = guidelines.find(
      (guideline) => guideline.title === title,
    );

    if (!guidelineMeta) {
      throw new Error(`Guideline not found: ${title}`);
    }

    return fetchGuidelineById(guidelineMeta.contentId);
  },
);

export const fetchGuidelineTitles = memoize(async (): Promise<string[]> => {
  const guidelines = await fetchGuidelines();

  return guidelines.map((guideline) => guideline.title);
});

async function fetchShortcutGuidelinesFromMicroCMS(): Promise<Guideline[]> {
  // TODO: MicroCMS API実装後に実装
  throw new Error("MicroCMS API not implemented yet");
}

export const fetchShortcutGuidelines = memoize(
  async (): Promise<Guideline[]> => {
    if (USE_MOCK) {
      return getMockShortcutGuidelines();
    }
    return fetchShortcutGuidelinesFromMicroCMS();
  },
);
