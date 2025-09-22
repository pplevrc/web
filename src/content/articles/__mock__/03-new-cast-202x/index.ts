import { mdToHtml } from "@lib/utils/content";
import type { Article } from "../../types";
import Content from "./new-cast-202x.md?raw";
import Thumbnail from "./thumbnail.jpg";

export async function getMockArticle(): Promise<Article> {
  return {
    content: await mdToHtml(Content),
    contentId: "03-new-cast-202x",
    id: "03-new-cast-202x",
    publishedAt: "2023-11-01T00:00:00.000Z",
    updatedAt: "2023-11-01T00:00:00.000Z",
    title: "新しい店員さんが来店します!",
    description: "新しい店員さんが来店します!",
    keywords: ["新しい店員さん", "来店"],
    thumbnail: Thumbnail.src,
    thumbnailAlt: "しゅるちゃん !",
    thumbnailLabel: "しゅるちゃん !",
    themeColor: "matcha",
  };
}
