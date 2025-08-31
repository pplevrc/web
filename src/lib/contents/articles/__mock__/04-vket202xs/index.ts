import { mdToHtml } from "@lib/utils/content";
import type { Article } from "../..";
import Thumbnail from "./thumbnail.png";
import Content from "./vket202xs.md?raw";

export async function getMockArticle(): Promise<Article> {
  return {
    content: await mdToHtml(Content),
    contentId: "04-vket202xs",
    id: "04-vket202xs",
    publishedAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-07-01"),
    title: "Vket202X Summer イベント参加のお知らせ",
    description: "Vket202X Summer イベント参加のお知らせです。",
    keywords: ["Vket", "イベント"],
    thumbnail: Thumbnail,
    thumbnailDisplayAlt: "おえかきすき !",
    themeColor: "rose",
  };
}
