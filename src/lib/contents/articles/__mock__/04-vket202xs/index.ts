import type { Article } from "../..";
import Thumbnail from "./thumbnail.png";
import Content from "./vket202xs.md?raw";

export function getMockArticle(): Article {
  return {
    content: Content,
    id: "04-vket202xs",
    publishedAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-07-01"),
    title: "Vket202X Summer イベント参加のお知らせ",
    description: "Vket202X Summer イベント参加のお知らせです。",
    tags: ["Vket", "イベント"],
    thumbnail: Thumbnail,
    thumbnailAlt: "サムネイルサンプル4",
  };
}
