import { mdToHtml } from "@lib/utils/html/markdown";
import type { Article } from "../../types";
import Content from "./collab-202x-xx-xx.md?raw";
import Thumbnail from "./thumbnail.png";

export async function getMockArticle(): Promise<Article> {
  return {
    content: await mdToHtml(Content),
    contentId: "01-collab-202x-xx-xx",
    id: "01-collab-202x-xx-xx",
    publishedAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    title: "VTuber XXX さんが来店します!",
    description: "VTuber XXX さんが来店します!",
    keywords: ["VTuber", "コラボ", "イベント"],
    thumbnail: Thumbnail.src,
    thumbnailAlt: "でかぽに !",
    thumbnailLabel: "でかぽに !",
    themeColor: "berry",
  };
}
