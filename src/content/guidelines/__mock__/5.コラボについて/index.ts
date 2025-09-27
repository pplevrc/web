import type { Guideline } from "@content/guidelines";
import { mdToHtml } from "@lib/utils/html/markdown";
import Content from "./content.md?raw";

export async function getMockGuideline(): Promise<Omit<Guideline, "id">> {
  return {
    title: "コラボについて",
    description:
      "ぷぷりえ営業日にコラボを開催する際の注意事項や, 相談先について",
    publishedAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    content: await mdToHtml(Content),
    keywords: ["ぷぷりえ", "VRChat"],
    thumbnail: "/__mock__/guidelines/thumbnail-05.png",
    ballonPosition: "topRight",
    themeColor: "ice",
  };
}
