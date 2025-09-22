import type { Meta } from "@content/meta";
import ArticlesThumbnailImage from "./お知らせ.png";
import GuidelinesThumbnailImage from "./ガイドライン.png";
import HomeThumbnailImage from "./ホーム.png";
import CastsThumbnailImage from "./店員さん.jpg";

export function getMockMeta(): Meta {
  return {
    publishedAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    commonKeywords: [],
    official: {
      copyright: "Copyright © 2021 ロリっ子喫茶ぷぷりえ",
      socialLinks: [
        {
          type: "x",
          url: "https://x.com/pplevrc",
          description: "ロリっ子喫茶ぷぷりえ公式Xアカウント",
        },
        {
          type: "youtube",
          url: "https://www.youtube.com/@pplech",
          description:
            "ロリっ子喫茶ぷぷりえ公式 YouTube チャンネル | ぷぷりえちゃんねる",
        },
        {
          type: "pixiv-booth",
          url: "https://pple.booth.pm/",
          description: "ロリっ子喫茶ぷぷりえ公式 Booth ストア",
        },
      ],
    },
    guidelinesShortcut: [
      {
        title: "ぷぷりえとは？",
        themeColor: "rose",
      },
      {
        title: "参加方法",
        themeColor: "honey",
      },
    ],
    guideline: {
      title: "{title}",
      description: "{description}",
      keywords: [],
    },
    guidelines: {
      title: "ガイドライン",
      description: "ガイドライン",
      backLinkLabel: "ガイドライン一覧に戻る",
      keywords: [],
      thumbnail: GuidelinesThumbnailImage.src,
    },
    article: {
      title: "{title}",
      description: "{description}",
      keywords: [],
    },
    articles: {
      title: "お知らせ",
      description: "お知らせ",
      backLinkLabel: "お知らせ一覧に戻る",
      keywords: [],
      thumbnail: ArticlesThumbnailImage.src,
    },
    cast: {
      title: "{nickname}",
      description: "{nickname}の紹介！",
      keywords: ["{nickname}"],
    },
    casts: {
      title: "店員さん",
      description: "店員さん",
      backLinkLabel: "店員さん一覧に戻る",
      keywords: [],
      thumbnail: CastsThumbnailImage.src,
    },
    home: {
      title: "ホーム",
      description: "ホーム",
      backLinkLabel: "ホームに戻る",
      keywords: [],
      thumbnail: HomeThumbnailImage.src,
    },
  };
}
