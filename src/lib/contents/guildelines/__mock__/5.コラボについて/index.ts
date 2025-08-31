import { mdToHtml } from "@lib/utils/content";
import type { Guideline } from "../..";
import Content from "./content.md?raw";
import Thumbnail from "./thumbnail.png";

export async function getMockGuideline(): Promise<Guideline> {
  return {
    contentId: "5",
    title: "コラボについて",
    description:
      "ぷぷりえ営業日にコラボを開催する際の注意事項や, 相談先について",
    publishedAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    content: await mdToHtml(Content),
    keywords: ["ぷぷりえ", "VRChat"],
    thumbnail: Thumbnail,
    ballonPosition: "topRight",
    themeColor: "ice",
  };
}
