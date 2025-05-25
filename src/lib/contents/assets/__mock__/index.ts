import type { PageThumbnailType } from "..";
import ArticleThumbnailImage from "./お知らせ.png";
import ArticlesThumbnailImage from "./お知らせ一覧.png";
import GuidelinesThumbnailImage from "./ガイドライン一覧.png";
import HomeThumbnailImage from "./ホーム.png";
import CastsThumbnailImage from "./店員さん一覧.jpg";

export function getMockThumbnailImage(type: PageThumbnailType): ImageMetadata {
  switch (type) {
    case "home":
      return HomeThumbnailImage;
    case "casts":
      return CastsThumbnailImage;
    case "articles":
      return ArticlesThumbnailImage;
    case "article":
      return ArticleThumbnailImage;
    case "guidelines":
      return GuidelinesThumbnailImage;
    case "staffs":
      throw new Error("Not implemented");
    // return StaffsHeaderImage;
  }
}
