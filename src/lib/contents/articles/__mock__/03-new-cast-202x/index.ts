import type { Article } from "../..";
import Content from "./new-cast-202x.md?raw";
import Thumbnail from "./thumbnail.jpg";

export function getMockArticle(): Article {
  return {
    content: Content,
    id: "03-new-cast-202x",
    publishedAt: new Date("2023-11-01"),
    updatedAt: new Date("2023-11-01"),
    title: "新しい店員さんが来店します!",
    description: "新しい店員さんが来店します!",
    tags: ["新しい店員さん", "来店"],
    thumbnail: Thumbnail,
    thumbnailAlt: "サムネイルサンプル3",
  };
}
