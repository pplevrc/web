import { mdToHtml } from "@lib/utils/content";
import type { Article } from "../..";
import Content from "./collab-202x-xx-xx.md?raw";
import Thumbnail from "./thumbnail.png";

export async function getMockArticle(): Promise<Article> {
  return {
    content: await mdToHtml(Content),
    id: "01-collab-202x-xx-xx",
    publishedAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    title: "VTuber XXX さんが来店します!",
    description: "VTuber XXX さんが来店します!",
    keywords: ["VTuber", "コラボ", "イベント"],
    thumbnail: Thumbnail,
    thumbnailAlt: "サムネイルサンプル1",
    thumbnailDisplayAlt: "でかぽに !",
    themeColor: "berry",
  };
}
