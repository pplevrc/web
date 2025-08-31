import { mdToHtml } from "@lib/utils/content";
import type { Article } from "../..";
import Content from "./new-cast-202x.md?raw";
import Thumbnail from "./thumbnail.jpg";

export async function getMockArticle(): Promise<Article> {
  return {
    content: await mdToHtml(Content),
    contentId: "03-new-cast-202x",
    id: "03-new-cast-202x",
    publishedAt: new Date("2023-11-01"),
    updatedAt: new Date("2023-11-01"),
    title: "新しい店員さんが来店します!",
    description: "新しい店員さんが来店します!",
    keywords: ["新しい店員さん", "来店"],
    thumbnail: Thumbnail,
    thumbnailDisplayAlt: "しゅるちゃん !",
    themeColor: "matcha",
  };
}
