import { mdToHtml } from "@lib/utils/html/markdown";
import type { Article } from "../../types";
import Content from "./helloween-202x.md?raw";

export async function getMockArticle(): Promise<Article> {
  return {
    content: await mdToHtml(Content),
    contentId: "02-helloween-202x",
    id: "02-helloween-202x",
    publishedAt: "2023-10-31T00:00:00.000Z",
    updatedAt: "2023-10-31T00:00:00.000Z",
    title: "ハロウィンイベント202X開催のお知らせ",
    description: "ハロウィンイベント202X開催のお知らせです。",
    keywords: ["ハロウィン", "イベント"],
    thumbnail: "/__mock__/articles/thumbnail-02.png",
    thumbnailAlt: "がうー",
    thumbnailLabel: "がうー",
    themeColor: "honey",
  };
}
