import type { HeaderPageType } from "..";
import ArticleHeaderImage from "./お知らせヘッダー.png";
import ArticlesHeaderImage from "./お知らせ一覧ヘッダー.png";
import CastsHeaderImage from "./店員さん一覧ヘッダー.jpg";

export function getMockHeaderImage(type: HeaderPageType): ImageMetadata {
  switch (type) {
    case "casts":
      return CastsHeaderImage;
    case "articles":
      return ArticlesHeaderImage;
    case "article":
      return ArticleHeaderImage;
    case "guidelines":
      throw new Error("Not implemented");
    // return GuidelinesHeaderImage;
    case "staffs":
      throw new Error("Not implemented");
    // return StaffsHeaderImage;
  }
}
