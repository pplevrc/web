import { mdToHtml } from "@lib/utils/content";
import type { Guideline } from "../..";
import Content from "./content.md?raw";
import Thumbnail from "./thumbnail.png";

export async function getMockGuideline(): Promise<Guideline> {
  return {
    contentId: "4",
    title: "店員さん募集",
    description: "ぷぷりえの店員さん募集について",
    publishedAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    content: await mdToHtml(Content),
    keywords: ["ぷぷりえ", "VRChat"],
    thumbnail: Thumbnail,
    ballonPosition: "bottomLeft",
    themeColor: "matcha",
  };
}
