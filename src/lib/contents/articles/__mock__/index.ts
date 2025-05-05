import { defaultRandom, randomDate } from "@lib/utils/random";
import type { Article } from "..";
import { getMockArticle as getMockArticle01 } from "./01-collab-202x-xx-xx";
import { getMockArticle as getMockArticle02 } from "./02-helloween-202x";
import { getMockArticle as getMockArticle03 } from "./03-new-cast-202x";
import { getMockArticle as getMockArticle04 } from "./04-vket202xs";

export async function getMockArticles(): Promise<Article[]> {
  const _articles = [
    await getMockArticle01(),
    await getMockArticle02(),
    await getMockArticle03(),
    await getMockArticle04(),
  ];

  // テスト用に article の内容を 20 倍にして, 日付を 2 年前からランダムに振り直す

  const random = defaultRandom();

  const articles = [
    ..._articles,
    ..._articles,
    ..._articles,
    ..._articles,
    ..._articles,
    ..._articles,
    ..._articles,
    ..._articles,
    ..._articles,
    ..._articles,
    ..._articles,
    ..._articles,
    ..._articles,
    ..._articles,
    ..._articles,
    ..._articles,
    ..._articles,
    ..._articles,
    ..._articles,
    ..._articles,
  ]
    .map((article): Article => {
      const date = randomDate({
        start: new Date("2023-04-25"),
        end: new Date("2025-04-25"),
        createRandom: random,
      });
      return {
        ...article,
        publishedAt: date,
        updatedAt: date,
      };
    })
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return articles;
}
