import type { Article } from "..";
import { getMockArticle as getMockArticle01 } from "./01-collab-202x-xx-xx";
import { getMockArticle as getMockArticle02 } from "./02-helloween-202x";
import { getMockArticle as getMockArticle03 } from "./03-new-cast-202x";
import { getMockArticle as getMockArticle04 } from "./04-vket202xs";

export function getMockArticles(): Article[] {
  return [
    getMockArticle01(),
    getMockArticle02(),
    getMockArticle03(),
    getMockArticle04(),
  ];
}
