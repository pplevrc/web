import type { Article } from "../..";
import Content from "./collab-202x-xx-xx.md?raw";
import Thumbnail from "./thumbnail.png";

export function getMockArticle(): Article {
  return {
    content: Content,
    id: "01-collab-202x-xx-xx",
    publishedAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    title: "VTuber XXX さんが来店します!",
    description: "VTuber XXX さんが来店します!",
    tags: ["VTuber", "コラボ", "イベント"],
    thumbnail: Thumbnail,
    thumbnailAlt: "サムネイルサンプル1",
  };
}
