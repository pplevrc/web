import { mdToHtml } from "@lib/utils/html/markdown";
import type { Article } from "../../types";
import Thumbnail from "./thumbnail.png";
import Content from "./vket202xs.md?raw";

export async function getMockArticle(): Promise<Article> {
  return {
    content: await mdToHtml(Content),
    contentId: "04-vket202xs",
    id: "04-vket202xs",
    publishedAt: "2024-07-01T00:00:00.000Z",
    updatedAt: "2024-07-01T00:00:00.000Z",
    title: "Vket202X Summer イベント参加のお知らせ",
    description: "Vket202X Summer イベント参加のお知らせです。",
    keywords: ["Vket", "イベント"],
    thumbnail: Thumbnail.src,
    thumbnailAlt: "おえかきすき !",
    thumbnailLabel: "おえかきすき !",
    themeColor: "rose",
  };
}
