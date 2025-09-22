import type { Guideline } from "@content/guidelines";
import { mdToHtml } from "@lib/utils/html/markdown";
import Content from "./content.md?raw";
import Thumbnail from "./thumbnail.png";

export async function getMockGuideline(): Promise<Omit<Guideline, "id">> {
  return {
    title: "参加方法",
    description: "ぷぷりえへの参加方法について",
    publishedAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    content: await mdToHtml(Content),
    keywords: ["ぷぷりえ", "VRChat"],
    thumbnail: Thumbnail.src,
    ballonPosition: "topLeft",
    themeColor: "honey",
  };
}
