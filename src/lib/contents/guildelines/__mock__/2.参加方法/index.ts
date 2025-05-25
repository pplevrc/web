import { mdToHtml } from "@lib/utils/content";
import type { Guideline } from "../..";
import Content from "./content.md?raw";
import Thumbnail from "./thumbnail.png";

export async function getMockGuideline(): Promise<Guideline> {
  return {
    id: "2",
    title: "参加方法",
    description: "ぷぷりえへの参加方法について",
    publishedAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    content: await mdToHtml(Content),
    keywords: ["ぷぷりえ", "VRChat"],
    thumbnail: Thumbnail,
    thumbnailAlt: "参加方法",
    ballonPosition: "topLeft",
    themeColor: "honey",
    shortcut: true,
  };
}
