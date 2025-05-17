import { mdToHtml } from "@lib/utils/content";
import type { Guideline } from "../..";
import Content from "./content.md?raw";
import Thumbnail from "./thumbnail.png";

export async function getMockGuideline(): Promise<Guideline> {
  return {
    id: "3",
    title: "ファン活動について",
    description: "店員さんイラストなどの二次創作について",
    publishedAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    content: await mdToHtml(Content),
    keywords: ["ぷぷりえ", "VRChat"],
    thumbnail: Thumbnail,
    thumbnailAlt: "じゃんがりあん",
    ballonPosition: "topRight",
    themeColor: "lavender",
  };
}
