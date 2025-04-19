import type { Article } from "../..";
import Content from "./helloween-202x.md?raw";
import Thumbnail from "./thumbnail.png";

export function getMockArticle(): Article {
  return {
    content: Content,
    id: "02-helloween-202x",
    publishedAt: new Date("2023-10-31"),
    updatedAt: new Date("2023-10-31"),
    title: "ハロウィンイベント202X開催のお知らせ",
    description: "ハロウィンイベント202X開催のお知らせです。",
    tags: ["ハロウィン", "イベント"],
    thumbnail: Thumbnail,
    thumbnailAlt: "サムネイルサンプル2",
  };
}
