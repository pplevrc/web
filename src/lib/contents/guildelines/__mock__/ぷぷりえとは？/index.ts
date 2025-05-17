import { mdToHtml } from "@lib/utils/content";
import type { Guideline } from "../..";
import Content from "./content.md?raw";
import Thumbnail from "./thumbnail.png";

export async function getMockGuideline(): Promise<Guideline> {
  return {
    id: "1",
    title: "ぷぷりえとは？",
    description: "ぷぷりえの概要や, ぷぷりえの特徴について",
    publishedAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    content: await mdToHtml(Content),
    keywords: ["ぷぷりえ", "VRChat"],
    thumbnail: Thumbnail,
    thumbnailAlt: "ぷぷりえとは？",
    ballonPosition: "bottomRight",
    themeColor: "rose",
  };
}
