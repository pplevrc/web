import { mdToHtml } from "@lib/utils/content";
import type { Article } from "../..";
import Content from "./helloween-202x.md?raw";
import Thumbnail from "./thumbnail.png";

export async function getMockArticle(): Promise<Article> {
  return {
    content: await mdToHtml(Content),
    contentId: "02-helloween-202x",
    id: "02-helloween-202x",
    publishedAt: new Date("2023-10-31"),
    updatedAt: new Date("2023-10-31"),
    title: "ハロウィンイベント202X開催のお知らせ",
    description: "ハロウィンイベント202X開催のお知らせです。",
    keywords: ["ハロウィン", "イベント"],
    thumbnail: Thumbnail,
    thumbnailDisplayAlt: "がうー",
    themeColor: "honey",
  };
}
